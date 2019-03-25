import * as React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';
import findIndex from 'lodash/findIndex';
import isPlainObject from 'lodash/isPlainObject';
import DragLayer from '../DragLayer';
import {closestRect} from '../DragLayer/utils';
import Manager from '../Manager';
import {isSortableHandle} from '../SortableHandle';
import AutoScroller from '../AutoScroller';
import {
  closest,
  events,
  getScrollingParent,
  getEdgeOffset,
  getPosition,
  isTouchEvent,
  NodeType,
  omit,
  provideDisplayName,
  setInlineStyles,
  setTransitionDuration,
  setTranslate3d,
} from '../utils';
import {defaultProps, omittedProps, propTypes, validateProps} from './props';

export default function sortableContainer(
  WrappedComponent,
  config = {withRef: false},
) {
  return class WithSortableContainer extends React.Component {
    constructor(props) {
      super(props);

      validateProps(props);

      this.state = {};
      this.dragLayer = props.dragLayer || new DragLayer();
      this.dragLayer.addRef(this);
      this.dragLayer.onDragEnd = props.onDragEnd;
      this.manager = new Manager();
      this.events = {
        end: this.handleEnd,
        move: this.handleMove,
        start: this.handleStart,
      };
    }

    static displayName = provideDisplayName('sortableList', WrappedComponent);
    static defaultProps = defaultProps;
    static propTypes = propTypes;
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
      const container = this.getContainer();

      Promise.resolve(container).then((containerNode) => {
        this.container = containerNode;
        this.document = this.container.ownerDocument || document;

        /*
         *  Set our own default rather than using defaultProps because Jest
         *  snapshots will serialize window, causing a RangeError
         *  https://github.com/clauderic/react-sortable-hoc/issues/249
         */
        const contentWindow =
          this.props.contentWindow || this.document.defaultView || window;

        this.contentWindow =
          typeof contentWindow === 'function' ? contentWindow() : contentWindow;

        this.scrollContainer = useWindowAsScrollContainer
          ? this.document.scrollingElement || this.document.documentElement
          : getScrollingParent(this.container) || this.container;

        this.initialScroll = {
          top: this.scrollContainer.scrollTop,
          left: this.scrollContainer.scrollLeft,
        };

        this.autoScroller = new AutoScroller(
          this.scrollContainer,
          this.onAutoScroll,
        );

        Object.keys(this.events).forEach((key) =>
          events[key].forEach((eventName) =>
            this.container.addEventListener(eventName, this.events[key], false),
          ),
        );
      });
    }

    componentWillUnmount() {
      this.dragLayer.removeRef(this);

      if (this.container) {
        Object.keys(this.events).forEach((key) =>
          events[key].forEach((eventName) =>
            this.container.removeEventListener(eventName, this.events[key]),
          ),
        );
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

      this.touched = true;
      this.position = getPosition(event);

      const node = closest(event.target, (el) => el.sortableInfo != null);

      if (
        node &&
        node.sortableInfo &&
        this.nodeIsChild(node) &&
        !this.state.sorting
      ) {
        const {useDragHandle} = this.props;
        const {index, collection, disabled} = node.sortableInfo;

        if (disabled) {
          return;
        }

        if (useDragHandle && !closest(event.target, isSortableHandle)) {
          return;
        }

        this.manager.active = {collection, index, item: items[index]};

        /*
         * Fixes a bug in Firefox where the :active state of anchor tags
         * prevent subsequent 'mousemove' events from being fired
         * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
         */
        if (!isTouchEvent(event) && event.target.tagName === NodeType.Anchor) {
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
        !this.state.sorting &&
        this.touched &&
        !this._awaitingUpdateBeforeSortStart
      ) {
        const position = getPosition(event);
        const delta = {
          x: this.position.x - position.x,
          y: this.position.y - position.y,
        };
        const combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);

        this.delta = delta;

        if (!distance && (!pressThreshold || combinedDelta >= pressThreshold)) {
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
      this.touched = false;
      this.cancel();
    };

    cancel = () => {
      const {distance} = this.props;
      const {sorting} = this.state;

      if (!sorting) {
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
        active = this.dragLayer.startDrag(this.helperContainer, this, event);
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

        if (typeof updateBeforeSortStart === 'function') {
          this._awaitingUpdateBeforeSortStart = true;

          try {
            const {index} = node.sortableInfo;
            await updateBeforeSortStart({collection, index, node}, event);
          } finally {
            this._awaitingUpdateBeforeSortStart = false;
          }
        }

        const {index} = node.sortableInfo;
        this.index = index;
        this.newIndex = index;

        this.axis = {
          x: axis.indexOf('x') >= 0,
          y: axis.indexOf('y') >= 0,
        };

        this.initialScroll = {
          left: this.scrollContainer.scrollLeft,
          top: this.scrollContainer.scrollTop,
        };

        this.initialWindowScroll = {
          left: window.pageXOffset,
          top: window.pageYOffset,
        };

        if (hideSortableGhost) {
          this.sortableGhost = node;

          setInlineStyles(node, {
            opacity: 0,
            visibility: 'hidden',
          });
        }

        if (helperClass) {
          this.dragLayer.helper.classList.add(...helperClass.split(' '));
        }

        this.setState({
          sorting: true,
          sortingIndex: index,
        });

        if (onSortStart) {
          onSortStart({collection, index, node}, event);
        }
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
      const {collection} = this.manager.active;
      const nodes = this.manager.refs[collection];

      if (!this.manager.active) {
        return;
      }

      // Remove the move handler if there's a frame that hasn't run yet.
      if (window.cancelAnimationFrame && this.sortMoveAF) {
        window.cancelAnimationFrame(this.sortMoveAF);
        this.sortMoveAF = null;
      }

      if (hideSortableGhost && this.sortableGhost) {
        setInlineStyles(this.sortableGhost, {
          opacity: '',
          visibility: '',
        });
      }

      for (let i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const el = node.node;

        // Clear the cached offsetTop / offsetLeft value
        node.edgeOffset = null;

        // Remove the transforms / transitions
        setTranslate3d(el, null);
        setTransitionDuration(el, null);
      }

      // Stop autoscroll
      this.autoScroller.clear();

      // Update manager state
      this.manager.active = null;

      this.setState({
        sorting: false,
        sortingIndex: null,
      });

      if (typeof onSortEnd === 'function') {
        // get the index in the new list
        if (newList) {
          this.newIndex = newList.getClosestNode(event).index;
        }

        onSortEnd(
          {
            collection,
            newIndex: this.newIndex,
            oldIndex: this.index,
            newList,
          },
          event,
        );
      }

      this.touched = false;
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
        left: this.scrollContainer.scrollLeft - this.initialScroll.left,
        top: this.scrollContainer.scrollTop - this.initialScroll.top,
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
        left: window.pageXOffset - this.initialWindowScroll.left,
        top: window.pageYOffset - this.initialWindowScroll.top,
      };
      const prevIndex = this.newIndex;
      this.newIndex = null;

      for (let i = 0, len = nodes.length; i < len; i++) {
        const {node} = nodes[i];
        const {index} = node.sortableInfo;
        const width = node.offsetWidth;
        const height = node.offsetHeight;
        const offset = {
          height:
            this.dragLayer.height > height
              ? height / 2
              : this.dragLayer.height / 2,
          width:
            this.dragLayer.width > width ? width / 2 : this.dragLayer.width / 2,
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

            setInlineStyles(node, {
              opacity: 0,
              visibility: 'hidden',
            });
          }
          continue;
        }

        if (transitionDuration) {
          setTransitionDuration(node, transitionDuration);
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
                if (nextNode) {
                  translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                  translate.y = nextNode.edgeOffset.top - edgeOffset.top;
                }
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
                if (prevNode) {
                  translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                  translate.y = prevNode.edgeOffset.top - edgeOffset.top;
                }
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
          setTranslate3d(node, translate);
        }
      }

      if (this.newIndex == null) {
        this.newIndex = this.index;
      }

      if (onSortOver && this.newIndex !== prevIndex) {
        onSortOver({
          collection: this.manager.active.collection,
          index: this.index,
          newIndex: this.newIndex,
          oldIndex: prevIndex,
        });
      }
    }

    autoscroll = () => {
      const {disableAutoscroll} = this.props;

      if (disableAutoscroll) {
        return;
      }

      this.autoScroller.update({
        height: this.dragLayer.height,
        maxTranslate: this.dragLayer.maxTranslate,
        minTranslate: this.dragLayer.minTranslate,
        translate: this.dragLayer.translate,
        width: this.dragLayer.width,
      });
    };

    onAutoScroll = (offset) => {
      this.dragLayer.translate.x += offset.left;
      this.dragLayer.translate.y += offset.top;

      this.animateNodes();
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

    // -- DD methods --

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

    handleSortSwap = (index, item) => {
      const {onSortSwap} = this.props;
      if (typeof onSortSwap === 'function') {
        onSortSwap({
          index,
          item,
        });
      }
    };

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

    // -- DD methods END --

    render() {
      const ref = config.withRef ? 'wrappedInstance' : null;

      return <WrappedComponent ref={ref} {...omit(this.props, omittedProps)} />;
    }

    get helperContainer() {
      const {helperContainer} = this.props;

      if (typeof helperContainer === 'function') {
        return helperContainer();
      }

      return this.props.helperContainer || this.document.body;
    }
  };
}
