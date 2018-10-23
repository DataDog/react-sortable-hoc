'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = sortableContainer;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDom = require('react-dom');

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _findIndex = require('lodash/findIndex');

var _findIndex2 = _interopRequireDefault(_findIndex);

var _isPlainObject = require('lodash/isPlainObject');

var _isPlainObject2 = _interopRequireDefault(_isPlainObject);

var _DragLayer = require('../DragLayer');

var _DragLayer2 = _interopRequireDefault(_DragLayer);

var _Manager = require('../Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _utils = require('../utils');

var _utils2 = require('../DragLayer/utils');

require('classlist-polyfill');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Export Higher Order Sortable Container Component
function sortableContainer(WrappedComponent) {
  var _class, _temp;

  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { withRef: false };

  return _temp = _class = function (_Component) {
    _inherits(_class, _Component);

    function _class(props) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, (_class.__proto__ || Object.getPrototypeOf(_class)).call(this, props));

      _this.checkActiveIndex = function (nextProps) {
        var _ref = nextProps || _this.props,
            items = _ref.items;

        var item = _this.manager.active.item;

        // If sortable item is an object, find item that match id
        // Otherwise let findIndex predicate on item

        var newIndex = (0, _isPlainObject2.default)(item) ? (0, _findIndex2.default)(items, function (obj) {
          return obj.id === item.id;
        }) : (0, _findIndex2.default)(items, item);

        if (newIndex === -1) {
          _this.dragLayer.stopDrag();
          return;
        }
        _this.manager.active.index = newIndex;
        _this.index = newIndex;
      };

      _this.handleStart = function (event) {
        var _this$props = _this.props,
            distance = _this$props.distance,
            shouldCancelStart = _this$props.shouldCancelStart,
            items = _this$props.items;


        if (event.button === 2 || shouldCancelStart(event)) {
          return false;
        }

        _this._touched = true;
        _this._pos = (0, _utils.getPosition)(event);

        var node = (0, _utils.closest)(event.target, function (el) {
          return el.sortableInfo != null;
        });

        if (node && node.sortableInfo && _this.nodeIsChild(node) && !_this.sorting) {
          var useDragHandle = _this.props.useDragHandle;
          var _node$sortableInfo = node.sortableInfo,
              index = _node$sortableInfo.index,
              collection = _node$sortableInfo.collection;


          if (useDragHandle && !(0, _utils.closest)(event.target, function (el) {
            return el.sortableHandle != null;
          })) return;

          _this.manager.active = { index: index, collection: collection, item: items[index] };

          /*
           * Fixes a bug in Firefox where the :active state of anchor tags
           * prevent subsequent 'mousemove' events from being fired
           * (see https://github.com/clauderic/react-sortable-hoc/issues/118)
           */
          if (!(0, _utils.isTouchEvent)(event) && event.target.tagName.toLowerCase() === 'a') {
            event.preventDefault();
          }

          if (!distance) {
            if (_this.props.pressDelay === 0) {
              _this.handlePress(event);
            } else {
              _this.pressTimer = setTimeout(function () {
                return _this.handlePress(event);
              }, _this.props.pressDelay);
            }
          }
        }
      };

      _this.nodeIsChild = function (node) {
        return node.sortableInfo.manager === _this.manager;
      };

      _this.handleMove = function (event) {
        var _this$props2 = _this.props,
            distance = _this$props2.distance,
            pressThreshold = _this$props2.pressThreshold;

        if (!_this.sorting && _this._touched) {
          var position = (0, _utils.getPosition)(event);
          var delta = _this._delta = {
            x: _this._pos.x - position.x,
            y: _this._pos.y - position.y
          };
          var combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);

          if (!distance && (!pressThreshold || pressThreshold && combinedDelta >= pressThreshold)) {
            clearTimeout(_this.cancelTimer);
            _this.cancelTimer = setTimeout(_this.cancel, 0);
          } else if (distance && combinedDelta >= distance && _this.manager.isActive()) {
            _this.handlePress(event);
          }
        }
      };

      _this.handleEnd = function () {
        var distance = _this.props.distance;


        _this._touched = false;

        if (!distance) {
          _this.cancel();
        }
      };

      _this.cancel = function () {
        if (!_this.sorting) {
          clearTimeout(_this.pressTimer);
          _this.manager.active = null;
        }
      };

      _this.handlePress = function (event) {
        var activeNode = null;
        if (_this.dragLayer.helper) {
          if (_this.manager.active) {
            _this.checkActiveIndex();
            activeNode = _this.manager.getActive();
          }
        } else {
          activeNode = _this.dragLayer.startDrag(_this.document.body, _this, event);
        }

        if (activeNode) {
          var _this$props3 = _this.props,
              axis = _this$props3.axis,
              helperClass = _this$props3.helperClass,
              hideSortableGhost = _this$props3.hideSortableGhost,
              onSortStart = _this$props3.onSortStart;
          var _activeNode = activeNode,
              node = _activeNode.node,
              collection = _activeNode.collection;
          var index = node.sortableInfo.index;


          _this.index = index;
          _this.newIndex = index;
          _this.axis = {
            x: axis.indexOf('x') >= 0,
            y: axis.indexOf('y') >= 0
          };

          _this.initialScroll = {
            top: _this.container.scrollTop,
            left: _this.container.scrollLeft
          };

          _this.initialWindowScroll = {
            top: window.pageYOffset,
            left: window.pageXOffset
          };

          if (hideSortableGhost) {
            _this.sortableGhost = node;
            node.style.visibility = 'hidden';
            node.style.opacity = 0;
          }

          if (helperClass) {
            var _this$dragLayer$helpe;

            (_this$dragLayer$helpe = _this.dragLayer.helper.classList).add.apply(_this$dragLayer$helpe, _toConsumableArray(helperClass.split(' ')));
          }

          _this.sorting = true;
          _this.sortingIndex = index;

          if (onSortStart) {
            onSortStart({ node: node, index: index, collection: collection }, event);
          }
        }
      };

      _this._handleSortMove = function (event) {
        // animate nodes if required
        if (_this.checkActive(event)) {
          _this.animateNodes();
          _this.autoscroll();
        }

        if (window.requestAnimationFrame) _this.sortMoveAF = null;else setTimeout(function () {
          _this.sortMoveAF = null;
        }, 1000 / 60); // aim for 60 fps
      };

      _this.handleSortMove = function (event) {
        var onSortMove = _this.props.onSortMove;

        event.preventDefault(); // Prevent scrolling on mobile

        if (_this.sortMoveAF) {
          return;
        }

        if (window.requestAnimationFrame) {
          _this.sortMoveAF = window.requestAnimationFrame(_this._handleSortMove);
        } else {
          _this.sortMoveAF = true;
          _this._handleSortMove(); // call inner function now if no animation frame
        }

        if (onSortMove) {
          onSortMove(event);
        }
      };

      _this.handleSortEnd = function (event) {
        var newList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var _this$props4 = _this.props,
            hideSortableGhost = _this$props4.hideSortableGhost,
            onSortEnd = _this$props4.onSortEnd;

        if (!_this.manager.active) {
          console.warn('there is no active node', event);
          return;
        }
        var collection = _this.manager.active.collection;

        // Remove the move handler if there's a frame that hasn't run yet.

        if (window.cancelAnimationFrame && _this.sortMoveAF) {
          window.cancelAnimationFrame(_this.sortMoveAF);
          _this.sortMoveAF = null;
        }

        if (hideSortableGhost && _this.sortableGhost) {
          _this.sortableGhost.style.visibility = '';
          _this.sortableGhost.style.opacity = '';
        }

        var nodes = _this.manager.refs[collection];
        for (var i = 0, len = nodes.length; i < len; i++) {
          var node = nodes[i];
          var el = node.node;

          // Clear the cached offsetTop / offsetLeft value
          node.edgeOffset = null;

          // Remove the transforms / transitions
          el.style[_utils.vendorPrefix + 'Transform'] = '';
          el.style[_utils.vendorPrefix + 'TransitionDuration'] = '';
        }

        // Stop autoscroll
        clearInterval(_this.autoscrollInterval);
        _this.autoscrollInterval = null;

        // Update state
        _this.manager.active = null;

        _this.sorting = false;
        _this.sortingIndex = null;

        if (typeof onSortEnd === 'function') {
          // get the index in the new list
          if (newList) {
            _this.newIndex = newList.getClosestNode(event).index;
          }

          onSortEnd({
            oldIndex: _this.index,
            newIndex: _this.newIndex,
            newList: newList,
            collection: collection
          }, event);
        }

        _this._touched = false;
      };

      _this.handleSortSwap = function (index, item) {
        var onSortSwap = _this.props.onSortSwap;

        if (typeof onSortSwap === 'function') {
          onSortSwap({
            index: index,
            item: item
          });
        }
      };

      _this.getClosestNode = function (event) {
        var position = (0, _utils.getPosition)(event);
        // eslint-disable-next-line
        var closestNodes = [];
        // eslint-disable-next-line
        var closestCollections = [];

        //TODO: keys is converting number to string!!! check origin value type as number???
        Object.keys(_this.manager.refs).forEach(function (collection) {
          var nodes = _this.manager.refs[collection].map(function (n) {
            return n.node;
          });
          if (nodes && nodes.length > 0) {
            closestNodes.push(nodes[(0, _utils2.closestRect)(position.x, position.y, nodes)]);
            closestCollections.push(collection);
          }
        });
        var index = (0, _utils2.closestRect)(position.x, position.y, closestNodes);
        var collection = closestCollections[index];
        if (collection === undefined) {
          return {
            collection: collection,
            index: 0
          };
        }
        var finalNodes = _this.manager.refs[collection].map(function (n) {
          return n.node;
        });
        var finalIndex = finalNodes.indexOf(closestNodes[index]);
        var node = closestNodes[index];
        //TODO: add better support for grid
        var rect = node.getBoundingClientRect();
        return {
          collection: collection,
          index: finalIndex + (position.y > rect.bottom ? 1 : 0)
        };
      };

      _this.checkActive = function (event) {
        var active = _this.manager.active;
        if (!active) {
          // find closest collection
          var node = (0, _utils.closest)(event.target, function (el) {
            return el.sortableInfo != null;
          });
          if (node && node.sortableInfo) {
            var p = (0, _utils.getPosition)(event);
            var collection = node.sortableInfo.collection;

            var nodes = _this.manager.refs[collection].map(function (n) {
              return n.node;
            });
            // find closest index in collection
            if (nodes) {
              var index = (0, _utils2.closestRect)(p.x, p.y, nodes);
              _this.manager.active = {
                index: index,
                collection: collection,
                item: _this.props.items[index]
              };
              _this.handlePress(event);
            }
          }
          return false;
        }
        return true;
      };

      _this.autoscroll = function () {
        var translate = _this.dragLayer.translate;
        var direction = {
          x: 0,
          y: 0
        };
        var speed = {
          x: 1,
          y: 1
        };
        var acceleration = {
          x: 10,
          y: 10
        };

        if (translate.y >= _this.dragLayer.maxTranslate.y - _this.dragLayer.height / 2) {
          direction.y = 1; // Scroll Down
          speed.y = acceleration.y * Math.abs((_this.dragLayer.maxTranslate.y - _this.dragLayer.height / 2 - translate.y) / _this.dragLayer.height);
        } else if (translate.x >= _this.dragLayer.maxTranslate.x - _this.dragLayer.width / 2) {
          direction.x = 1; // Scroll Right
          speed.x = acceleration.x * Math.abs((_this.dragLayer.maxTranslate.x - _this.dragLayer.width / 2 - translate.x) / _this.dragLayer.width);
        } else if (translate.y <= _this.dragLayer.minTranslate.y + _this.dragLayer.height / 2) {
          direction.y = -1; // Scroll Up
          speed.y = acceleration.y * Math.abs((translate.y - _this.dragLayer.height / 2 - _this.dragLayer.minTranslate.y) / _this.dragLayer.height);
        } else if (translate.x <= _this.dragLayer.minTranslate.x + _this.dragLayer.width / 2) {
          direction.x = -1; // Scroll Left
          speed.x = acceleration.x * Math.abs((translate.x - _this.dragLayer.width / 2 - _this.dragLayer.minTranslate.x) / _this.dragLayer.width);
        }

        if (_this.autoscrollInterval) {
          clearInterval(_this.autoscrollInterval);
          _this.autoscrollInterval = null;
          _this.isAutoScrolling = false;
        }

        if (direction.x !== 0 || direction.y !== 0) {
          _this.autoscrollInterval = setInterval(function () {
            _this.isAutoScrolling = true;
            var offset = {
              left: 1 * speed.x * direction.x,
              top: 1 * speed.y * direction.y
            };
            _this.scrollContainer.scrollTop += offset.top;
            _this.scrollContainer.scrollLeft += offset.left;
            _this.animateNodes();
          }, 5);
        }
      };

      _this.dragLayer = props.dragLayer || new _DragLayer2.default();
      _this.dragLayer.addRef(_this);
      _this.dragLayer.onDragEnd = props.onDragEnd;
      _this.manager = new _Manager2.default();
      _this.events = {
        start: _this.handleStart,
        move: _this.handleMove,
        end: _this.handleEnd
      };

      (0, _invariant2.default)(!(props.distance && props.pressDelay), 'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.');

      _this.state = {};
      _this.sorting = false;
      return _this;
    }

    _createClass(_class, [{
      key: 'getChildContext',
      value: function getChildContext() {
        return {
          manager: this.manager
        };
      }
    }, {
      key: 'componentDidMount',
      value: function componentDidMount() {
        var _this2 = this;

        var useWindowAsScrollContainer = this.props.useWindowAsScrollContainer;

        /*
         *  Set our own default rather than using defaultProps because Jest
         *  snapshots will serialize window, causing a RangeError
         *  https://github.com/clauderic/react-sortable-hoc/issues/249
         */

        var container = this.getContainer();

        Promise.resolve(container).then(function (containerNode) {
          _this2.container = containerNode;
          _this2.document = _this2.container.ownerDocument || document;

          var contentWindow = _this2.props.contentWindow || _this2.document.defaultView || window;

          _this2.contentWindow = typeof contentWindow === 'function' ? contentWindow() : contentWindow;
          _this2.scrollContainer = useWindowAsScrollContainer ? _this2.document.scrollingElement || _this2.document.documentElement : _this2.container;
          _this2.initialScroll = {
            top: _this2.scrollContainer.scrollTop,
            left: _this2.scrollContainer.scrollLeft
          };

          var _loop = function _loop(key) {
            if (_this2.events.hasOwnProperty(key)) {
              _utils.events[key].forEach(function (eventName) {
                return _this2.container.addEventListener(eventName, _this2.events[key], false);
              });
            }
          };

          for (var key in _this2.events) {
            _loop(key);
          }
        });
      }
    }, {
      key: 'componentWillUnmount',
      value: function componentWillUnmount() {
        var _this3 = this;

        this.dragLayer.removeRef(this);
        if (this.container) {
          var _loop2 = function _loop2(key) {
            if (_this3.events.hasOwnProperty(key)) {
              _utils.events[key].forEach(function (eventName) {
                return _this3.container.removeEventListener(eventName, _this3.events[key]);
              });
            }
          };

          for (var key in this.events) {
            _loop2(key);
          }
        }
      }
    }, {
      key: 'componentWillReceiveProps',
      value: function componentWillReceiveProps(nextProps) {
        var active = this.manager.active;

        if (!active) return;
        this.checkActiveIndex(nextProps);
      }
    }, {
      key: 'getLockPixelOffsets',
      value: function getLockPixelOffsets() {
        var _dragLayer = this.dragLayer,
            width = _dragLayer.width,
            height = _dragLayer.height;
        var lockOffset = this.props.lockOffset;

        var offsets = Array.isArray(lockOffset) ? lockOffset : [lockOffset, lockOffset];

        (0, _invariant2.default)(offsets.length === 2, 'lockOffset prop of SortableContainer should be a single ' + 'value or an array of exactly two values. Given %s', lockOffset);

        var _offsets = _slicedToArray(offsets, 2),
            minLockOffset = _offsets[0],
            maxLockOffset = _offsets[1];

        return [(0, _utils.getLockPixelOffset)({ lockOffset: minLockOffset, width: width, height: height }), (0, _utils.getLockPixelOffset)({ lockOffset: maxLockOffset, width: width, height: height })];
      }
    }, {
      key: 'updatePosition',
      value: function updatePosition(event) {
        var _currentList$props = this.currentList.props,
            lockAxis = _currentList$props.lockAxis,
            lockToContainerEdges = _currentList$props.lockToContainerEdges;


        var offset = (0, _utils.getPosition)(event);
        var translate = {
          x: offset.x - this.initialOffset.x,
          y: offset.y - this.initialOffset.y
        };

        // Adjust for window scroll
        translate.y -= window.pageYOffset - this.currentList.initialWindowScroll.top;
        translate.x -= window.pageXOffset - this.currentList.initialWindowScroll.left;

        this.translate = translate;
        this.delta = offset;

        if (lockToContainerEdges) {
          var _getLockPixelOffsets = this.getLockPixelOffsets(),
              _getLockPixelOffsets2 = _slicedToArray(_getLockPixelOffsets, 2),
              minLockOffset = _getLockPixelOffsets2[0],
              maxLockOffset = _getLockPixelOffsets2[1];

          var minOffset = {
            x: this.width / 2 - minLockOffset.x,
            y: this.height / 2 - minLockOffset.y
          };
          var maxOffset = {
            x: this.width / 2 - maxLockOffset.x,
            y: this.height / 2 - maxLockOffset.y
          };

          translate.x = (0, _utils.limit)(this.minTranslate.x + minOffset.x, this.maxTranslate.x - maxOffset.x, translate.x);
          translate.y = (0, _utils.limit)(this.minTranslate.y + minOffset.y, this.maxTranslate.y - maxOffset.y, translate.y);
        }

        if (lockAxis === 'x') {
          translate.y = 0;
        } else if (lockAxis === 'y') {
          translate.x = 0;
        }

        this.helper.style[_utils.vendorPrefix + 'Transform'] = 'translate3d(' + translate.x + 'px,' + translate.y + 'px, 0)';
      }
    }, {
      key: 'animateNodes',
      value: function animateNodes() {
        if (!this.axis) return;
        var _props = this.props,
            transitionDuration = _props.transitionDuration,
            hideSortableGhost = _props.hideSortableGhost,
            onSortOver = _props.onSortOver;

        var nodes = this.manager.getOrderedRefs();
        var containerScrollDelta = {
          left: this.container.scrollLeft - this.initialScroll.left,
          top: this.container.scrollTop - this.initialScroll.top
        };
        var sortingOffset = {
          left: this.dragLayer.offsetEdge.left - this.dragLayer.distanceBetweenContainers.x + this.dragLayer.translate.x + containerScrollDelta.left,
          top: this.dragLayer.offsetEdge.top - this.dragLayer.distanceBetweenContainers.y + this.dragLayer.translate.y + containerScrollDelta.top
        };
        var windowScrollDelta = {
          top: window.pageYOffset - this.initialWindowScroll.top,
          left: window.pageXOffset - this.initialWindowScroll.left
        };
        var prevIndex = this.newIndex;
        this.newIndex = null;

        for (var i = 0, len = nodes.length; i < len; i++) {
          var node = nodes[i].node;

          var index = node.sortableInfo.index;
          var width = node.offsetWidth;
          var height = node.offsetHeight;
          var offset = {
            width: this.dragLayer.width > width ? width / 2 : this.dragLayer.width / 2,
            height: this.dragLayer.height > height ? height / 2 : this.dragLayer.height / 2
          };

          var translate = {
            x: 0,
            y: 0
          };
          var edgeOffset = nodes[i].edgeOffset;

          // If we haven't cached the node's offsetTop / offsetLeft value

          if (!edgeOffset) {
            nodes[i].edgeOffset = edgeOffset = (0, _utils.getEdgeOffset)(node, this.container);
          }

          // Get a reference to the next and previous node
          var nextNode = i < nodes.length - 1 && nodes[i + 1];
          var prevNode = i > 0 && nodes[i - 1];

          // Also cache the next node's edge offset if needed.
          // We need this for calculating the animation in a grid setup
          if (nextNode && !nextNode.edgeOffset) {
            nextNode.edgeOffset = (0, _utils.getEdgeOffset)(nextNode.node, this.container);
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
            node.style[_utils.vendorPrefix + 'TransitionDuration'] = transitionDuration + 'ms';
          }

          if (this.axis.x) {
            if (this.axis.y) {
              // Calculations for a grid setup
              if (index < this.index && (sortingOffset.left + windowScrollDelta.left - offset.width <= edgeOffset.left && sortingOffset.top + windowScrollDelta.top <= edgeOffset.top + offset.height || sortingOffset.top + windowScrollDelta.top + offset.height <= edgeOffset.top)) {
                // If the current node is to the left on the same row, or above the node that's being dragged
                // then move it to the right
                translate.x = this.dragLayer.width + this.dragLayer.marginOffset.x;
                if (edgeOffset.left + translate.x > this.dragLayer.containerBoundingRect.width - offset.width) {
                  // If it moves passed the right bounds, then animate it to the first position of the next row.
                  // We just use the offset of the next node to calculate where to move, because that node's original position
                  // is exactly where we want to go
                  translate.x = nextNode.edgeOffset.left - edgeOffset.left;
                  translate.y = nextNode.edgeOffset.top - edgeOffset.top;
                }
                if (this.newIndex === null) {
                  this.newIndex = index;
                }
              } else if (index > this.index && (sortingOffset.left + windowScrollDelta.left + offset.width >= edgeOffset.left && sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top || sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top + height)) {
                // If the current node is to the right on the same row, or below the node that's being dragged
                // then move it to the left
                translate.x = -(this.dragLayer.width + this.dragLayer.marginOffset.x);
                if (edgeOffset.left + translate.x < this.dragLayer.containerBoundingRect.left + offset.width) {
                  // If it moves passed the left bounds, then animate it to the last position of the previous row.
                  // We just use the offset of the previous node to calculate where to move, because that node's original position
                  // is exactly where we want to go
                  translate.x = prevNode.edgeOffset.left - edgeOffset.left;
                  translate.y = prevNode.edgeOffset.top - edgeOffset.top;
                }
                this.newIndex = index;
              }
            } else {
              if (index > this.index && sortingOffset.left + windowScrollDelta.left + offset.width >= edgeOffset.left) {
                translate.x = -(this.dragLayer.width + this.dragLayer.marginOffset.x);
                this.newIndex = index;
              } else if (index < this.index && sortingOffset.left + windowScrollDelta.left <= edgeOffset.left + offset.width) {
                translate.x = this.dragLayer.width + this.dragLayer.marginOffset.x;

                if (this.newIndex == null) {
                  this.newIndex = index;
                }
              }
            }
          } else if (this.axis.y) {
            if (index > this.index && sortingOffset.top + windowScrollDelta.top + offset.height >= edgeOffset.top) {
              translate.y = -(this.dragLayer.height + this.dragLayer.marginOffset.y);
              this.newIndex = index;
            } else if (index < this.index && sortingOffset.top + windowScrollDelta.top <= edgeOffset.top + offset.height) {
              translate.y = this.dragLayer.height + this.dragLayer.marginOffset.y;
              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          }
          node.style[_utils.vendorPrefix + 'Transform'] = 'translate3d(' + translate.x + 'px,' + translate.y + 'px,0)';
        }

        if (this.newIndex == null) {
          this.newIndex = this.index;
        }

        if (onSortOver && this.newIndex !== prevIndex) {
          onSortOver({
            newIndex: this.newIndex,
            oldIndex: prevIndex,
            index: this.index,
            collection: this.manager.active.collection
          });
        }
      }
    }, {
      key: 'getWrappedInstance',
      value: function getWrappedInstance() {
        (0, _invariant2.default)(config.withRef, 'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call');

        return this.refs.wrappedInstance;
      }
    }, {
      key: 'getContainer',
      value: function getContainer() {
        var getContainer = this.props.getContainer;


        if (typeof getContainer !== 'function') {
          return (0, _reactDom.findDOMNode)(this);
        }

        return getContainer(config.withRef ? this.getWrappedInstance() : undefined);
      }
    }, {
      key: 'render',
      value: function render() {
        var ref = config.withRef ? 'wrappedInstance' : null;

        return _react2.default.createElement(WrappedComponent, _extends({
          ref: ref
        }, (0, _utils.omit)(this.props, 'contentWindow', 'useWindowAsScrollContainer', 'distance', 'helperClass', 'hideSortableGhost', 'transitionDuration', 'useDragHandle', 'pressDelay', 'pressThreshold', 'shouldCancelStart', 'onSortStart', 'onSortSwap', 'onSortMove', 'onSortEnd', 'axis', 'lockAxis', 'lockOffset', 'lockToContainerEdges', 'getContainer', 'getHelperDimensions')));
      }
    }]);

    return _class;
  }(_react.Component), _class.displayName = (0, _utils.provideDisplayName)('sortableList', WrappedComponent), _class.defaultProps = {
    axis: 'y',
    transitionDuration: 300,
    pressDelay: 0,
    pressThreshold: 5,
    distance: 0,
    useWindowAsScrollContainer: false,
    hideSortableGhost: true,
    shouldCancelStart: function shouldCancelStart(event) {
      // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
      var disabledElements = ['input', 'textarea', 'select', 'option', 'button'];

      if (disabledElements.indexOf(event.target.tagName.toLowerCase()) !== -1) {
        return true; // Return true to cancel sorting
      }
    },
    lockToContainerEdges: false,
    lockOffset: '50%',
    getHelperDimensions: function getHelperDimensions(_ref2) {
      var node = _ref2.node;
      return {
        width: node.offsetWidth,
        height: node.offsetHeight
      };
    }
  }, _class.propTypes = {
    axis: _propTypes2.default.oneOf(['x', 'y', 'xy']),
    distance: _propTypes2.default.number,
    dragLayer: _propTypes2.default.object,
    lockAxis: _propTypes2.default.string,
    helperClass: _propTypes2.default.string,
    transitionDuration: _propTypes2.default.number,
    contentWindow: _propTypes2.default.any,
    onSortStart: _propTypes2.default.func,
    onSortMove: _propTypes2.default.func,
    onSortOver: _propTypes2.default.func,
    onSortEnd: _propTypes2.default.func,
    onDragEnd: _propTypes2.default.func,
    shouldCancelStart: _propTypes2.default.func,
    pressDelay: _propTypes2.default.number,
    useDragHandle: _propTypes2.default.bool,
    useWindowAsScrollContainer: _propTypes2.default.bool,
    hideSortableGhost: _propTypes2.default.bool,
    lockToContainerEdges: _propTypes2.default.bool,
    lockOffset: _propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string, _propTypes2.default.arrayOf(_propTypes2.default.oneOfType([_propTypes2.default.number, _propTypes2.default.string]))]),
    getContainer: _propTypes2.default.func,
    getHelperDimensions: _propTypes2.default.func
  }, _class.childContextTypes = {
    manager: _propTypes2.default.object.isRequired
  }, _temp;
}