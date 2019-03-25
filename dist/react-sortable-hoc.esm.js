import _extends from '@babel/runtime/helpers/esm/extends';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import _toConsumableArray from '@babel/runtime/helpers/esm/toConsumableArray';
import _classCallCheck from '@babel/runtime/helpers/esm/classCallCheck';
import _createClass from '@babel/runtime/helpers/esm/createClass';
import _possibleConstructorReturn from '@babel/runtime/helpers/esm/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/esm/getPrototypeOf';
import _assertThisInitialized from '@babel/runtime/helpers/esm/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/esm/inherits';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import {createElement, Component} from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import invariant from 'invariant';
import findIndex from 'lodash/findIndex';
import isPlainObject from 'lodash/isPlainObject';
import _objectSpread from '@babel/runtime/helpers/esm/objectSpread';
import 'classlist-polyfill';

function arrayMove(array, from, to) {
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}
function omit(obj) {
  for (
    var _len = arguments.length,
      keysToOmit = new Array(_len > 1 ? _len - 1 : 0),
      _key = 1;
    _key < _len;
    _key++
  ) {
    keysToOmit[_key - 1] = arguments[_key];
  }

  return Object.keys(obj).reduce(function(acc, key) {
    if (keysToOmit.indexOf(key) === -1) {
      acc[key] = obj[key];
    }

    return acc;
  }, {});
}
var events = {
  start: ['touchstart', 'mousedown'],
  move: ['touchmove', 'mousemove'],
  end: ['touchend', 'touchcancel', 'mouseup'],
};
var vendorPrefix = (function() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return '';
  }

  var styles = window.getComputedStyle(document.documentElement, '') || [
    '-moz-hidden-iframe',
  ];
  var pre = (Array.prototype.slice
    .call(styles)
    .join('')
    .match(/-(moz|webkit|ms)-/) ||
    (styles.OLink === '' && ['', 'o']))[1];

  switch (pre) {
    case 'ms':
      return 'ms';

    default:
      return pre && pre.length ? pre[0].toUpperCase() + pre.substr(1) : '';
  }
})();
function closest(el, fn) {
  while (el) {
    if (fn(el)) {
      return el;
    }

    el = el.parentNode;
  }

  return null;
}
function limit(min, max, value) {
  return Math.max(min, Math.min(value, max));
}

function getPixelValue(stringValue) {
  if (stringValue.substr(-2) === 'px') {
    return parseFloat(stringValue);
  }

  return 0;
}

function getElementMargin(element) {
  var style = window.getComputedStyle(element);
  return {
    top: getPixelValue(style.marginTop),
    right: getPixelValue(style.marginRight),
    bottom: getPixelValue(style.marginBottom),
    left: getPixelValue(style.marginLeft),
  };
}
function provideDisplayName(prefix, Component) {
  var componentName = Component.displayName || Component.name;
  return componentName
    ? ''.concat(prefix, '(').concat(componentName, ')')
    : prefix;
}
function getPosition(event) {
  if (event.touches && event.touches.length) {
    return {
      x: event.touches[0].pageX,
      y: event.touches[0].pageY,
    };
  } else if (event.changedTouches && event.changedTouches.length) {
    return {
      x: event.changedTouches[0].pageX,
      y: event.changedTouches[0].pageY,
    };
  } else {
    return {
      x: event.pageX,
      y: event.pageY,
    };
  }
}
function isTouchEvent(event) {
  return (
    (event.touches && event.touches.length) ||
    (event.changedTouches && event.changedTouches.length)
  );
}
function getEdgeOffset(node, parent) {
  var offset =
    arguments.length > 2 && arguments[2] !== undefined
      ? arguments[2]
      : {
          top: 0,
          left: 0,
        };

  if (!node) {
    return undefined;
  }

  var nodeOffset = {
    top: offset.top + node.offsetTop,
    left: offset.left + node.offsetLeft,
  };

  if (node.parentNode === parent) {
    return nodeOffset;
  }

  return getEdgeOffset(node.parentNode, parent, nodeOffset);
}
function getLockPixelOffset(_ref) {
  var lockOffset = _ref.lockOffset,
    width = _ref.width,
    height = _ref.height;
  var offsetX = lockOffset;
  var offsetY = lockOffset;
  var unit = 'px';

  if (typeof lockOffset === 'string') {
    var match = /^[+-]?\d*(?:\.\d*)?(px|%)$/.exec(lockOffset);
    invariant(
      match !== null,
      'lockOffset value should be a number or a string of a ' +
        'number followed by "px" or "%". Given %s',
      lockOffset,
    );
    offsetX = parseFloat(lockOffset);
    offsetY = parseFloat(lockOffset);
    unit = match[1];
  }

  invariant(
    isFinite(offsetX) && isFinite(offsetY),
    'lockOffset value should be a finite. Given %s',
    lockOffset,
  );

  if (unit === '%') {
    offsetX = (offsetX * width) / 100;
    offsetY = (offsetY * height) / 100;
  }

  return {
    x: offsetX,
    y: offsetY,
  };
}
var NodeType = {
  Anchor: 'A',
  Button: 'BUTTON',
  Canvas: 'CANVAS',
  Input: 'INPUT',
  Option: 'OPTION',
  Textarea: 'TEXTAREA',
  Select: 'SELECT',
};

