import * as React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';
import findIndex from 'lodash/findIndex';
import isPlainObject from 'lodash/isPlainObject';
import DragLayer from '../DragLayer';
import Manager from '../Manager';
import {
  closest,
  events,
  vendorPrefix,
  getEdgeOffset,
  getLockPixelOffset,
  getPosition,
  isTouchEvent,
  provideDisplayName,
  omit,
} from '../utils';
import {closestRect} from '../DragLayer/utils';
import 'classlist-polyfill';

export default function sortableContainer(
  WrappedComponent,
  config = {withRef: false},
) {
  return class WithSortableContainer extends React.Component {
    constructor(props) {
      super(props);
      this.dragLayer = props.dragLayer || new DragLayer();
      this.dragLayer.addRef(this);
      this.dragLayer.onDragEnd = props.onDragEnd;
      this.manager = new Manager();
      this.events = {
        start: this.handleStart,
        move: this.handleMove,
        end: this.handleEnd,
      };

      invariant(
        !(props.distance && props.pressDelay),
        'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.',
      );

      this.state = {};
      this.sorting = false;
    }

    static displayName = provideDisplayName('sortableList', WrappedComponent);

    static defaultProps = {
      axis: 'y',
      transitionDuration: 300,
      pressDelay: 0,
      pressThreshold: 5,
      distance: 0,
      useWindowAsScrollContainer: false,
      hideSortableGhost: true,
      animateNodes: true,
      shouldCancelStart(event) {
        // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
        const disabledElements = [
          'input',
          'textarea',
          'select',
          'option',
          'button',
        ];

        if (
          disabledElements.indexOf(event.target.tagName.toLowerCase()) !== -1
        ) {
          // Return true to cancel sorting
          return true;
        }

        return false;
      },
      lockToContainerEdges: false,
      lockOffset: '50%',
      getHelperDimensions: ({node}) => ({
        width: node.offsetWidth,
        height: node.offsetHeight,
      }),
    };

    static propTypes = {
      axis: PropTypes.oneOf(['x', 'y', 'xy']),
      distance: PropTypes.number,
      dragLayer: PropTypes.object,
      lockAxis: PropTypes.string,
      helperClass: PropTypes.string,
      transitionDuration: PropTypes.number,
      contentWindow: PropTypes.any,
      updateBeforeSortStart: PropTypes.func,
      onSortStart: PropTypes.func,
      onSortMove: PropTypes.func,
      onSortOver: PropTypes.func,
      onSortEnd: PropTypes.func,
      onDragEnd: PropTypes.func,
      shouldCancelStart: PropTypes.func,
      pressDelay: PropTypes.number,
      pressThreshold: PropTypes.number,
      useDragHandle: PropTypes.bool,
      animateNodes: PropTypes.bool,
      useWindowAsScrollContainer: PropTypes.bool,
      hideSortableGhost: PropTypes.bool,
      lockToContainerEdges: PropTypes.bool,
      lockOffset: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ),
      ]),
      getContainer: PropTypes.func,
      getHelperDimensions: PropTypes.func,
      helperContainer: PropTypes.instanceOf(HTMLElement),
    };

    static childContextTypes = {
      manager: PropTypes.object.isRequired,
    };

    getChildContext() {
      return {
        manager: this.manager,
      };
    }

    componentDidMount() {
      const {useWindowAsScrollContainer} = this.props;

      /*
       *  Set our own default rather than using defaultProps because Jest
       *  snapshots will serialize window, causing a RangeError
       *  https://github.com/clauderic/react-sortable-hoc/issues/249
       */

      const container = this.getContainer();

      Promise.resolve(container).then((containerNode) => {
        this.container = containerNode;
        this.document = this.container.ownerDocument || document;

        const contentWindow =
          this.props.contentWindow || this.document.defaultView || window;

        this.contentWindow =
          typeof contentWindow === 'function' ? contentWindow() : contentWindow;
        this.scrollContainer = useWindowAsScrollContainer
          ? this.document.scrollingElement || this.document.documentElement
          : this.container;
        this.initialScroll = {
          top: this.scrollContainer.scrollTop,
          left: this.scrollContainer.scrollLeft,
        };

        for (const key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            events[key].forEach((eventName) =>
              this.container.addEventListener(
                eventName,
                this.events[key],
                false,
              ),
            );
          }
        }
      });
    }

    componentWillUnmount() {
      this.dragLayer.removeRef(this);
      if (this.container) {
        for (const key in this.events) {
          if (this.events.hasOwnProperty(key)) {
            events[key].forEach((eventName) =>
              this.container.removeEventListener(eventName, this.events[key]),
            );
          }
        }
      }
    }

    componentWillReceiveProps(nextProps) {
      const {active} = this.manager;
      if (!active) {
        return;
      }
      this.checkActiveIndex(nextProps);
    }

    checkActiveIndex = (nextProps) => {
      const {items} = nextProps || this.props;
      const {item} = this.manager.active;

      // If sortable item is an object, find item that match id
      // Otherwise let findIndex predicate on item
      const newIndex = isPlainObject(item)
        ? findIndex(items, (obj) => obj.id === item.id)
        : findIndex(items, item);

      if (newIndex === -1) {
        this.dragLayer.stopDrag();
        return;
      }
      this.manager.active.index = newIndex;
      this.index = newIndex;
    };

    handleStart = (event) => {
      const {distance, shouldCancelStart, items} = this.props;

      if (event.button === 2 || shouldCancelStart(event)) {
        return;
      }

      this._touched = true;
      this._pos = getPosition(event);

      const node = closest(event.target, (el) => el.sortableInfo != null);

      if (
        node &&
        node.sortableInfo &&
        this.nodeIsChild(node) &&
        !this.sorting
      ) {
        const {useDragHandle} = this.props;
        const {index, collection} = node.sortableInfo;

        if (
          useDragHandle &&
          !closest(event.target, (el) => el.sortableHandle != null)
        ) {
          return;
        }

        this.manager.active = {index, collection, item: items[index]};

        /*
         * Fixes a bug in Firefox where the :active state of anchor tags
         * prevent subsequent 'mousemove' events from being fired
         * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
         */
        if (
          !isTouchEvent(event) &&
          event.target.tagName.toLowerCase() === 'a'
        ) {
          event.preventDefault();
        }

        if (!distance) {
          if (this.props.pressDelay === 0) {
            this.handlePress(event);
          } else {
            this.pressTimer = setTimeout(
              () => this.handlePress(event),
              this.props.pressDelay,
            );
          }
        }
      }
    };

    nodeIsChild = (node) => {
      return node.sortableInfo.manager === this.manager;
    };

    handleMove = (event) => {
      const {distance, pressThreshold} = this.props;
      if (
        !this.sorting &&
        this._touched &&
        !this._awaitingUpdateBeforeSortStart
      ) {
        const position = getPosition(event);
        const delta = {
          x: this._pos.x - position.x,
          y: this._pos.y - position.y,
        };
        const combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);

        this.delta = delta;

        if (
          !distance &&
          (!pressThreshold ||
            (pressThreshold && combinedDelta >= pressThreshold))
        ) {
          clearTimeout(this.cancelTimer);
          this.cancelTimer = setTimeout(this.cancel, 0);
        } else if (
          distance &&
          combinedDelta >= distance &&
          this.manager.isActive()
        ) {
          this.handlePress(event);
        }
      }
    };

    handleEnd = () => {
      this._touched = false;
      this.cancel();
    };

    cancel = () => {
      const {distance} = this.props;

      if (!this.sorting) {
        if (!distance) {
          clearTimeout(this.pressTimer);
        }
        this.manager.active = null;
      }
    };

    handlePress = async (event) => {
      let active = null;
      if (this.dragLayer.helper) {
        if (this.manager.active) {
          this.checkActiveIndex();
          active = this.manager.getActive();
        }
      } else {
        active = this.dragLayer.startDrag(this.document.body, this, event);
      }

      if (active) {
        const {
          axis,
          helperClass,
          hideSortableGhost,
          updateBeforeSortStart,
          onSortStart,
        } = this.props;
        const {node, collection} = active;
        const {index} = node.sortableInfo;

        if (typeof updateBeforeSortStart === 'function') {
          this._awaitingUpdateBeforeSortStart = true;

          try {
            await updateBeforeSortStart({node, index, collection}, event);
          } finally {
            this._awaitingUpdateBeforeSortStart = false;
          }
        }

        this.index = index;
        this.newIndex = index;
        this.axis = {
          x: axis.indexOf('x') >= 0,
          y: axis.indexOf('y') >= 0,
        };

        this.initialScroll = {
          top: this.container.scrollTop,
          left: this.container.scrollLeft,
        };

        this.initialWindowScroll = {
          top: window.pageYOffset,
          left: window.pageXOffset,
        };

        if (hideSortableGhost) {
          this.sortableGhost = node;
          node.style.visibility = 'hidden';
          node.style.opacity = 0;
        }

        if (helperClass) {
          this.dragLayer.helper.classList.add(...helperClass.split(' '));
        }

        this.sorting = true;
        this.sortingIndex = index;

        if (onSortStart) {
          onSortStart({node, index, collection}, event);
        }
      }
    };

    _handleSortMove = (event) => {
      // animate nodes if required
      if (this.checkActive(event)) {
        this.animateNodes();
        this.autoscroll();
      }

      if (window.requestAnimationFrame) {
        this.sortMoveAF = null;
      } else {
        // aim for 60 fps
        setTimeout(() => {
          this.sortMoveAF = null;
        }, 1000 / 60);
      }
    };

    handleSortMove = (event) => {
      const {onSortMove} = this.props;
      // Prevent scrolling on mobile
      event.preventDefault();

      if (this.sortMoveAF) {
        return;
      }

      if (window.requestAnimationFrame) {
        this.sortMoveAF = window.requestAnimationFrame(this._handleSortMove);
      } else {
        this.sortMoveAF = true;
        // call inner function now if no animation frame
        this._handleSortMove();
      }

      if (onSortMove) {
        onSortMove(event);
      }
    };

    handleSortEnd = (event, newList = null) => {
      const {hideSortableGhost, onSortEnd} = this.props;
      if (!this.manager.active) {
        return;
      }
      const {collection} = this.manager.active;

      // Remove the move handler if there's a frame that hasn't run yet.
      if (window.cancelAnimationFrame && this.sortMoveAF) {
        window.cancelAnimationFrame(this.sortMoveAF);
        this.sortMoveAF = null;
      }

      if (hideSortableGhost && this.sortableGhost) {
        this.sortableGhost.style.visibility = '';
        this.sortableGhost.style.opacity = '';
      }

      const nodes = this.manager.refs[collection];
      for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const el = node.node;

        // Clear the cached offsetTop / offsetLeft value
        node.edgeOffset = null;

        // Remove the transforms / transitions
        el.style[`${vendorPrefix}Transform`] = '';
        el.style[`${vendorPrefix}TransitionDuration`] = '';
      }

      // Stop autoscroll
      clearInterval(this.autoscrollInterval);
      this.autoscrollInterval = null;

      // Update state
      this.manager.active = null;

      this.sorting = false;
      this.sortingIndex = null;

      if (typeof onSortEnd === 'function') {
        // get the index in the new list
        if (newList) {
          this.newIndex = newList.getClosestNode(event).index;
        }

        onSortEnd(
          {
            oldIndex: this.index,
            newIndex: this.newIndex,
            newList,
            collection,
          },
          event,
        );
      }

      this._touched = false;
    };

    handleSortSwap = (index, item) => {
      const {onSortSwap} = this.props;
      if (typeof onSortSwap === 'function') {
        onSortSwap({
          index,
          item,
        });
      }
    };

    getLockPixelOffsets() {
      const {width, height} = this.dragLayer;
      const {lockOffset} = this.props;
      const offsets = Array.isArray(lockOffset)
        ? lockOffset
        : [lockOffset, lockOffset];

      invariant(
        offsets.length === 2,
        'lockOffset prop of SortableContainer should be a single ' +
          'value or an array of exactly two values. Given %s',
        lockOffset,
      );

      const [minLockOffset, maxLockOffset] = offsets;

      return [
        getLockPixelOffset({lockOffset: minLockOffset, width, height}),
        getLockPixelOffset({lockOffset: maxLockOffset, width, height}),
      ];
    }

    getClosestNode = (event) => {
      const position = getPosition(event);
      // eslint-disable-next-line
      let closestNodes = [];
      // eslint-disable-next-line
      let closestCollections = [];

      Object.keys(this.manager.refs).forEach((collection) => {
        const nodes = this.manager.refs[collection].map((ref) => ref.node);
        if (nodes && nodes.length > 0) {
          closestNodes.push(nodes[closestRect(position.x, position.y, nodes)]);
          closestCollections.push(collection);
        }
      });
      const index = closestRect(position.x, position.y, closestNodes);
      const collection = closestCollections[index];
      if (collection === undefined) {
        return {
          collection,
          index: 0,
        };
      }
      const finalNodes = this.manager.refs[collection].map((ref) => ref.node);
      const finalIndex = finalNodes.indexOf(closestNodes[index]);
      const node = closestNodes[index];
      const rect = node.getBoundingClientRect();
      return {
        collection,
        index: finalIndex + (position.y > rect.bottom ? 1 : 0),
      };
    };

    checkActive = (event) => {
      const active = this.manager.active;
      if (!active) {
        // find closest collection
        const node = closest(event.target, (el) => el.sortableInfo != null);
        if (node && node.sortableInfo) {
          const pos = getPosition(event);
          const {collection} = node.sortableInfo;
          const nodes = this.manager.refs[collection].map((ref) => ref.node);
          // find closest index in collection
          if (nodes) {
            const index = closestRect(pos.x, pos.y, nodes);
            this.manager.active = {
              index,
              collection,
              item: this.props.items[index],
            };
            this.handlePress(event);
          }
        }
        return false;
      }
      return true;
    };

    animateNodes() {
      if (!this.axis) {
        return;
      }
      const {
        transitionDuration,
        hideSortableGhost,
        onSortOver,
        animateNodes,
      } = this.props;
      const nodes = this.manager.getOrderedRefs();
      const containerScrollDelta = {
        left: this.container.scrollLeft - this.initialScroll.left,
        top: this.container.scrollTop - this.initialScroll.top,
      };
      const sortingOffset = {
        left:
          this.dragLayer.offsetEdge.left -
          this.dragLayer.distanceBetweenContainers.x +
          this.dragLayer.translate.x +
          containerScrollDelta.left,
        top:
          this.dragLayer.offsetEdge.top -
          this.dragLayer.distanceBetweenContainers.y +
          this.dragLayer.translate.y +
          containerScrollDelta.top,
      };
      const windowScrollDelta = {
        top: window.pageYOffset - this.initialWindowScroll.top,
        left: window.pageXOffset - this.initialWindowScroll.left,
      };
      const prevIndex = this.newIndex;
      this.newIndex = null;

      for (let i = 0, len = nodes.length; i < len; i++) {
        const {node} = nodes[i];
        const index = node.sortableInfo.index;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const offset = {
          width:
            this.dragLayer.width > width ? width / 2 : this.dragLayer.width / 2,
          height:
            this.dragLayer.height > height
              ? height / 2
              : this.dragLayer.height / 2,
        };

        const translate = {
          x: 0,
          y: 0,
        };
        let {edgeOffset} = nodes[i];

        // If we haven't cached the node's offsetTop / offsetLeft value
        if (!edgeOffset) {
          edgeOffset = getEdgeOffset(node, this.container);
          nodes[i].edgeOffset = edgeOffset;
        }

        // Get a reference to the next and previous node
        const nextNode = i < nodes.length - 1 && nodes[i + 1];
        const prevNode = i > 0 && nodes[i - 1];

        // Also cache the next node's edge offset if needed.
        // We need this for calculating the animation in a grid setup
        if (nextNode && !nextNode.edgeOffset) {
          nextNode.edgeOffset = getEdgeOffset(nextNode.node, this.container);
        }

        // If the node is the one we're currently animating, skip it
        if (index === this.index) {
          if (hideSortableGhost) {
            /*
             * With windowing libraries such as `react-virtualized`, the sortableGhost
             * node may change while scrolling down and then back up (or vice-versa),
             * so we need to update the reference to the new node just to be safe.
             */
            this.sortableGhost = node;
            node.style.visibility = 'hidden';
            node.style.opacity = 0;
          }
          continue;
        }

        if (transitionDuration) {
          node.style[
            `${vendorPrefix}TransitionDuration`
          ] = `${transitionDuration}ms`;
        }

        if (this.axis.x) {
          if (this.axis.y) {
            // Calculations for a grid setup
            if (
              index < this.index &&
              ((sortingOffset.left + windowScrollDelta.left - offset.width <=
                edgeOffset.left &&
                sortingOffset.top + windowScrollDelta.top <=
                  edgeOffset.top + offset.height) ||
                sortingOffset.top + windowScrollDelta.top + offset.height <=
                  edgeOffset.top)
            ) {
              // If the current node is to the left on the same row, or above the node that's being dragged
              // then move it to the right
              translate.x =
                this.dragLayer.width + this.dragLayer.marginOffset.x;
              if (
                edgeOffset.left + translate.x >
                this.dragLayer.containerBoundingRect.width - offset.width
              ) {
                // If it moves passed the right bounds, then animate it to the first position of the next row.
                // We just use the offset of the next node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                translate.y = nextNode.edgeOffset.top - edgeOffset.top;
              }
              if (this.newIndex === null) {
                this.newIndex = index;
              }
            } else if (
              index > this.index &&
              ((sortingOffset.left + windowScrollDelta.left + offset.width >=
                edgeOffset.left &&
                sortingOffset.top + windowScrollDelta.top + offset.height >=
                  edgeOffset.top) ||
                sortingOffset.top + windowScrollDelta.top + offset.height >=
                  edgeOffset.top + height)
            ) {
              // If the current node is to the right on the same row, or below the node that's being dragged
              // then move it to the left
              translate.x = -(
                this.dragLayer.width + this.dragLayer.marginOffset.x
              );
              if (
                edgeOffset.left + translate.x <
                this.dragLayer.containerBoundingRect.left + offset.width
              ) {
                // If it moves passed the left bounds, then animate it to the last position of the previous row.
                // We just use the offset of the previous node to calculate where to move, because that node's original position
                // is exactly where we want to go
                translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                translate.y = prevNode.edgeOffset.top - edgeOffset.top;
              }
              this.newIndex = index;
            }
          } else {
            if (
              index > this.index &&
              sortingOffset.left + windowScrollDelta.left + offset.width >=
                edgeOffset.left
            ) {
              translate.x = -(
                this.dragLayer.width + this.dragLayer.marginOffset.x
              );
              this.newIndex = index;
            } else if (
              index < this.index &&
              sortingOffset.left + windowScrollDelta.left <=
                edgeOffset.left + offset.width
            ) {
              translate.x =
                this.dragLayer.width + this.dragLayer.marginOffset.x;

              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          }
        } else if (this.axis.y) {
          if (
            index > this.index &&
            sortingOffset.top + windowScrollDelta.top + offset.height >=
              edgeOffset.top
          ) {
            translate.y = -(
              this.dragLayer.height + this.dragLayer.marginOffset.y
            );
            this.newIndex = index;
          } else if (
            index < this.index &&
            sortingOffset.top + windowScrollDelta.top <=
              edgeOffset.top + offset.height
          ) {
            translate.y = this.dragLayer.height + this.dragLayer.marginOffset.y;
            if (this.newIndex == null) {
              this.newIndex = index;
            }
          }
        }

        // Translate the position of the given node
        if (animateNodes) {
          node.style[`${vendorPrefix}Transform`] = `translate3d(${
            translate.x
          }px,${translate.y}px,0)`;
        }
      }

      if (this.newIndex == null) {
        this.newIndex = this.index;
      }

      if (onSortOver && this.newIndex !== prevIndex) {
        onSortOver({
          newIndex: this.newIndex,
          oldIndex: prevIndex,
          index: this.index,
          collection: this.manager.active.collection,
        });
      }
    }

    autoscroll = () => {
      const translate = this.dragLayer.translate;
      const direction = {
        x: 0,
        y: 0,
      };
      const speed = {
        x: 1,
        y: 1,
      };
      const acceleration = {
        x: 10,
        y: 10,
      };

      if (
        translate.y >=
        this.dragLayer.maxTranslate.y - this.dragLayer.height / 2
      ) {
        // Scroll Down
        direction.y = 1;
        speed.y =
          acceleration.y *
          Math.abs(
            (this.dragLayer.maxTranslate.y -
              this.dragLayer.height / 2 -
              translate.y) /
              this.dragLayer.height,
          );
      } else if (
        translate.x >=
        this.dragLayer.maxTranslate.x - this.dragLayer.width / 2
      ) {
        // Scroll Right
        direction.x = 1;
        speed.x =
          acceleration.x *
          Math.abs(
            (this.dragLayer.maxTranslate.x -
              this.dragLayer.width / 2 -
              translate.x) /
              this.dragLayer.width,
          );
      } else if (
        translate.y <=
        this.dragLayer.minTranslate.y + this.dragLayer.height / 2
      ) {
        // Scroll Up
        direction.y = -1;
        speed.y =
          acceleration.y *
          Math.abs(
            (translate.y -
              this.dragLayer.height / 2 -
              this.dragLayer.minTranslate.y) /
              this.dragLayer.height,
          );
      } else if (
        translate.x <=
        this.dragLayer.minTranslate.x + this.dragLayer.width / 2
      ) {
        // Scroll Left
        direction.x = -1;
        speed.x =
          acceleration.x *
          Math.abs(
            (translate.x -
              this.dragLayer.width / 2 -
              this.dragLayer.minTranslate.x) /
              this.dragLayer.width,
          );
      }

      if (this.autoscrollInterval) {
        clearInterval(this.autoscrollInterval);
        this.autoscrollInterval = null;
        this.isAutoScrolling = false;
      }

      if (direction.x !== 0 || direction.y !== 0) {
        this.autoscrollInterval = setInterval(() => {
          this.isAutoScrolling = true;
          const offset = {
            left: speed.x * direction.x,
            top: speed.y * direction.y,
          };
          this.scrollContainer.scrollTop += offset.top;
          this.scrollContainer.scrollLeft += offset.left;
          this.animateNodes();
        }, 5);
      }
    };

    getWrappedInstance() {
      invariant(
        config.withRef,
        'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call',
      );

      return this.refs.wrappedInstance;
    }

    getContainer() {
      const {getContainer} = this.props;

      if (typeof getContainer !== 'function') {
        return findDOMNode(this);
      }

      return getContainer(
        config.withRef ? this.getWrappedInstance() : undefined,
      );
    }

    render() {
      const ref = config.withRef ? 'wrappedInstance' : null;

      return (
        <WrappedComponent
          ref={ref}
          {...omit(
            this.props,
            'contentWindow',
            'useWindowAsScrollContainer',
            'distance',
            'helperClass',
            'hideSortableGhost',
            'transitionDuration',
            'useDragHandle',
            'animateNodes',
            'pressDelay',
            'pressThreshold',
            'shouldCancelStart',
            'updateBeforeSortStart',
            'onSortStart',
            'onSortSwap',
            'onSortMove',
            'onSortEnd',
            'axis',
            'lockAxis',
            'lockOffset',
            'lockToContainerEdges',
            'getContainer',
            'getHelperDimensions',
          )}
        />
      );
    }

    get helperContainer() {
      return this.props.helperContainer || this.document.body;
    }
  };
}
