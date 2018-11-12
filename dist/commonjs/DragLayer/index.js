'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('../utils');

var _utils2 = require('./utils');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DragLayer = function () {
  function DragLayer() {
    var _this = this;

    _classCallCheck(this, DragLayer);

    this.helper = null;
    this.lists = [];

    this.handleSortMove = function (event) {
      event.preventDefault(); // Prevent scrolling on mobile
      _this.updatePosition(event);
      _this.updateTargetContainer(event);
      if (_this.currentList) {
        _this.currentList.handleSortMove(event);
      }
    };

    this.handleSortEnd = function (event) {
      if (_this.listenerNode) {
        _utils.events.move.forEach(function (eventName) {
          return _this.listenerNode.removeEventListener(eventName, _this.handleSortMove);
        });
        _utils.events.end.forEach(function (eventName) {
          return _this.listenerNode.removeEventListener(eventName, _this.handleSortEnd);
        });
      }

      if (typeof _this.onDragEnd === 'function') {
        _this.onDragEnd();
      }
      // Remove the helper from the DOM
      if (_this.helper) {
        _this.helper.parentNode.removeChild(_this.helper);
        _this.helper = null;
        _this.currentList.handleSortEnd(event);
      }

      // Reset window scroll & container height diff
      _this.lists.forEach(function (list) {
        delete list.initialWindowScroll;
      });

      // Reset container height diff
      _this.totalContainerHeightDelta = 0;
    };
  }

  _createClass(DragLayer, [{
    key: 'addRef',
    value: function addRef(list) {
      this.lists.push(list);
    }
  }, {
    key: 'removeRef',
    value: function removeRef(list) {
      var i = this.lists.indexOf(list);
      if (i !== -1) {
        this.lists.splice(i, 1);
      }
    }
  }, {
    key: 'setTranslateBoundaries',
    value: function setTranslateBoundaries(containerBoundingRect, list) {
      var useWindowAsScrollContainer = list.props.useWindowAsScrollContainer;


      this.minTranslate = {};
      this.maxTranslate = {};
      if (this.axis.x) {
        this.minTranslate.x = (useWindowAsScrollContainer ? 0 : containerBoundingRect.left) - this.boundingClientRect.left - this.width / 2;
        this.maxTranslate.x = (useWindowAsScrollContainer ? list.contentWindow.innerWidth : containerBoundingRect.left + containerBoundingRect.width) - this.boundingClientRect.left - this.width / 2;
      }
      if (this.axis.y) {
        this.minTranslate.y = (useWindowAsScrollContainer ? 0 : containerBoundingRect.top) - this.boundingClientRect.top - this.height / 2;
        this.maxTranslate.y = (useWindowAsScrollContainer ? list.contentWindow.innerHeight : containerBoundingRect.top + containerBoundingRect.height) - this.boundingClientRect.top - this.height / 2;
      }
    }
  }, {
    key: 'startDrag',
    value: function startDrag(parent, list, event) {
      var _this2 = this;

      var position = (0, _utils.getPosition)(event);
      var activeNode = list.manager.getActive();

      if (activeNode) {
        var _list$props = list.props,
            axis = _list$props.axis,
            getHelperDimensions = _list$props.getHelperDimensions;
        var node = activeNode.node,
            collection = activeNode.collection;
        var index = node.sortableInfo.index;

        var margin = (0, _utils.getElementMargin)(node);
        var containerBoundingRect = list.container.getBoundingClientRect();
        var dimensions = getHelperDimensions({ index: index, node: node, collection: collection });

        this.width = dimensions.width;
        this.height = dimensions.height;
        this.marginOffset = {
          x: margin.left + margin.right,
          y: Math.max(margin.top, margin.bottom)
        };
        this.boundingClientRect = node.getBoundingClientRect();
        this.containerBoundingRect = containerBoundingRect;
        this.currentList = list;

        this.axis = {
          x: axis.indexOf('x') >= 0,
          y: axis.indexOf('y') >= 0
        };
        this.offsetEdge = (0, _utils.getEdgeOffset)(node, list.container);

        this.initialOffset = position;
        this.distanceBetweenContainers = {
          x: 0,
          y: 0
        };

        // When dragging up, any change in height in the target container must
        // be accounted for
        this.totalContainerHeightDelta = 0;

        var fields = node.querySelectorAll('input, textarea, select, canvas');
        var clonedNode = node.cloneNode(true);
        var clonedFields = [].concat(_toConsumableArray(clonedNode.querySelectorAll('input, textarea, select, canvas'))); // Convert NodeList to Array

        clonedFields.forEach(function (field, index) {
          if (field.tagName === 'CANVAS') {
            if (fields[index].tagName === 'CANVAS') {
              var destCtx = field.getContext('2d');
              destCtx.drawImage(fields[index], 0, 0);
            }
          } else if (field.type !== 'file' && fields[index]) {
            field.value = fields[index].value;
          }
        });

        this.helper = parent.appendChild(clonedNode);

        this.helper.style.position = 'fixed';
        this.helper.style.top = this.boundingClientRect.top - margin.top + 'px';
        this.helper.style.left = this.boundingClientRect.left - margin.left + 'px';
        this.helper.style.width = this.width + 'px';
        this.helper.style.height = this.height + 'px';
        this.helper.style.boxSizing = 'border-box';
        this.helper.style.pointerEvents = 'none';

        this.setTranslateBoundaries(containerBoundingRect, list);

        this.listenerNode = event.touches ? node : list.contentWindow;
        _utils.events.move.forEach(function (eventName) {
          return _this2.listenerNode.addEventListener(eventName, _this2.handleSortMove, false);
        });
        _utils.events.end.forEach(function (eventName) {
          return _this2.listenerNode.addEventListener(eventName, _this2.handleSortEnd, false);
        });

        return activeNode;
      }
      return false;
    }
  }, {
    key: 'stopDrag',
    value: function stopDrag() {
      this.handleSortEnd();
    }
  }, {
    key: 'updatePosition',
    value: function updatePosition(event) {
      var _currentList$props = this.currentList.props,
          lockAxis = _currentList$props.lockAxis,
          lockToContainerEdges = _currentList$props.lockToContainerEdges;

      var position = (0, _utils.getPosition)(event);
      var translate = {
        x: position.x - this.initialOffset.x,
        y: position.y - this.initialOffset.y
      };
      // Adjust for window scroll
      translate.y -= window.pageYOffset - this.currentList.initialWindowScroll.top;
      translate.x -= window.pageXOffset - this.currentList.initialWindowScroll.left;

      this.translate = translate;
      this.delta = position;

      if (lockToContainerEdges) {
        var _currentList$getLockP = this.currentList.getLockPixelOffsets(),
            _currentList$getLockP2 = _slicedToArray(_currentList$getLockP, 2),
            minLockOffset = _currentList$getLockP2[0],
            maxLockOffset = _currentList$getLockP2[1];

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
    key: 'updateTargetContainer',
    value: function updateTargetContainer(event) {
      var _delta = this.delta,
          x = _delta.x,
          y = _delta.y;

      var originList = this.currentList;
      var targetList = this.lists[(0, _utils2.closestRect)(x, y, this.lists.map(function (l) {
        return l.container;
      }))];
      var item = this.currentList.manager.active.item;

      this.active = item;
      if (targetList !== originList) {
        this.currentList = targetList;

        // Store scroll and heights before callbacks have been executed
        var originListInitialWindowScroll = originList.initialWindowScroll;
        var originListContainerHeight = originList.container.getBoundingClientRect().height;
        var currentListContainerHeight = this.currentList.container.getBoundingClientRect().height;

        originList.handleSortEnd(event, this.currentList);

        this.setTranslateBoundaries(this.currentList.container.getBoundingClientRect(), this.currentList);
        this.currentList.manager.active = _extends({}, this.currentList.getClosestNode(event), {
          item: item
        });
        this.currentList.handlePress(event);

        // Override initial scroll to use scroll of origin list
        this.currentList.initialWindowScroll = originListInitialWindowScroll;
        this.distanceBetweenContainers = (0, _utils2.updateDistanceBetweenContainers)(this.distanceBetweenContainers, this.currentList, originList);

        // Take account of changes in container height when dragging up
        var originListRect = originList.container.getBoundingClientRect();
        var currentListRect = this.currentList.container.getBoundingClientRect();
        var newOriginListContainerHeight = originListRect.height;
        var newCurrentListContainerHeight = currentListRect.height;

        // If we're dragging up, calculate any height change in the current list container and add it to the
        // y distance. We collect the total height change during a drop operation so we know when we have
        // to subtract height changes as we drag downwards. This is to accommodate DND operations that may
        // add or subtract height from multiple lists as the user moves up and down, before the destination list is chosen.
        if (currentListRect.top < originListRect.top) {
          var currentListContainerHeightDelta = Math.abs(currentListContainerHeight - newCurrentListContainerHeight);
          this.totalContainerHeightDelta += currentListContainerHeightDelta;
          this.distanceBetweenContainers.y += currentListContainerHeightDelta;
        } else if (currentListRect.top > originListRect.top && this.totalContainerHeightDelta > 0) {
          var originContainerHeightDelta = Math.abs(newOriginListContainerHeight - originListContainerHeight);
          this.totalContainerHeightDelta -= originContainerHeightDelta;
        }
      }
    }
  }]);

  return DragLayer;
}();

exports.default = DragLayer;