function distanceRect(x, y, rect) {
  var pageXOffset = window.pageXOffset;
  var pageYOffset = window.pageYOffset;
  var left = rect.left + pageXOffset;
  var right = rect.right + pageXOffset;
  var top = rect.top + pageYOffset;
  var bottom = rect.bottom + pageYOffset;
  var dx = x - limit(left, right, x);
  var dy = y - limit(top, bottom, y);
  return Math.sqrt(dx * dx + dy * dy);
}
function closestRect(x, y, containers) {
  var distances = containers.map(function(container) {
    return distanceRect(x, y, container.getBoundingClientRect());
  });
  return distances.indexOf(Math.min.apply(Math, _toConsumableArray(distances)));
}
function getDelta(rect1, rect2) {
  return {
    x: rect1.left - rect2.left,
    y: rect1.top - rect2.top,
  };
}
function updateDistanceBetweenContainers(distance, container1, container2) {
  var x = distance.x,
    y = distance.y;
  var delta = getDelta.apply(
    void 0,
    _toConsumableArray(
      [container1, container2].map(function(cont) {
        return cont.container.getBoundingClientRect();
      }),
    ),
  );
  var scrollDX =
    container2.scrollContainer.scrollLeft -
    container1.scrollContainer.scrollLeft;
  var scrollDY =
    container2.scrollContainer.scrollTop - container1.scrollContainer.scrollTop;
  return {
    x: x + delta.x + scrollDX,
    y: y + delta.y + scrollDY,
  };
}

