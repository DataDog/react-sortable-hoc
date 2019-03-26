import {
  cloneNode,
  closestRect,
  events,
  getPosition,
  getElementMargin,
  getEdgeOffset,
  getLockPixelOffsets,
  limit,
  setInlineStyles,
  setTranslate3d,
  updateDistanceBetweenContainers,
} from '../utils';

export default class DragLayer {
  helper = null;
  lists = [];

  handleSortMove = (event) => {
    // Prevent scrolling on mobile
    event.preventDefault();
    this.updatePosition(event);
    this.updateTargetContainer(event);
    if (this.targetList) {
      this.targetList.handleSortMove(event);
    }
  };

  handleSortEnd = (event) => {
    if (this.listenerNode) {
      events.move.forEach((eventName) =>
        this.listenerNode.removeEventListener(eventName, this.handleSortMove),
      );
      events.end.forEach((eventName) =>
        this.listenerNode.removeEventListener(eventName, this.handleSortEnd),
      );
    }

    if (typeof this.onDragEnd === 'function') {
      this.onDragEnd();
    }
    // Remove the helper from the DOM
    if (this.helper) {
      this.helper.parentNode.removeChild(this.helper);
      this.helper = null;
      this.targetList.handleSortEnd(event);
    }

    // Reset window scroll & container height diff
    this.lists.forEach((list) => {
      delete list.initialWindowScroll;
    });
  };

  addRef(list) {
    this.lists.push(list);
  }

  removeRef(list) {
    const i = this.lists.indexOf(list);
    if (i !== -1) {
      this.lists.splice(i, 1);
    }
  }

  setTranslateBoundaries(containerBoundingRect, list) {
    const {useWindowAsScrollContainer} = list.props;

    this.minTranslate = {};
    this.maxTranslate = {};
    if (this.axis.x) {
      this.minTranslate.x =
        (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) -
        this.boundingClientRect.left -
        this.width / 2;
      this.maxTranslate.x =
        (useWindowAsScrollContainer
          ? list.contentWindow.innerWidth
          : containerBoundingRect.left + containerBoundingRect.width) -
        this.boundingClientRect.left -
        this.width / 2;
    }
    if (this.axis.y) {
      this.minTranslate.y =
        (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) -
        this.boundingClientRect.top -
        this.height / 2;
      this.maxTranslate.y =
        (useWindowAsScrollContainer
          ? list.contentWindow.innerHeight
          : containerBoundingRect.top + containerBoundingRect.height) -
        this.boundingClientRect.top -
        this.height / 2;
    }
  }

  startDrag(parent, list, event) {
    const position = getPosition(event);
    const activeNode = list.manager.getActive();

    if (activeNode) {
      const {axis, getHelperDimensions} = list.props;
      const {node, collection} = activeNode;
      const {index} = node.sortableInfo;
      const margin = getElementMargin(node);
      const containerBoundingRect = list.scrollContainer.getBoundingClientRect();
      const dimensions = getHelperDimensions({collection, index, node});

      this.node = node;
      this.margin = margin;
      this.width = dimensions.width;
      this.height = dimensions.height;
      this.marginOffset = {
        x: this.margin.left + this.margin.right,
        y: Math.max(this.margin.top, this.margin.bottom),
      };
      this.boundingClientRect = node.getBoundingClientRect();
      this.containerBoundingRect = containerBoundingRect;
      this.targetList = list;

      this.axis = {
        x: axis.indexOf('x') >= 0,
        y: axis.indexOf('y') >= 0,
      };
      this.offsetEdge = getEdgeOffset(node, list.container);

      this.initialOffset = position;
      this.distanceBetweenContainers = {
        x: 0,
        y: 0,
      };

      this.helper = parent.appendChild(cloneNode(node));

      setInlineStyles(this.helper, {
        boxSizing: 'border-box',
        height: `${this.height}px`,
        left: `${this.boundingClientRect.left - margin.left}px`,
        pointerEvents: 'none',
        position: 'fixed',
        top: `${this.boundingClientRect.top - margin.top}px`,
        width: `${this.width}px`,
      });

      this.setTranslateBoundaries(containerBoundingRect, list);

      this.listenerNode = event.touches ? node : list.contentWindow;
      events.move.forEach((eventName) =>
        this.listenerNode.addEventListener(
          eventName,
          this.handleSortMove,
          false,
        ),
      );
      events.end.forEach((eventName) =>
        this.listenerNode.addEventListener(
          eventName,
          this.handleSortEnd,
          false,
        ),
      );

      return activeNode;
    }
    return false;
  }

