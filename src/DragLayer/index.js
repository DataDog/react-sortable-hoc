import {
  events,
  vendorPrefix,
  getPosition,
  getElementMargin,
  getEdgeOffset,
  limit,
} from '../utils';
import {closestRect, updateDistanceBetweenContainers} from './utils';

export default class DragLayer {
  helper = null;
  lists = [];

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
    const { useWindowAsScrollContainer } = list.props;

    this.minTranslate = {};
    this.maxTranslate = {};
    if (this.axis.x) {
      this.minTranslate.x = (useWindowAsScrollContainer
        ? 0
        : containerBoundingRect.left) -
        this.boundingClientRect.left -
        this.width / 2;
      this.maxTranslate.x = (useWindowAsScrollContainer
        ? list.contentWindow.innerWidth
        : containerBoundingRect.left + containerBoundingRect.width) -
        this.boundingClientRect.left -
        this.width / 2;
    }
    if (this.axis.y) {
      this.minTranslate.y = (useWindowAsScrollContainer
        ? 0
        : containerBoundingRect.top) -
        this.boundingClientRect.top -
        this.height / 2;
      this.maxTranslate.y = (useWindowAsScrollContainer
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
      const {
        axis,
        getHelperDimensions,
      } = list.props;
      const {node, collection} = activeNode;
      const {index} = node.sortableInfo;
      const margin = getElementMargin(node);
      const containerBoundingRect = list.container.getBoundingClientRect();
      const dimensions = getHelperDimensions({index, node, collection});

      this.width = dimensions.width;
      this.height = dimensions.height;
      this.marginOffset = {
        x: margin.left + margin.right,
        y: Math.max(margin.top, margin.bottom),
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

      const fields = node.querySelectorAll('input, textarea, select, canvas');
      const clonedNode = node.cloneNode(true);
      const clonedFields = [
        ...clonedNode.querySelectorAll('input, textarea, select, canvas'),
      ]; // Convert NodeList to Array

      clonedFields.forEach((field, index) => {
        if (field.tagName === 'CANVAS') {
          if (fields[index].tagName === 'CANVAS') {
            const destCtx = field.getContext('2d');
            destCtx.drawImage(fields[index], 0, 0);
          }
        } else if (field.type !== 'file' && fields[index]) {
          field.value = fields[index].value;
        }
      });

      this.helper = parent.appendChild(clonedNode);

      this.helper.style.position = 'fixed';
      this.helper.style.top = `${this.boundingClientRect.top - margin.top}px`;
      this.helper.style.left = `${this.boundingClientRect.left -
        margin.left}px`;
      this.helper.style.width = `${this.width}px`;
      this.helper.style.height = `${this.height}px`;
      this.helper.style.boxSizing = 'border-box';
      this.helper.style.pointerEvents = 'none';

      this.setTranslateBoundaries(containerBoundingRect, list);

      this.listenerNode = event.touches ? node : list.contentWindow;
      events.move.forEach(eventName =>
        this.listenerNode.addEventListener(
          eventName,
          this.handleSortMove,
          false,
        ));
      events.end.forEach(eventName =>
        this.listenerNode.addEventListener(
          eventName,
          this.handleSortEnd,
          false,
        ));

      return activeNode;
    }
    return false;
  }

  stopDrag() {
    this.handleSortEnd();
  }

  handleSortMove = event => {
    event.preventDefault(); // Prevent scrolling on mobile
    this.updatePosition(event);
    this.updateTargetContainer(event);
    if (this.targetList) {
      this.targetList.handleSortMove(event);
    }
  };

  handleSortEnd = event => {
    if (this.listenerNode) {
      events.move.forEach(eventName =>
        this.listenerNode.removeEventListener(eventName, this.handleSortMove));
      events.end.forEach(eventName =>
        this.listenerNode.removeEventListener(eventName, this.handleSortEnd));
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
    this.lists.forEach(list => {
      delete list.initialWindowScroll;
    });
  };

  updatePosition(event) {
    const {lockAxis, lockToContainerEdges} = this.targetList.props;
    const position = getPosition(event);
    const translate = {
      x: position.x - this.initialOffset.x,
      y: position.y - this.initialOffset.y,
    };
    // Adjust for window scroll
    translate.y -= (window.pageYOffset - this.targetList.initialWindowScroll.top);
    translate.x -= (window.pageXOffset - this.targetList.initialWindowScroll.left);

    this.translate = translate;
    this.delta = position;

    if (lockToContainerEdges) {
      const [
        minLockOffset,
        maxLockOffset,
      ] = this.targetList.getLockPixelOffsets();
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
          translate.x
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

    this.helper.style[
      `${vendorPrefix}Transform`
    ] = `translate3d(${translate.x}px,${translate.y}px, 0)`;
  }

  updateTargetContainer(event) {
    const {x, y} = this.delta;
    const originList = this.targetList;
    const targetList = this.lists[
      closestRect(x, y, this.lists.map(l => l.container))
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
        originList
      );

      const targetListRect = targetList.container.getBoundingClientRect();

      // If we're moving up the container ...
      if (targetListRect.top < cachedOriginListRect.top) {
        // Calculate any height difference that has occurred on the target container during the DND
        const targetListContainerHeightDelta = Math.abs(cachedTargetListRect.height - targetListRect.height);
        this.distanceBetweenContainers.y += targetListContainerHeightDelta;
      }
    }
  }
}