var DragLayer = (function() {
  function DragLayer() {
    var _this = this;

    _classCallCheck(this, DragLayer);

    _defineProperty(this, 'helper', null);

    _defineProperty(this, 'lists', []);

    _defineProperty(this, 'handleSortMove', function(event) {
      event.preventDefault();

      _this.updatePosition(event);

      _this.updateTargetContainer(event);

      if (_this.targetList) {
        _this.targetList.handleSortMove(event);
      }
    });

    _defineProperty(this, 'handleSortEnd', function(event) {
      if (_this.listenerNode) {
        events.move.forEach(function(eventName) {
          return _this.listenerNode.removeEventListener(
            eventName,
            _this.handleSortMove,
          );
        });
        events.end.forEach(function(eventName) {
          return _this.listenerNode.removeEventListener(
            eventName,
            _this.handleSortEnd,
          );
        });
      }

      if (typeof _this.onDragEnd === 'function') {
        _this.onDragEnd();
      }

      if (_this.helper) {
        _this.helper.parentNode.removeChild(_this.helper);

        _this.helper = null;

        _this.targetList.handleSortEnd(event);
      }

      _this.lists.forEach(function(list) {
        delete list.initialWindowScroll;
      });
    });
  }

  _createClass(DragLayer, [
    {
      key: 'addRef',
      value: function addRef(list) {
        this.lists.push(list);
      },
    },
    {
      key: 'removeRef',
      value: function removeRef(list) {
        var i = this.lists.indexOf(list);

        if (i !== -1) {
          this.lists.splice(i, 1);
        }
      },
    },
    {
      key: 'setTranslateBoundaries',
      value: function setTranslateBoundaries(containerBoundingRect, list) {
        var useWindowAsScrollContainer = list.props.useWindowAsScrollContainer;
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
      },
    },
    {
      key: 'startDrag',
      value: function startDrag(parent, list, event) {
        var _this2 = this;

        var position = getPosition(event);
        var activeNode = list.manager.getActive();

        if (activeNode) {
          var _list$props = list.props,
            axis = _list$props.axis,
            getHelperDimensions = _list$props.getHelperDimensions;
          var node = activeNode.node,
            collection = activeNode.collection;
          var index = node.sortableInfo.index;
          var margin = getElementMargin(node);
          var containerBoundingRect = list.container.getBoundingClientRect();
          var dimensions = getHelperDimensions({
            index: index,
            node: node,
            collection: collection,
          });
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
          var fields = node.querySelectorAll('input, textarea, select, canvas');
          var clonedNode = node.cloneNode(true);

          var clonedFields = _toConsumableArray(
            clonedNode.querySelectorAll('input, textarea, select, canvas'),
          );

          if (fields[index]) {
            clonedFields.forEach(function(field, i) {
              if (field.type !== 'file') {
                field.value = fields[i].value;
              }

              if (field.tagName === NodeType.Canvas) {
                var destCtx = field.getContext('2d');
                destCtx.drawImage(fields[index], 0, 0);
              }
            });
          }

          this.helper = parent.appendChild(clonedNode);
          this.helper.style.position = 'fixed';
          this.helper.style.top = ''.concat(
            this.boundingClientRect.top - margin.top,
            'px',
          );
          this.helper.style.left = ''.concat(
            this.boundingClientRect.left - margin.left,
            'px',
          );
          this.helper.style.width = ''.concat(this.width, 'px');
          this.helper.style.height = ''.concat(this.height, 'px');
          this.helper.style.boxSizing = 'border-box';
          this.helper.style.pointerEvents = 'none';
          this.setTranslateBoundaries(containerBoundingRect, list);
          this.listenerNode = event.touches ? node : list.contentWindow;
          events.move.forEach(function(eventName) {
            return _this2.listenerNode.addEventListener(
              eventName,
              _this2.handleSortMove,
              false,
            );
          });
          events.end.forEach(function(eventName) {
            return _this2.listenerNode.addEventListener(
              eventName,
              _this2.handleSortEnd,
              false,
            );
          });
          return activeNode;
        }

        return false;
      },
    },
    {
      key: 'stopDrag',
      value: function stopDrag() {
        this.handleSortEnd();
      },
    },
    {
      key: 'updatePosition',
      value: function updatePosition(event) {
        var _this$targetList$prop = this.targetList.props,
          lockAxis = _this$targetList$prop.lockAxis,
          lockToContainerEdges = _this$targetList$prop.lockToContainerEdges;
        var offset = getPosition(event);
        var translate = {
          x: offset.x - this.initialOffset.x,
          y: offset.y - this.initialOffset.y,
        };
        translate.y -=
          window.pageYOffset - this.targetList.initialWindowScroll.top;
        translate.x -=
          window.pageXOffset - this.targetList.initialWindowScroll.left;
        this.translate = translate;
        this.delta = offset;

        if (lockToContainerEdges) {
          var _this$targetList$getL = this.targetList.getLockPixelOffsets(),
            _this$targetList$getL2 = _slicedToArray(_this$targetList$getL, 2),
            minLockOffset = _this$targetList$getL2[0],
            maxLockOffset = _this$targetList$getL2[1];

          var minOffset = {
            x: this.width / 2 - minLockOffset.x,
            y: this.height / 2 - minLockOffset.y,
          };
          var maxOffset = {
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

        this.helper.style[
          ''.concat(vendorPrefix, 'Transform')
        ] = 'translate3d('
          .concat(translate.x, 'px,')
          .concat(translate.y, 'px, 0)');
      },
    },
    {
      key: 'updateTargetContainer',
      value: function updateTargetContainer(event) {
        var _this$delta = this.delta,
          x = _this$delta.x,
          y = _this$delta.y;
        var originList = this.targetList;
        var targetList = this.lists[
          closestRect(
            x,
            y,
            this.lists.map(function(list) {
              return list.container;
            }),
          )
        ];
        var item = this.targetList.manager.active.item;
        this.active = item;

        if (targetList !== originList) {
          this.targetList = targetList;
          var originListInitialWindowScroll = originList.initialWindowScroll;
          var cachedOriginListRect = originList.container.getBoundingClientRect();
          var cachedTargetListRect = targetList.container.getBoundingClientRect();
          originList.handleSortEnd(event, targetList);
          this.setTranslateBoundaries(
            targetList.container.getBoundingClientRect(),
            targetList,
          );
          this.targetList.manager.active = _objectSpread(
            {},
            targetList.getClosestNode(event),
            {
              item: item,
            },
          );
          targetList.handlePress(event);
          this.targetList.initialWindowScroll = originListInitialWindowScroll;
          this.distanceBetweenContainers = updateDistanceBetweenContainers(
            this.distanceBetweenContainers,
            targetList,
            originList,
          );
          var targetListRect = targetList.container.getBoundingClientRect();

          if (targetListRect.top < cachedOriginListRect.top) {
            var targetListContainerHeightDelta = Math.abs(
              cachedTargetListRect.height - targetListRect.height,
            );
            this.distanceBetweenContainers.y += targetListContainerHeightDelta;
          }
        }
      },
    },
  ]);

  return DragLayer;
})();

var Manager = (function() {
  function Manager() {
    _classCallCheck(this, Manager);

    _defineProperty(this, 'refs', {});
  }

  _createClass(Manager, [
    {
      key: 'add',
      value: function add(collection, ref) {
        if (!this.refs[collection]) {
          this.refs[collection] = [];
        }

        this.refs[collection].push(ref);
      },
    },
    {
      key: 'remove',
      value: function remove(collection, ref) {
        var index = this.getIndex(collection, ref);

        if (index !== -1) {
          this.refs[collection].splice(index, 1);
        }
      },
    },
    {
      key: 'isActive',
      value: function isActive() {
        return this.active;
      },
    },
    {
      key: 'getActive',
      value: function getActive() {
        var _this = this;

        if (!this.active) {
          return null;
        }

        var activeRef = this.refs[this.active.collection];

        if (!activeRef) {
          return null;
        }

        return (
          activeRef.find(function(_ref) {
            var node = _ref.node;
            return node.sortableInfo.index == _this.active.index;
          }) || activeRef.slice(-1).pop()
        );
      },
    },
    {
      key: 'getIndex',
      value: function getIndex(collection, ref) {
        return this.refs[collection].indexOf(ref);
      },
    },
    {
      key: 'getOrderedRefs',
      value: function getOrderedRefs() {
        var collection =
          arguments.length > 0 && arguments[0] !== undefined
            ? arguments[0]
            : this.active.collection;
        return this.refs[collection].sort(sortByIndex);
      },
    },
  ]);

  return Manager;
})();

function sortByIndex(_ref2, _ref3) {
  var index1 = _ref2.node.sortableInfo.index;
  var index2 = _ref3.node.sortableInfo.index;
  return index1 - index2;
}

function _finallyRethrows(body, finalizer) {
  try {
    var result = body();
  } catch (e) {
    return finalizer(true, e);
  }

  if (result && result.then) {
    return result.then(finalizer.bind(null, false), finalizer.bind(null, true));
  }

  return finalizer(false, value);
}
function sortableContainer(WrappedComponent) {
  var _class, _temp;

  var config =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : {
          withRef: false,
        };
  return (
    (_temp = _class = (function(_React$Component) {
      _inherits(WithSortableContainer, _React$Component);

      function WithSortableContainer(props) {
        var _this;

        _classCallCheck(this, WithSortableContainer);

        _this = _possibleConstructorReturn(
          this,
          _getPrototypeOf(WithSortableContainer).call(this, props),
        );

        _defineProperty(
          _assertThisInitialized(_this),
          'checkActiveIndex',
          function(nextProps) {
            var _ref = nextProps || _this.props,
              items = _ref.items;

            var item = _this.manager.active.item;
            var newIndex = isPlainObject(item)
              ? findIndex(items, function(obj) {
                  return obj.id === item.id;
                })
              : findIndex(items, item);

            if (newIndex === -1) {
              _this.dragLayer.stopDrag();

              return;
            }

            _this.manager.active.index = newIndex;
            _this.index = newIndex;
          },
        );

        _defineProperty(_assertThisInitialized(_this), 'handleStart', function(
          event,
        ) {
          var _this$props = _this.props,
            distance = _this$props.distance,
            shouldCancelStart = _this$props.shouldCancelStart,
            items = _this$props.items;

          if (event.button === 2 || shouldCancelStart(event)) {
            return;
          }

          _this._touched = true;
          _this._pos = getPosition(event);
          var node = closest(event.target, function(el) {
            return el.sortableInfo != null;
          });

          if (
            node &&
            node.sortableInfo &&
            _this.nodeIsChild(node) &&
            !_this.sorting
          ) {
            var useDragHandle = _this.props.useDragHandle;
            var _node$sortableInfo = node.sortableInfo,
              index = _node$sortableInfo.index,
              collection = _node$sortableInfo.collection;

            if (
              useDragHandle &&
              !closest(event.target, function(el) {
                return el.sortableHandle != null;
              })
            ) {
              return;
            }

            _this.manager.active = {
              index: index,
              collection: collection,
              item: items[index],
            };

            if (
              !isTouchEvent(event) &&
              event.target.tagName.toLowerCase() === 'a'
            ) {
              event.preventDefault();
            }

            if (!distance) {
              if (_this.props.pressDelay === 0) {
                _this.handlePress(event);
              } else {
                _this.pressTimer = setTimeout(function() {
                  return _this.handlePress(event);
                }, _this.props.pressDelay);
              }
            }
          }
        });

        _defineProperty(_assertThisInitialized(_this), 'nodeIsChild', function(
          node,
        ) {
          return node.sortableInfo.manager === _this.manager;
        });

        _defineProperty(_assertThisInitialized(_this), 'handleMove', function(
          event,
        ) {
          var _this$props2 = _this.props,
            distance = _this$props2.distance,
            pressThreshold = _this$props2.pressThreshold;

          if (
            !_this.sorting &&
            _this._touched &&
            !_this._awaitingUpdateBeforeSortStart
          ) {
            var position = getPosition(event);
            var delta = {
              x: _this._pos.x - position.x,
              y: _this._pos.y - position.y,
            };
            var combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);
            _this.delta = delta;

            if (
              !distance &&
              (!pressThreshold ||
                (pressThreshold && combinedDelta >= pressThreshold))
            ) {
              clearTimeout(_this.cancelTimer);
              _this.cancelTimer = setTimeout(_this.cancel, 0);
            } else if (
              distance &&
              combinedDelta >= distance &&
              _this.manager.isActive()
            ) {
              _this.handlePress(event);
            }
          }
        });

        _defineProperty(_assertThisInitialized(_this), 'handleEnd', function() {
          _this._touched = false;

          _this.cancel();
        });

        _defineProperty(_assertThisInitialized(_this), 'cancel', function() {
          var distance = _this.props.distance;

          if (!_this.sorting) {
            if (!distance) {
              clearTimeout(_this.pressTimer);
            }

            _this.manager.active = null;
          }
        });

        _defineProperty(_assertThisInitialized(_this), 'handlePress', function(
          event,
        ) {
          try {
            var active = null;

            if (_this.dragLayer.helper) {
              if (_this.manager.active) {
                _this.checkActiveIndex();

                active = _this.manager.getActive();
              }
            } else {
              active = _this.dragLayer.startDrag(
                _this.document.body,
                _assertThisInitialized(_this),
                event,
              );
            }

            var _temp6 = (function() {
              if (active) {
                var _temp7 = function _temp7() {
                  _this.index = _index;
                  _this.newIndex = _index;
                  _this.axis = {
                    x: _axis.indexOf('x') >= 0,
                    y: _axis.indexOf('y') >= 0,
                  };
                  _this.initialScroll = {
                    top: _this.container.scrollTop,
                    left: _this.container.scrollLeft,
                  };
                  _this.initialWindowScroll = {
                    top: window.pageYOffset,
                    left: window.pageXOffset,
                  };

                  if (_hideSortableGhost) {
                    _this.sortableGhost = _node;
                    _node.style.visibility = 'hidden';
                    _node.style.opacity = 0;
                  }

                  if (_helperClass) {
                    var _this$dragLayer$helpe;

                    (_this$dragLayer$helpe =
                      _this.dragLayer.helper.classList).add.apply(
                      _this$dragLayer$helpe,
                      _toConsumableArray(_helperClass.split(' ')),
                    );
                  }

                  _this.sorting = true;
                  _this.sortingIndex = _index;

                  if (_onSortStart) {
                    _onSortStart(
                      {
                        node: _node,
                        index: _index,
                        collection: _collection,
                      },
                      event,
                    );
                  }
                };

                var _this$props3 = _this.props,
                  _axis = _this$props3.axis,
                  _helperClass = _this$props3.helperClass,
                  _hideSortableGhost = _this$props3.hideSortableGhost,
                  updateBeforeSortStart = _this$props3.updateBeforeSortStart,
                  _onSortStart = _this$props3.onSortStart;
                var _active = active,
                  _node = _active.node,
                  _collection = _active.collection;
                var _index = _node.sortableInfo.index;

                var _temp8 = (function() {
                  if (typeof updateBeforeSortStart === 'function') {
                    _this._awaitingUpdateBeforeSortStart = true;

                    var _temp9 = _finallyRethrows(
                      function() {
                        return Promise.resolve(
                          updateBeforeSortStart(
                            {
                              node: _node,
                              index: _index,
                              collection: _collection,
                            },
                            event,
                          ),
                        ).then(function() {});
                      },
                      function(_wasThrown, _result) {
                        _this._awaitingUpdateBeforeSortStart = false;
                        if (_wasThrown) throw _result;
                        return _result;
                      },
                    );

                    if (_temp9 && _temp9.then)
                      return _temp9.then(function() {});
                  }
                })();

                return _temp8 && _temp8.then
                  ? _temp8.then(_temp7)
                  : _temp7(_temp8);
              }
            })();

            return Promise.resolve(
              _temp6 && _temp6.then ? _temp6.then(function() {}) : void 0,
            );
          } catch (e) {
            return Promise.reject(e);
          }
        });

        _defineProperty(
          _assertThisInitialized(_this),
          '_handleSortMove',
          function(event) {
            if (_this.checkActive(event)) {
              _this.animateNodes();

              _this.autoscroll();
            }

            if (window.requestAnimationFrame) {
              _this.sortMoveAF = null;
            } else {
              setTimeout(function() {
                _this.sortMoveAF = null;
              }, 1000 / 60);
            }
          },
        );

        _defineProperty(
          _assertThisInitialized(_this),
          'handleSortMove',
          function(event) {
            var onSortMove = _this.props.onSortMove;
            event.preventDefault();

            if (_this.sortMoveAF) {
              return;
            }

            if (window.requestAnimationFrame) {
              _this.sortMoveAF = window.requestAnimationFrame(
                _this._handleSortMove,
              );
            } else {
              _this.sortMoveAF = true;

              _this._handleSortMove();
            }

            if (onSortMove) {
              onSortMove(event);
            }
          },
        );

        _defineProperty(
          _assertThisInitialized(_this),
          'handleSortEnd',
          function(event) {
            var newList =
              arguments.length > 1 && arguments[1] !== undefined
                ? arguments[1]
                : null;
            var _this$props4 = _this.props,
              hideSortableGhost = _this$props4.hideSortableGhost,
              onSortEnd = _this$props4.onSortEnd;

            if (!_this.manager.active) {
              return;
            }

            var collection = _this.manager.active.collection;

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
              var _node2 = nodes[i];
              var el = _node2.node;
              _node2.edgeOffset = null;
              el.style[''.concat(vendorPrefix, 'Transform')] = '';
              el.style[''.concat(vendorPrefix, 'TransitionDuration')] = '';
            }

            clearInterval(_this.autoscrollInterval);
            _this.autoscrollInterval = null;
            _this.manager.active = null;
            _this.sorting = false;
            _this.sortingIndex = null;

            if (typeof onSortEnd === 'function') {
              if (newList) {
                _this.newIndex = newList.getClosestNode(event).index;
              }

              onSortEnd(
                {
                  oldIndex: _this.index,
                  newIndex: _this.newIndex,
                  newList: newList,
                  collection: collection,
                },
                event,
              );
            }

            _this._touched = false;
          },
        );

        _defineProperty(
          _assertThisInitialized(_this),
          'handleSortSwap',
          function(index, item) {
            var onSortSwap = _this.props.onSortSwap;

            if (typeof onSortSwap === 'function') {
              onSortSwap({
                index: index,
                item: item,
              });
            }
          },
        );

        _defineProperty(
          _assertThisInitialized(_this),
          'getClosestNode',
          function(event) {
            var position = getPosition(event);
            var closestNodes = [];
            var closestCollections = [];
            Object.keys(_this.manager.refs).forEach(function(collection) {
              var nodes = _this.manager.refs[collection].map(function(ref) {
                return ref.node;
              });

              if (nodes && nodes.length > 0) {
                closestNodes.push(
                  nodes[closestRect(position.x, position.y, nodes)],
                );
                closestCollections.push(collection);
              }
            });
            var index = closestRect(position.x, position.y, closestNodes);
            var collection = closestCollections[index];

            if (collection === undefined) {
              return {
                collection: collection,
                index: 0,
              };
            }

            var finalNodes = _this.manager.refs[collection].map(function(ref) {
              return ref.node;
            });

            var finalIndex = finalNodes.indexOf(closestNodes[index]);
            var node = closestNodes[index];
            var rect = node.getBoundingClientRect();
            return {
              collection: collection,
              index: finalIndex + (position.y > rect.bottom ? 1 : 0),
            };
          },
        );

        _defineProperty(_assertThisInitialized(_this), 'checkActive', function(
          event,
        ) {
          var active = _this.manager.active;

          if (!active) {
            var _node3 = closest(event.target, function(el) {
              return el.sortableInfo != null;
            });

            if (_node3 && _node3.sortableInfo) {
              var pos = getPosition(event);
              var _collection2 = _node3.sortableInfo.collection;

              var nodes = _this.manager.refs[_collection2].map(function(ref) {
                return ref.node;
              });

              if (nodes) {
                var _index2 = closestRect(pos.x, pos.y, nodes);

                _this.manager.active = {
                  index: _index2,
                  collection: _collection2,
                  item: _this.props.items[_index2],
                };

                _this.handlePress(event);
              }
            }

            return false;
          }

          return true;
        });

        _defineProperty(
          _assertThisInitialized(_this),
          'autoscroll',
          function() {
            var disableAutoscroll = _this.props.disableAutoscroll;

            if (disableAutoscroll) {
              return;
            }

            var translate = _this.dragLayer.translate;
            var direction = {
              x: 0,
              y: 0,
            };
            var speed = {
              x: 1,
              y: 1,
            };
            var acceleration = {
              x: 10,
              y: 10,
            };
            var _this$scrollContainer = _this.scrollContainer,
              scrollTop = _this$scrollContainer.scrollTop,
              scrollLeft = _this$scrollContainer.scrollLeft,
              scrollHeight = _this$scrollContainer.scrollHeight,
              scrollWidth = _this$scrollContainer.scrollWidth,
              clientHeight = _this$scrollContainer.clientHeight,
              clientWidth = _this$scrollContainer.clientWidth;
            var isTop = scrollTop === 0;
            var isBottom = scrollHeight - scrollTop - clientHeight === 0;
            var isLeft = scrollLeft === 0;
            var isRight = scrollWidth - scrollLeft - clientWidth === 0;

            if (
              translate.y >=
                _this.dragLayer.maxTranslate.y - _this.dragLayer.height / 2 &&
              !isBottom
            ) {
              direction.y = 1;
              speed.y =
                acceleration.y *
                Math.abs(
                  (_this.dragLayer.maxTranslate.y -
                    _this.dragLayer.height / 2 -
                    translate.y) /
                    _this.dragLayer.height,
                );
            } else if (
              translate.x >=
                _this.dragLayer.maxTranslate.x - _this.dragLayer.width / 2 &&
              !isRight
            ) {
              direction.x = 1;
              speed.x =
                acceleration.x *
                Math.abs(
                  (_this.dragLayer.maxTranslate.x -
                    _this.dragLayer.width / 2 -
                    translate.x) /
                    _this.dragLayer.width,
                );
            } else if (
              translate.y <=
                _this.dragLayer.minTranslate.y + _this.dragLayer.height / 2 &&
              !isTop
            ) {
              direction.y = -1;
              speed.y =
                acceleration.y *
                Math.abs(
                  (translate.y -
                    _this.dragLayer.height / 2 -
                    _this.dragLayer.minTranslate.y) /
                    _this.dragLayer.height,
                );
            } else if (
              translate.x <=
                _this.dragLayer.minTranslate.x + _this.dragLayer.width / 2 &&
              !isLeft
            ) {
              direction.x = -1;
              speed.x =
                acceleration.x *
                Math.abs(
                  (translate.x -
                    _this.dragLayer.width / 2 -
                    _this.dragLayer.minTranslate.x) /
                    _this.dragLayer.width,
                );
            }

            if (_this.autoscrollInterval) {
              clearInterval(_this.autoscrollInterval);
              _this.autoscrollInterval = null;
              _this.isAutoScrolling = false;
            }

            if (direction.x !== 0 || direction.y !== 0) {
              _this.autoscrollInterval = setInterval(function() {
                _this.isAutoScrolling = true;
                var offset = {
                  left: speed.x * direction.x,
                  top: speed.y * direction.y,
                };
                _this.scrollContainer.scrollTop += offset.top;
                _this.scrollContainer.scrollLeft += offset.left;

                _this.animateNodes();
              }, 5);
            }
          },
        );

        _this.dragLayer = props.dragLayer || new DragLayer();

        _this.dragLayer.addRef(_assertThisInitialized(_this));

        _this.dragLayer.onDragEnd = props.onDragEnd;
        _this.manager = new Manager();
        _this.events = {
          start: _this.handleStart,
          move: _this.handleMove,
          end: _this.handleEnd,
        };
        invariant(
          !(props.distance && props.pressDelay),
          'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.',
        );
        _this.state = {};
        _this.sorting = false;
        return _this;
      }

      _createClass(WithSortableContainer, [
        {
          key: 'getChildContext',
          value: function getChildContext() {
            return {
              manager: this.manager,
            };
          },
        },
        {
          key: 'componentDidMount',
          value: function componentDidMount() {
            var _this2 = this;

            var useWindowAsScrollContainer = this.props
              .useWindowAsScrollContainer;
            var container = this.getContainer();
            Promise.resolve(container).then(function(containerNode) {
              _this2.container = containerNode;
              _this2.document = _this2.container.ownerDocument || document;
              var contentWindow =
                _this2.props.contentWindow ||
                _this2.document.defaultView ||
                window;
              _this2.contentWindow =
                typeof contentWindow === 'function'
                  ? contentWindow()
                  : contentWindow;
              _this2.scrollContainer = useWindowAsScrollContainer
                ? _this2.document.scrollingElement ||
                  _this2.document.documentElement
                : _this2.container;
              _this2.initialScroll = {
                top: _this2.scrollContainer.scrollTop,
                left: _this2.scrollContainer.scrollLeft,
              };

              var _loop = function _loop(key) {
                if (_this2.events.hasOwnProperty(key)) {
                  events[key].forEach(function(eventName) {
                    return _this2.container.addEventListener(
                      eventName,
                      _this2.events[key],
                      false,
                    );
                  });
                }
              };

              for (var key in _this2.events) {
                _loop(key);
              }
            });
          },
        },
        {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            var _this3 = this;

            this.dragLayer.removeRef(this);

            if (this.container) {
              var _loop2 = function _loop2(key) {
                if (_this3.events.hasOwnProperty(key)) {
                  events[key].forEach(function(eventName) {
                    return _this3.container.removeEventListener(
                      eventName,
                      _this3.events[key],
                    );
                  });
                }
              };

              for (var key in this.events) {
                _loop2(key);
              }
            }
          },
        },
        {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            var active = this.manager.active;

            if (!active) {
              return;
            }

            this.checkActiveIndex(nextProps);
          },
        },
        {
          key: 'getLockPixelOffsets',
          value: function getLockPixelOffsets() {
            var _this$dragLayer = this.dragLayer,
              width = _this$dragLayer.width,
              height = _this$dragLayer.height;
            var lockOffset = this.props.lockOffset;
            var offsets = Array.isArray(lockOffset)
              ? lockOffset
              : [lockOffset, lockOffset];
            invariant(
              offsets.length === 2,
              'lockOffset prop of SortableContainer should be a single ' +
                'value or an array of exactly two values. Given %s',
              lockOffset,
            );

            var _offsets = _slicedToArray(offsets, 2),
              minLockOffset = _offsets[0],
              maxLockOffset = _offsets[1];

            return [
              getLockPixelOffset({
                lockOffset: minLockOffset,
                width: width,
                height: height,
              }),
              getLockPixelOffset({
                lockOffset: maxLockOffset,
                width: width,
                height: height,
              }),
            ];
          },
        },
        {
          key: 'animateNodes',
          value: function animateNodes() {
            if (!this.axis) {
              return;
            }

            var _this$props5 = this.props,
              transitionDuration = _this$props5.transitionDuration,
              hideSortableGhost = _this$props5.hideSortableGhost,
              onSortOver = _this$props5.onSortOver,
              animateNodes = _this$props5.animateNodes;
            var nodes = this.manager.getOrderedRefs();
            var containerScrollDelta = {
              left: this.container.scrollLeft - this.initialScroll.left,
              top: this.container.scrollTop - this.initialScroll.top,
            };
            var sortingOffset = {
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
            var windowScrollDelta = {
              top: window.pageYOffset - this.initialWindowScroll.top,
              left: window.pageXOffset - this.initialWindowScroll.left,
            };
            var prevIndex = this.newIndex;
            this.newIndex = null;

            for (var i = 0, len = nodes.length; i < len; i++) {
              var _node4 = nodes[i].node;
              var _index3 = _node4.sortableInfo.index;
              var width = _node4.offsetWidth;
              var height = _node4.offsetHeight;
              var offset = {
                width:
                  this.dragLayer.width > width
                    ? width / 2
                    : this.dragLayer.width / 2,
                height:
                  this.dragLayer.height > height
                    ? height / 2
                    : this.dragLayer.height / 2,
              };
              var translate = {
                x: 0,
                y: 0,
              };
              var edgeOffset = nodes[i].edgeOffset;

              if (!edgeOffset) {
                edgeOffset = getEdgeOffset(_node4, this.container);
                nodes[i].edgeOffset = edgeOffset;
              }

              var nextNode = i < nodes.length - 1 && nodes[i + 1];
              var prevNode = i > 0 && nodes[i - 1];

              if (nextNode && !nextNode.edgeOffset) {
                nextNode.edgeOffset = getEdgeOffset(
                  nextNode.node,
                  this.container,
                );
              }

              if (_index3 === this.index) {
                if (hideSortableGhost) {
                  this.sortableGhost = _node4;
                  _node4.style.visibility = 'hidden';
                  _node4.style.opacity = 0;
                }

                continue;
              }

              if (transitionDuration) {
                _node4.style[
                  ''.concat(vendorPrefix, 'TransitionDuration')
                ] = ''.concat(transitionDuration, 'ms');
              }

              if (this.axis.x) {
                if (this.axis.y) {
                  if (
                    _index3 < this.index &&
                    ((sortingOffset.left +
                      windowScrollDelta.left -
                      offset.width <=
                      edgeOffset.left &&
                      sortingOffset.top + windowScrollDelta.top <=
                        edgeOffset.top + offset.height) ||
                      sortingOffset.top +
                        windowScrollDelta.top +
                        offset.height <=
                        edgeOffset.top)
                  ) {
                    translate.x =
                      this.dragLayer.width + this.dragLayer.marginOffset.x;

                    if (
                      edgeOffset.left + translate.x >
                      this.dragLayer.containerBoundingRect.width - offset.width
                    ) {
                      if (nextNode) {
                        translate.x =
                          nextNode.edgeOffset.left - edgeOffset.left;
                        translate.y = nextNode.edgeOffset.top - edgeOffset.top;
                      }
                    }

                    if (this.newIndex === null) {
                      this.newIndex = _index3;
                    }
                  } else if (
                    _index3 > this.index &&
                    ((sortingOffset.left +
                      windowScrollDelta.left +
                      offset.width >=
                      edgeOffset.left &&
                      sortingOffset.top +
                        windowScrollDelta.top +
                        offset.height >=
                        edgeOffset.top) ||
                      sortingOffset.top +
                        windowScrollDelta.top +
                        offset.height >=
                        edgeOffset.top + height)
                  ) {
                    translate.x = -(
                      this.dragLayer.width + this.dragLayer.marginOffset.x
                    );

                    if (
                      edgeOffset.left + translate.x <
                      this.dragLayer.containerBoundingRect.left + offset.width
                    ) {
                      if (prevNode) {
                        translate.x =
                          prevNode.edgeOffset.left - edgeOffset.left;
                        translate.y = prevNode.edgeOffset.top - edgeOffset.top;
                      }
                    }

                    this.newIndex = _index3;
                  }
                } else {
                  if (
                    _index3 > this.index &&
                    sortingOffset.left +
                      windowScrollDelta.left +
                      offset.width >=
                      edgeOffset.left
                  ) {
                    translate.x = -(
                      this.dragLayer.width + this.dragLayer.marginOffset.x
                    );
                    this.newIndex = _index3;
                  } else if (
                    _index3 < this.index &&
                    sortingOffset.left + windowScrollDelta.left <=
                      edgeOffset.left + offset.width
                  ) {
                    translate.x =
                      this.dragLayer.width + this.dragLayer.marginOffset.x;

                    if (this.newIndex == null) {
                      this.newIndex = _index3;
                    }
                  }
                }
              } else if (this.axis.y) {
                if (
                  _index3 > this.index &&
                  sortingOffset.top + windowScrollDelta.top + offset.height >=
                    edgeOffset.top
                ) {
                  translate.y = -(
                    this.dragLayer.height + this.dragLayer.marginOffset.y
                  );
                  this.newIndex = _index3;
                } else if (
                  _index3 < this.index &&
                  sortingOffset.top + windowScrollDelta.top <=
                    edgeOffset.top + offset.height
                ) {
                  translate.y =
                    this.dragLayer.height + this.dragLayer.marginOffset.y;

                  if (this.newIndex == null) {
                    this.newIndex = _index3;
                  }
                }
              }

              if (animateNodes) {
                _node4.style[
                  ''.concat(vendorPrefix, 'Transform')
                ] = 'translate3d('
                  .concat(translate.x, 'px,')
                  .concat(translate.y, 'px,0)');
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
          },
        },
        {
          key: 'getWrappedInstance',
          value: function getWrappedInstance() {
            invariant(
              config.withRef,
              'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call',
            );
            return this.refs.wrappedInstance;
          },
        },
        {
          key: 'getContainer',
          value: function getContainer() {
            var getContainer = this.props.getContainer;

            if (typeof getContainer !== 'function') {
              return findDOMNode(this);
            }

            return getContainer(
              config.withRef ? this.getWrappedInstance() : undefined,
            );
          },
        },
        {
          key: 'render',
          value: function render() {
            var ref = config.withRef ? 'wrappedInstance' : null;
            return createElement(
              WrappedComponent,
              _extends(
                {
                  ref: ref,
                },
                omit(
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
                  'helperContainer',
                  'disableAutoscroll',
                ),
              ),
            );
          },
        },
        {
          key: 'helperContainer',
          get: function get() {
            var helperContainer = this.props.helperContainer;

            if (typeof helperContainer === 'function') {
              return helperContainer();
            }

            return this.props.helperContainer || this.document.body;
          },
        },
      ]);

      return WithSortableContainer;
    })(Component)),
    _defineProperty(
      _class,
      'displayName',
      provideDisplayName('sortableList', WrappedComponent),
    ),
    _defineProperty(_class, 'defaultProps', {
      axis: 'y',
      transitionDuration: 300,
      pressDelay: 0,
      pressThreshold: 5,
      distance: 0,
      useWindowAsScrollContainer: false,
      hideSortableGhost: true,
      animateNodes: true,
      shouldCancelStart: function shouldCancelStart(event) {
        var disabledElements = [
          'input',
          'textarea',
          'select',
          'option',
          'button',
        ];

        if (
          disabledElements.indexOf(event.target.tagName.toLowerCase()) !== -1
        ) {
          return true;
        }

        return false;
      },
      lockToContainerEdges: false,
      lockOffset: '50%',
      getHelperDimensions: function getHelperDimensions(_ref2) {
        var node = _ref2.node;
        return {
          width: node.offsetWidth,
          height: node.offsetHeight,
        };
      },
      disableAutoscroll: false,
    }),
    _defineProperty(_class, 'propTypes', {
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
      helperContainer: PropTypes.oneOfType([
        PropTypes.func,
        typeof HTMLElement === 'undefined'
          ? PropTypes.any
          : PropTypes.instanceOf(HTMLElement),
      ]),
      disableAutoscroll: PropTypes.bool,
    }),
    _defineProperty(_class, 'childContextTypes', {
      manager: PropTypes.object.isRequired,
    }),
    _temp
  );
}

function sortableElement(WrappedComponent) {
  var _class, _temp;

  var config =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : {
          withRef: false,
        };
  return (
    (_temp = _class = (function(_React$Component) {
      _inherits(WithSortableElement, _React$Component);

      function WithSortableElement() {
        _classCallCheck(this, WithSortableElement);

        return _possibleConstructorReturn(
          this,
          _getPrototypeOf(WithSortableElement).apply(this, arguments),
        );
      }

      _createClass(WithSortableElement, [
        {
          key: 'componentDidMount',
          value: function componentDidMount() {
            var _this$props = this.props,
              collection = _this$props.collection,
              disabled = _this$props.disabled,
              index = _this$props.index;

            if (!disabled) {
              this.setDraggable(collection, index);
            }
          },
        },
        {
          key: 'componentWillReceiveProps',
          value: function componentWillReceiveProps(nextProps) {
            if (this.props.index !== nextProps.index && this.node) {
              this.node.sortableInfo.index = nextProps.index;
            }

            if (this.props.disabled !== nextProps.disabled) {
              var collection = nextProps.collection,
                disabled = nextProps.disabled,
                index = nextProps.index;

              if (disabled) {
                this.removeDraggable(collection);
              } else {
                this.setDraggable(collection, index);
              }
            } else if (this.props.collection !== nextProps.collection) {
              this.removeDraggable(this.props.collection);
              this.setDraggable(nextProps.collection, nextProps.index);
            }
          },
        },
        {
          key: 'componentWillUnmount',
          value: function componentWillUnmount() {
            var _this$props2 = this.props,
              collection = _this$props2.collection,
              disabled = _this$props2.disabled;

            if (!disabled) {
              this.removeDraggable(collection);
            }
          },
        },
        {
          key: 'setDraggable',
          value: function setDraggable(collection, index) {
            var node = findDOMNode(this);
            node.sortableInfo = {
              index: index,
              collection: collection,
              manager: this.context.manager,
            };
            this.node = node;
            this.ref = {
              node: node,
            };
            this.context.manager.add(collection, this.ref);
          },
        },
        {
          key: 'removeDraggable',
          value: function removeDraggable(collection) {
            this.context.manager.remove(collection, this.ref);
          },
        },
        {
          key: 'getWrappedInstance',
          value: function getWrappedInstance() {
            invariant(
              config.withRef,
              'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call',
            );
            return this.refs.wrappedInstance;
          },
        },
        {
          key: 'render',
          value: function render() {
            var ref = config.withRef ? 'wrappedInstance' : null;
            return createElement(
              WrappedComponent,
              _extends(
                {
                  ref: ref,
                },
                omit(this.props, 'collection', 'disabled', 'index'),
              ),
            );
          },
        },
      ]);

      return WithSortableElement;
    })(Component)),
    _defineProperty(
      _class,
      'displayName',
      provideDisplayName('sortableElement', WrappedComponent),
    ),
    _defineProperty(_class, 'contextTypes', {
      manager: PropTypes.object.isRequired,
    }),
    _defineProperty(_class, 'propTypes', {
      index: PropTypes.number.isRequired,
      collection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      disabled: PropTypes.bool,
    }),
    _defineProperty(_class, 'defaultProps', {
      collection: 0,
    }),
    _temp
  );
}

function sortableHandle(WrappedComponent) {
  var _class, _temp;

  var config =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : {
          withRef: false,
        };
  return (
    (_temp = _class = (function(_React$Component) {
      _inherits(WithSortableHandle, _React$Component);

      function WithSortableHandle() {
        _classCallCheck(this, WithSortableHandle);

        return _possibleConstructorReturn(
          this,
          _getPrototypeOf(WithSortableHandle).apply(this, arguments),
        );
      }

      _createClass(WithSortableHandle, [
        {
          key: 'componentDidMount',
          value: function componentDidMount() {
            var node = findDOMNode(this);
            node.sortableHandle = true;
          },
        },
        {
          key: 'getWrappedInstance',
          value: function getWrappedInstance() {
            invariant(
              config.withRef,
              'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableHandle() call',
            );
            return this.refs.wrappedInstance;
          },
        },
        {
          key: 'render',
          value: function render() {
            var ref = config.withRef ? 'wrappedInstance' : null;
            return createElement(
              WrappedComponent,
              _extends(
                {
                  ref: ref,
                },
                this.props,
              ),
            );
          },
        },
      ]);

      return WithSortableHandle;
    })(Component)),
    _defineProperty(
      _class,
      'displayName',
      provideDisplayName('sortableHandle', WrappedComponent),
    ),
    _temp
  );
}

export {
  DragLayer,
  sortableContainer as SortableContainer,
  sortableElement as SortableElement,
  sortableHandle as SortableHandle,
  arrayMove,
  sortableContainer,
  sortableElement,
  sortableHandle,
};