  stopDrag() {
    this.handleSortEnd();
  }

  updatePosition(event) {
    const {lockAxis, lockOffset, lockToContainerEdges} = this.targetList.props;
    const offset = getPosition(event);
    const translate = {
      x: offset.x - this.initialOffset.x,
      y: offset.y - this.initialOffset.y,
    };
    // Adjust for window scroll
    translate.y -= window.pageYOffset - this.targetList.initialWindowScroll.top;
    translate.x -=
      window.pageXOffset - this.targetList.initialWindowScroll.left;

    this.translate = translate;
    this.delta = offset;

    if (lockToContainerEdges) {
      const [minLockOffset, maxLockOffset] = getLockPixelOffsets({
        height: this.height,
        lockOffset,
        width: this.width,
      });
      const minOffset = {
        x: this.width / 2 - minLockOffset.x,
        y: this.height / 2 - minLockOffset.y,
      };
      const maxOffset = {
        x: this.width / 2 - maxLockOffset.x,
        y: this.height / 2 - maxLockOffset.y,
      };

      translate.x = limit(
        this.minTranslate.x + minOffset.x,
        this.maxTranslate.x - maxOffset.x,
        translate.x,
      );
      translate.y = limit(
        this.minTranslate.y + minOffset.y,
        this.maxTranslate.y - maxOffset.y,
        translate.y,
      );
    }

    if (lockAxis === 'x') {
      translate.y = 0;
    } else if (lockAxis === 'y') {
      translate.x = 0;
    }

    setTranslate3d(this.helper, translate);
  }

  updateTargetContainer(event) {
    const {x, y} = this.delta;
    const originList = this.targetList;
    const targetList = this.lists[
      closestRect(x, y, this.lists.map((list) => list.container))
    ];
    const {item} = this.targetList.manager.active;
    this.active = item;
    if (targetList !== originList) {
      this.targetList = targetList;

      // Store initial scroll and dimensions of origin list, and initial
      // dimensions of target list. This is to later accommodate height changes
      // in both lists when items are added or removed during the DND operation.
      const originListInitialWindowScroll = originList.initialWindowScroll;
      const cachedOriginListRect = originList.container.getBoundingClientRect();
      const cachedTargetListRect = targetList.container.getBoundingClientRect();

      originList.handleSortEnd(event, targetList);

      this.setTranslateBoundaries(
        targetList.container.getBoundingClientRect(),
        targetList,
      );
      this.targetList.manager.active = {
        ...targetList.getClosestNode(event),
        item,
      };
      targetList.handlePress(event);

      // Override initial scroll to use scroll of origin list
      this.targetList.initialWindowScroll = originListInitialWindowScroll;

      this.distanceBetweenContainers = updateDistanceBetweenContainers(
        this.distanceBetweenContainers,
        targetList,
        originList,
      );

      const targetListRect = targetList.container.getBoundingClientRect();

      // If we're moving up the container ...
      if (targetListRect.top < cachedOriginListRect.top) {
        // Calculate any height difference that has occurred on the target container during the DND
        const targetListContainerHeightDelta = Math.abs(
          cachedTargetListRect.height - targetListRect.height,
        );
        this.distanceBetweenContainers.y += targetListContainerHeightDelta;
      }
    }
  }
}
