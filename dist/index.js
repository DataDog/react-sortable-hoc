function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
}

var findIndex = _interopDefault(require('lodash/findIndex'));
var isPlainObject = _interopDefault(require('lodash/isPlainObject'));
require('classlist-polyfill');
var PropTypes = _interopDefault(require('prop-types'));
var React = require('react');
var reactDom = require('react-dom');
var invariant = _interopDefault(require('invariant'));

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = (function() {
  function _Pact() {}
  _Pact.prototype.then = function(onFulfilled, onRejected) {
    const result = new _Pact();
    const state = this.s;
    if (state) {
      const callback = state & 1 ? onFulfilled : onRejected;
      if (callback) {
        try {
          _settle(result, 1, callback(this.v));
        } catch (e) {
          _settle(result, 2, e);
        }
        return result;
      } else {
        return this;
      }
    }
    this.o = function(_this) {
      try {
        const value = _this.v;
        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value);
        } else if (onRejected) {
          _settle(result, 1, onRejected(value));
        } else {
          _settle(result, 2, value);
        }
      } catch (e) {
        _settle(result, 2, e);
      }
    };
    return result;
  };
  return _Pact;
})();

// Settles a pact synchronously
function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s;
        }
        value = value.v;
      } else {
        value.o = _settle.bind(null, pact, state);
        return;
      }
    }
    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2));
      return;
    }
    pact.s = state;
    pact.v = value;
    const observer = pact.o;
    if (observer) {
      observer(pact);
    }
  }
}

// Asynchronously await a promise and pass the result to a finally continuation
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

// Sentinel value for early returns in generators
const _earlyReturn = {};

// Asynchronous generator class; accepts the entrypoint of the generator, to which it passes itself when the generator should start
const _AsyncGenerator = (function() {
  function _AsyncGenerator(entry) {
    this._entry = entry;
    this._pact = null;
    this._resolve = null;
    this._return = null;
    this._promise = null;
  }

  function _wrapReturnedValue(value) {
    return {value: value, done: true};
  }
  function _wrapYieldedValue(value) {
    return {value: value, done: false};
  }

  _AsyncGenerator.prototype[
    Symbol.asyncIterator ||
      (Symbol.asyncIterator = Symbol('Symbol.asyncIterator'))
  ] = function() {
    return this;
  };
  _AsyncGenerator.prototype._yield = function(value) {
    // Yield the value to the pending next call
    this._resolve(
      value && value.then
        ? value.then(_wrapYieldedValue)
        : _wrapYieldedValue(value),
    );
    // Return a pact for an upcoming next/return/throw call
    return (this._pact = new _Pact());
  };
  _AsyncGenerator.prototype.next = function(value) {
    // Advance the generator, starting it if it has yet to be started
    const _this = this;
    return (_this._promise = new Promise(function(resolve) {
      const _pact = _this._pact;
      if (_pact === null) {
        const _entry = _this._entry;
        if (_entry === null) {
          // Generator is started, but not awaiting a yield expression
          // Abandon the next call!
          return resolve(_this._promise);
        }
        // Start the generator
        _this._entry = null;
        _this._resolve = resolve;
        function returnValue(value) {
          _this._resolve(
            value && value.then
              ? value.then(_wrapReturnedValue)
              : _wrapReturnedValue(value),
          );
          _this._pact = null;
          _this._resolve = null;
        }
        _entry(_this).then(returnValue, function(error) {
          if (error === _earlyReturn) {
            returnValue(_this._return);
          } else {
            const pact = new _Pact();
            _this._resolve(pact);
            _this._pact = null;
            _this._resolve = null;
            _resolve(pact, 2, error);
          }
        });
      } else {
        // Generator is started and a yield expression is pending, settle it
        _this._pact = null;
        _this._resolve = resolve;
        _settle(_pact, 1, value);
      }
    }));
  };
  _AsyncGenerator.prototype.return = function(value) {
    // Early return from the generator if started, otherwise abandons the generator
    const _this = this;
    return (_this._promise = new Promise(function(resolve) {
      const _pact = _this._pact;
      if (_pact === null) {
        if (_this._entry === null) {
          // Generator is started, but not awaiting a yield expression
          // Abandon the return call!
          return resolve(_this._promise);
        }
        // Generator is not started, abandon it and return the specified value
        _this._entry = null;
        return resolve(
          value && value.then
            ? value.then(_wrapReturnedValue)
            : _wrapReturnedValue(value),
        );
      }
      // Settle the yield expression with a rejected "early return" value
      _this._return = value;
      _this._resolve = resolve;
      _this._pact = null;
      _settle(_pact, 2, _earlyReturn);
    }));
  };
  _AsyncGenerator.prototype.throw = function(error) {
    // Inject an exception into the pending yield expression
    const _this = this;
    return (_this._promise = new Promise(function(resolve, reject) {
      const _pact = _this._pact;
      if (_pact === null) {
        if (_this._entry === null) {
          // Generator is started, but not awaiting a yield expression
          // Abandon the throw call!
          return resolve(_this._promise);
        }
        // Generator is not started, abandon it and return a rejected Promise containing the error
        _this._entry = null;
        return reject(error);
      }
      // Settle the yield expression with the value as a rejection
      _this._resolve = resolve;
      _this._pact = null;
      _settle(_pact, 2, error);
    }));
  };

  return _AsyncGenerator;
})();

function arrayMove(array, from, to) {
  // Will be deprecated soon. Consumers should install 'array-move' instead
  // https://www.npmjs.com/package/array-move
  array = array.slice();
  array.splice(to < 0 ? array.length + to : to, 0, array.splice(from, 1)[0]);
  return array;
}
function omit(obj) {
  var keysToOmit = [],
    len = arguments.length - 1;
  while (len-- > 0) keysToOmit[len] = arguments[len + 1];

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
    // Server environment
    return '';
  } // fix for: https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  // window.getComputedStyle() returns null inside an iframe with display: none
  // in this case return an array with a fake mozilla style in it.

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
  return componentName ? prefix + '(' + componentName + ')' : prefix;
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
function getEdgeOffset(node, parent, offset) {
  if (offset === void 0)
    offset = {
      top: 0,
      left: 0,
    };

  if (!node) {
    return undefined;
  } // Get the actual offsetTop / offsetLeft value, no matter how deep the node is nested

  var nodeOffset = {
    top: offset.top + node.offsetTop,
    left: offset.left + node.offsetLeft,
  };

  if (node.parentNode === parent) {
    return nodeOffset;
  }

  return getEdgeOffset(node.parentNode, parent, nodeOffset);
}
function getLockPixelOffset(ref) {
  var lockOffset = ref.lockOffset;
  var width = ref.width;
  var height = ref.height;

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
  // Take account of scroll
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
  return distances.indexOf(Math.min.apply(Math, distances));
}
function getDelta(rect1, rect2) {
  return {
    x: rect1.left - rect2.left,
    y: rect1.top - rect2.top,
  };
}
function updateDistanceBetweenContainers(distance, container1, container2) {
  var x = distance.x;
  var y = distance.y;
  var delta = getDelta.apply(
    void 0,
    [container1, container2].map(function(cont) {
      return cont.container.getBoundingClientRect();
    }),
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

var DragLayer = function DragLayer() {
  var this$1 = this;

  this.helper = null;
  this.lists = [];

  this.handleSortMove = function(event) {
    // Prevent scrolling on mobile
    event.preventDefault();
    this$1.updatePosition(event);
    this$1.updateTargetContainer(event);

    if (this$1.targetList) {
      this$1.targetList.handleSortMove(event);
    }
  };

  this.handleSortEnd = function(event) {
    if (this$1.listenerNode) {
      events.move.forEach(function(eventName) {
        return this$1.listenerNode.removeEventListener(
          eventName,
          this$1.handleSortMove,
        );
      });
      events.end.forEach(function(eventName) {
        return this$1.listenerNode.removeEventListener(
          eventName,
          this$1.handleSortEnd,
        );
      });
    }

    if (typeof this$1.onDragEnd === 'function') {
      this$1.onDragEnd();
    } // Remove the helper from the DOM

    if (this$1.helper) {
      this$1.helper.parentNode.removeChild(this$1.helper);
      this$1.helper = null;
      this$1.targetList.handleSortEnd(event);
    } // Reset window scroll & container height diff

    this$1.lists.forEach(function(list) {
      delete list.initialWindowScroll;
    });
  };
};

DragLayer.prototype.addRef = function addRef(list) {
  this.lists.push(list);
};

DragLayer.prototype.removeRef = function removeRef(list) {
  var i = this.lists.indexOf(list);

  if (i !== -1) {
    this.lists.splice(i, 1);
  }
};

DragLayer.prototype.setTranslateBoundaries = function setTranslateBoundaries(
  containerBoundingRect,
  list,
) {
  var ref = list.props;
  var useWindowAsScrollContainer = ref.useWindowAsScrollContainer;
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
};

DragLayer.prototype.startDrag = function startDrag(parent, list, event) {
  var this$1 = this;

  var position = getPosition(event);
  var activeNode = list.manager.getActive();

  if (activeNode) {
    var ref = list.props;
    var axis = ref.axis;
    var getHelperDimensions = ref.getHelperDimensions;
    var node = activeNode.node;
    var collection = activeNode.collection;
    var ref$1 = node.sortableInfo;
    var index = ref$1.index;
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
    var clonedFields = [].concat(
      clonedNode.querySelectorAll('input, textarea, select, canvas'),
    );
    clonedFields.forEach(function(field, i) {
      if (field.type !== 'file' && fields[index]) {
        field.value = fields[i].value;
      }

      if (field.tagName === NodeType.Canvas) {
        var destCtx = field.getContext('2d');
        destCtx.drawImage(fields[index], 0, 0);
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
    events.move.forEach(function(eventName) {
      return this$1.listenerNode.addEventListener(
        eventName,
        this$1.handleSortMove,
        false,
      );
    });
    events.end.forEach(function(eventName) {
      return this$1.listenerNode.addEventListener(
        eventName,
        this$1.handleSortEnd,
        false,
      );
    });
    return activeNode;
  }

  return false;
};

DragLayer.prototype.stopDrag = function stopDrag() {
  this.handleSortEnd();
};

DragLayer.prototype.updatePosition = function updatePosition(event) {
  var ref = this.targetList.props;
  var lockAxis = ref.lockAxis;
  var lockToContainerEdges = ref.lockToContainerEdges;
  var offset = getPosition(event);
  var translate = {
    x: offset.x - this.initialOffset.x,
    y: offset.y - this.initialOffset.y,
  }; // Adjust for window scroll

  translate.y -= window.pageYOffset - this.targetList.initialWindowScroll.top;
  translate.x -= window.pageXOffset - this.targetList.initialWindowScroll.left;
  this.translate = translate;
  this.delta = offset;

  if (lockToContainerEdges) {
    var ref$1 = this.targetList.getLockPixelOffsets();
    var minLockOffset = ref$1[0];
    var maxLockOffset = ref$1[1];
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

  this.helper.style[vendorPrefix + 'Transform'] =
    'translate3d(' + translate.x + 'px,' + translate.y + 'px, 0)';
};

DragLayer.prototype.updateTargetContainer = function updateTargetContainer(
  event,
) {
  var ref = this.delta;
  var x = ref.x;
  var y = ref.y;
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
  var ref$1 = this.targetList.manager.active;
  var item = ref$1.item;
  this.active = item;

  if (targetList !== originList) {
    this.targetList = targetList; // Store initial scroll and dimensions of origin list, and initial
    // dimensions of target list. This is to later accommodate height changes
    // in both lists when items are added or removed during the DND operation.

    var originListInitialWindowScroll = originList.initialWindowScroll;
    var cachedOriginListRect = originList.container.getBoundingClientRect();
    var cachedTargetListRect = targetList.container.getBoundingClientRect();
    originList.handleSortEnd(event, targetList);
    this.setTranslateBoundaries(
      targetList.container.getBoundingClientRect(),
      targetList,
    );
    this.targetList.manager.active = Object.assign(
      {},
      targetList.getClosestNode(event),
      {item: item},
    );
    targetList.handlePress(event); // Override initial scroll to use scroll of origin list

    this.targetList.initialWindowScroll = originListInitialWindowScroll;
    this.distanceBetweenContainers = updateDistanceBetweenContainers(
      this.distanceBetweenContainers,
      targetList,
      originList,
    );
    var targetListRect = targetList.container.getBoundingClientRect(); // If we're moving up the container ...

    if (targetListRect.top < cachedOriginListRect.top) {
      // Calculate any height difference that has occurred on the target container during the DND
      var targetListContainerHeightDelta = Math.abs(
        cachedTargetListRect.height - targetListRect.height,
      );
      this.distanceBetweenContainers.y += targetListContainerHeightDelta;
    }
  }
};

var Manager = function Manager() {
  this.refs = {};
};

Manager.prototype.add = function add(collection, ref) {
  if (!this.refs[collection]) {
    this.refs[collection] = [];
  }

  this.refs[collection].push(ref);
};

Manager.prototype.remove = function remove(collection, ref) {
  var index = this.getIndex(collection, ref);

  if (index !== -1) {
    this.refs[collection].splice(index, 1);
  }
};

Manager.prototype.isActive = function isActive() {
  return this.active;
};

Manager.prototype.getActive = function getActive() {
  var this$1 = this;

  if (!this.active) {
    return null;
  }

  var activeRef = this.refs[this.active.collection];

  if (!activeRef) {
    return null;
  }

  return (
    activeRef.find(
      // eslint-disable-next-line eqeqeq
      function(ref) {
        var node = ref.node;

        return node.sortableInfo.index == this$1.active.index;
      },
    ) || activeRef.slice(-1).pop()
  );
};

Manager.prototype.getIndex = function getIndex(collection, ref) {
  return this.refs[collection].indexOf(ref);
};

Manager.prototype.getOrderedRefs = function getOrderedRefs(collection) {
  if (collection === void 0) collection = this.active.collection;

  return this.refs[collection].sort(sortByIndex);
};

function sortByIndex(ref, ref$1) {
  var index1 = ref.node.sortableInfo.index;
  var index2 = ref$1.node.sortableInfo.index;

  return index1 - index2;
}

function sortableContainer(WrappedComponent, config) {
  if (config === void 0)
    config = {
      withRef: false,
    };

  var _class, _temp;

  return (
    (_temp = _class = /*@__PURE__*/ (function(superclass) {
      function WithSortableContainer(props) {
        var this$1 = this;

        var _this = this;

        superclass.call(this, props);

        this.checkActiveIndex = function(nextProps) {
          var ref = nextProps || this$1.props;
          var items = ref.items;
          var ref$1 = this$1.manager.active;
          var item = ref$1.item; // If sortable item is an object, find item that match id
          // Otherwise let findIndex predicate on item

          var newIndex = isPlainObject(item)
            ? findIndex(items, function(obj) {
                return obj.id === item.id;
              })
            : findIndex(items, item);

          if (newIndex === -1) {
            this$1.dragLayer.stopDrag();
            return;
          }

          this$1.manager.active.index = newIndex;
          this$1.index = newIndex;
        };

        this.handleStart = function(event) {
          var ref = this$1.props;
          var distance = ref.distance;
          var shouldCancelStart = ref.shouldCancelStart;
          var items = ref.items;

          if (event.button === 2 || shouldCancelStart(event)) {
            return;
          }

          this$1._touched = true;
          this$1._pos = getPosition(event);
          var node = closest(event.target, function(el) {
            return el.sortableInfo != null;
          });

          if (
            node &&
            node.sortableInfo &&
            this$1.nodeIsChild(node) &&
            !this$1.sorting
          ) {
            var ref$1 = this$1.props;
            var useDragHandle = ref$1.useDragHandle;
            var ref$2 = node.sortableInfo;
            var index = ref$2.index;
            var collection = ref$2.collection;

            if (
              useDragHandle &&
              !closest(event.target, function(el) {
                return el.sortableHandle != null;
              })
            ) {
              return;
            }

            this$1.manager.active = {
              index: index,
              collection: collection,
              item: items[index],
            };
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
              if (this$1.props.pressDelay === 0) {
                this$1.handlePress(event);
              } else {
                this$1.pressTimer = setTimeout(function() {
                  return this$1.handlePress(event);
                }, this$1.props.pressDelay);
              }
            }
          }
        };

        this.nodeIsChild = function(node) {
          return node.sortableInfo.manager === this$1.manager;
        };

        this.handleMove = function(event) {
          var ref = this$1.props;
          var distance = ref.distance;
          var pressThreshold = ref.pressThreshold;

          if (
            !this$1.sorting &&
            this$1._touched &&
            !this$1._awaitingUpdateBeforeSortStart
          ) {
            var position = getPosition(event);
            var delta = {
              x: this$1._pos.x - position.x,
              y: this$1._pos.y - position.y,
            };
            var combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);
            this$1.delta = delta;

            if (
              !distance &&
              (!pressThreshold ||
                (pressThreshold && combinedDelta >= pressThreshold))
            ) {
              clearTimeout(this$1.cancelTimer);
              this$1.cancelTimer = setTimeout(this$1.cancel, 0);
            } else if (
              distance &&
              combinedDelta >= distance &&
              this$1.manager.isActive()
            ) {
              this$1.handlePress(event);
            }
          }
        };

        this.handleEnd = function() {
          this$1._touched = false;
          this$1.cancel();
        };

        this.cancel = function() {
          var ref = this$1.props;
          var distance = ref.distance;

          if (!this$1.sorting) {
            if (!distance) {
              clearTimeout(this$1.pressTimer);
            }

            this$1.manager.active = null;
          }
        };

        this.handlePress = function(event) {
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
                _this,
                event,
              );
            }

            var _temp5 = (function() {
              if (active) {
                function _temp4() {
                  var ref;

                  _this.index = index;
                  _this.newIndex = index;
                  _this.axis = {
                    x: axis.indexOf('x') >= 0,
                    y: axis.indexOf('y') >= 0,
                  };
                  _this.initialScroll = {
                    top: _this.container.scrollTop,
                    left: _this.container.scrollLeft,
                  };
                  _this.initialWindowScroll = {
                    top: window.pageYOffset,
                    left: window.pageXOffset,
                  };

                  if (hideSortableGhost) {
                    _this.sortableGhost = node;
                    node.style.visibility = 'hidden';
                    node.style.opacity = 0;
                  }

                  if (helperClass) {
                    (ref = _this.dragLayer.helper.classList).add.apply(
                      ref,
                      helperClass.split(' '),
                    );
                  }

                  _this.sorting = true;
                  _this.sortingIndex = index;

                  if (onSortStart) {
                    onSortStart(
                      {
                        node: node,
                        index: index,
                        collection: collection,
                      },
                      event,
                    );
                  }
                }

                var ref = _this.props;
                var axis = ref.axis;
                var helperClass = ref.helperClass;
                var hideSortableGhost = ref.hideSortableGhost;
                var updateBeforeSortStart = ref.updateBeforeSortStart;
                var onSortStart = ref.onSortStart;
                var node = active.node;
                var collection = active.collection;
                var ref$1 = node.sortableInfo;
                var index = ref$1.index;

                var _temp3 = (function() {
                  if (typeof updateBeforeSortStart === 'function') {
                    _this._awaitingUpdateBeforeSortStart = true;

                    var _temp2 = _finallyRethrows(
                      function() {
                        return Promise.resolve(
                          updateBeforeSortStart(
                            {
                              node: node,
                              index: index,
                              collection: collection,
                            },
                            event,
                          ),
                        ).then(function() {});
                      },
                      function(_wasThrown, _result) {
                        _this._awaitingUpdateBeforeSortStart = false;
                        if (_wasThrown) {
                          throw _result;
                        }
                        return _result;
                      },
                    );

                    if (_temp2 && _temp2.then) {
                      return _temp2.then(function() {});
                    }
                  }
                })();

                return _temp3 && _temp3.then
                  ? _temp3.then(_temp4)
                  : _temp4(_temp3);
              }
            })();

            return Promise.resolve(
              _temp5 && _temp5.then ? _temp5.then(function() {}) : void 0,
            );
          } catch (e) {
            return Promise.reject(e);
          }
        };

        this._handleSortMove = function(event) {
          // animate nodes if required
          if (this$1.checkActive(event)) {
            this$1.animateNodes();
            this$1.autoscroll();
          }

          if (window.requestAnimationFrame) {
            this$1.sortMoveAF = null;
          } else {
            // aim for 60 fps
            setTimeout(function() {
              this$1.sortMoveAF = null;
            }, 1000 / 60);
          }
        };

        this.handleSortMove = function(event) {
          var ref = this$1.props;
          var onSortMove = ref.onSortMove; // Prevent scrolling on mobile

          event.preventDefault();

          if (this$1.sortMoveAF) {
            return;
          }

          if (window.requestAnimationFrame) {
            this$1.sortMoveAF = window.requestAnimationFrame(
              this$1._handleSortMove,
            );
          } else {
            this$1.sortMoveAF = true; // call inner function now if no animation frame

            this$1._handleSortMove();
          }

          if (onSortMove) {
            onSortMove(event);
          }
        };

        this.handleSortEnd = function(event, newList) {
          if (newList === void 0) newList = null;

          var ref = this$1.props;
          var hideSortableGhost = ref.hideSortableGhost;
          var onSortEnd = ref.onSortEnd;

          if (!this$1.manager.active) {
            return;
          }

          var ref$1 = this$1.manager.active;
          var collection = ref$1.collection; // Remove the move handler if there's a frame that hasn't run yet.

          if (window.cancelAnimationFrame && this$1.sortMoveAF) {
            window.cancelAnimationFrame(this$1.sortMoveAF);
            this$1.sortMoveAF = null;
          }

          if (hideSortableGhost && this$1.sortableGhost) {
            this$1.sortableGhost.style.visibility = '';
            this$1.sortableGhost.style.opacity = '';
          }

          var nodes = this$1.manager.refs[collection];

          for (var i = 0, len = nodes.length; i < len; i++) {
            var node = nodes[i];
            var el = node.node; // Clear the cached offsetTop / offsetLeft value

            node.edgeOffset = null; // Remove the transforms / transitions

            el.style[vendorPrefix + 'Transform'] = '';
            el.style[vendorPrefix + 'TransitionDuration'] = '';
          } // Stop autoscroll

          clearInterval(this$1.autoscrollInterval);
          this$1.autoscrollInterval = null; // Update state

          this$1.manager.active = null;
          this$1.sorting = false;
          this$1.sortingIndex = null;

          if (typeof onSortEnd === 'function') {
            // get the index in the new list
            if (newList) {
              this$1.newIndex = newList.getClosestNode(event).index;
            }

            onSortEnd(
              {
                oldIndex: this$1.index,
                newIndex: this$1.newIndex,
                newList: newList,
                collection: collection,
              },
              event,
            );
          }

          this$1._touched = false;
        };

        this.handleSortSwap = function(index, item) {
          var ref = this$1.props;
          var onSortSwap = ref.onSortSwap;

          if (typeof onSortSwap === 'function') {
            onSortSwap({
              index: index,
              item: item,
            });
          }
        };

        this.getClosestNode = function(event) {
          var position = getPosition(event); // eslint-disable-next-line

          var closestNodes = []; // eslint-disable-next-line

          var closestCollections = [];
          Object.keys(this$1.manager.refs).forEach(function(collection) {
            var nodes = this$1.manager.refs[collection].map(function(ref) {
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

          var finalNodes = this$1.manager.refs[collection].map(function(ref) {
            return ref.node;
          });
          var finalIndex = finalNodes.indexOf(closestNodes[index]);
          var node = closestNodes[index];
          var rect = node.getBoundingClientRect();
          return {
            collection: collection,
            index: finalIndex + (position.y > rect.bottom ? 1 : 0),
          };
        };

        this.checkActive = function(event) {
          var active = this$1.manager.active;

          if (!active) {
            // find closest collection
            var node = closest(event.target, function(el) {
              return el.sortableInfo != null;
            });

            if (node && node.sortableInfo) {
              var pos = getPosition(event);
              var ref = node.sortableInfo;
              var collection = ref.collection;
              var nodes = this$1.manager.refs[collection].map(function(ref) {
                return ref.node;
              }); // find closest index in collection

              if (nodes) {
                var index = closestRect(pos.x, pos.y, nodes);
                this$1.manager.active = {
                  index: index,
                  collection: collection,
                  item: this$1.props.items[index],
                };
                this$1.handlePress(event);
              }
            }

            return false;
          }

          return true;
        };

        this.autoscroll = function() {
          var translate = this$1.dragLayer.translate;
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

          if (
            translate.y >=
            this$1.dragLayer.maxTranslate.y - this$1.dragLayer.height / 2
          ) {
            // Scroll Down
            direction.y = 1;
            speed.y =
              acceleration.y *
              Math.abs(
                (this$1.dragLayer.maxTranslate.y -
                  this$1.dragLayer.height / 2 -
                  translate.y) /
                  this$1.dragLayer.height,
              );
          } else if (
            translate.x >=
            this$1.dragLayer.maxTranslate.x - this$1.dragLayer.width / 2
          ) {
            // Scroll Right
            direction.x = 1;
            speed.x =
              acceleration.x *
              Math.abs(
                (this$1.dragLayer.maxTranslate.x -
                  this$1.dragLayer.width / 2 -
                  translate.x) /
                  this$1.dragLayer.width,
              );
          } else if (
            translate.y <=
            this$1.dragLayer.minTranslate.y + this$1.dragLayer.height / 2
          ) {
            // Scroll Up
            direction.y = -1;
            speed.y =
              acceleration.y *
              Math.abs(
                (translate.y -
                  this$1.dragLayer.height / 2 -
                  this$1.dragLayer.minTranslate.y) /
                  this$1.dragLayer.height,
              );
          } else if (
            translate.x <=
            this$1.dragLayer.minTranslate.x + this$1.dragLayer.width / 2
          ) {
            // Scroll Left
            direction.x = -1;
            speed.x =
              acceleration.x *
              Math.abs(
                (translate.x -
                  this$1.dragLayer.width / 2 -
                  this$1.dragLayer.minTranslate.x) /
                  this$1.dragLayer.width,
              );
          }

          if (this$1.autoscrollInterval) {
            clearInterval(this$1.autoscrollInterval);
            this$1.autoscrollInterval = null;
            this$1.isAutoScrolling = false;
          }

          if (direction.x !== 0 || direction.y !== 0) {
            this$1.autoscrollInterval = setInterval(function() {
              this$1.isAutoScrolling = true;
              var offset = {
                left: speed.x * direction.x,
                top: speed.y * direction.y,
              };
              this$1.scrollContainer.scrollTop += offset.top;
              this$1.scrollContainer.scrollLeft += offset.left;
              this$1.animateNodes();
            }, 5);
          }
        };

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

      if (superclass) WithSortableContainer.__proto__ = superclass;
      WithSortableContainer.prototype = Object.create(
        superclass && superclass.prototype,
      );
      WithSortableContainer.prototype.constructor = WithSortableContainer;

      WithSortableContainer.prototype.getChildContext = function getChildContext() {
        return {
          manager: this.manager,
        };
      };

      WithSortableContainer.prototype.componentDidMount = function componentDidMount() {
        var this$1 = this;

        var ref = this.props;
        var useWindowAsScrollContainer = ref.useWindowAsScrollContainer;
        /*
         *  Set our own default rather than using defaultProps because Jest
         *  snapshots will serialize window, causing a RangeError
         *  https://github.com/clauderic/react-sortable-hoc/issues/249
         */

        var container = this.getContainer();
        Promise.resolve(container).then(function(containerNode) {
          this$1.container = containerNode;
          this$1.document = this$1.container.ownerDocument || document;
          var contentWindow =
            this$1.props.contentWindow || this$1.document.defaultView || window;
          this$1.contentWindow =
            typeof contentWindow === 'function'
              ? contentWindow()
              : contentWindow;
          this$1.scrollContainer = useWindowAsScrollContainer
            ? this$1.document.scrollingElement ||
              this$1.document.documentElement
            : this$1.container;
          this$1.initialScroll = {
            top: this$1.scrollContainer.scrollTop,
            left: this$1.scrollContainer.scrollLeft,
          };

          var loop = function(key) {
            if (this$1.events.hasOwnProperty(key)) {
              events[key].forEach(function(eventName) {
                return this$1.container.addEventListener(
                  eventName,
                  this$1.events[key],
                  false,
                );
              });
            }
          };

          for (var key in this$1.events) loop(key);
        });
      };

      WithSortableContainer.prototype.componentWillUnmount = function componentWillUnmount() {
        var this$1 = this;

        this.dragLayer.removeRef(this);

        if (this.container) {
          var loop = function(key) {
            if (this$1.events.hasOwnProperty(key)) {
              events[key].forEach(function(eventName) {
                return this$1.container.removeEventListener(
                  eventName,
                  this$1.events[key],
                );
              });
            }
          };

          for (var key in this$1.events) loop(key);
        }
      };

      WithSortableContainer.prototype.componentWillReceiveProps = function componentWillReceiveProps(
        nextProps,
      ) {
        var ref = this.manager;
        var active = ref.active;

        if (!active) {
          return;
        }

        this.checkActiveIndex(nextProps);
      };

      WithSortableContainer.prototype.getLockPixelOffsets = function getLockPixelOffsets() {
        var ref = this.dragLayer;
        var width = ref.width;
        var height = ref.height;
        var ref$1 = this.props;
        var lockOffset = ref$1.lockOffset;
        var offsets = Array.isArray(lockOffset)
          ? lockOffset
          : [lockOffset, lockOffset];
        invariant(
          offsets.length === 2,
          'lockOffset prop of SortableContainer should be a single ' +
            'value or an array of exactly two values. Given %s',
          lockOffset,
        );
        var minLockOffset = offsets[0];
        var maxLockOffset = offsets[1];
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
      };

      WithSortableContainer.prototype.animateNodes = function animateNodes() {
        if (!this.axis) {
          return;
        }

        var ref = this.props;
        var transitionDuration = ref.transitionDuration;
        var hideSortableGhost = ref.hideSortableGhost;
        var onSortOver = ref.onSortOver;
        var animateNodes = ref.animateNodes;
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
          var ref$1 = nodes[i];
          var node = ref$1.node;
          var index = node.sortableInfo.index;
          var width = node.offsetWidth;
          var height = node.offsetHeight;
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
          var ref$2 = nodes[i];
          var edgeOffset = ref$2.edgeOffset; // If we haven't cached the node's offsetTop / offsetLeft value

          if (!edgeOffset) {
            edgeOffset = getEdgeOffset(node, this.container);
            nodes[i].edgeOffset = edgeOffset;
          } // Get a reference to the next and previous node

          var nextNode = i < nodes.length - 1 && nodes[i + 1];
          var prevNode = i > 0 && nodes[i - 1]; // Also cache the next node's edge offset if needed.
          // We need this for calculating the animation in a grid setup

          if (nextNode && !nextNode.edgeOffset) {
            nextNode.edgeOffset = getEdgeOffset(nextNode.node, this.container);
          } // If the node is the one we're currently animating, skip it

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
            node.style[vendorPrefix + 'TransitionDuration'] =
              transitionDuration + 'ms';
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
              translate.y =
                this.dragLayer.height + this.dragLayer.marginOffset.y;

              if (this.newIndex == null) {
                this.newIndex = index;
              }
            }
          } // Translate the position of the given node

          if (animateNodes) {
            node.style[vendorPrefix + 'Transform'] =
              'translate3d(' + translate.x + 'px,' + translate.y + 'px,0)';
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
      };

      WithSortableContainer.prototype.getWrappedInstance = function getWrappedInstance() {
        invariant(
          config.withRef,
          'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableContainer() call',
        );
        return this.refs.wrappedInstance;
      };

      WithSortableContainer.prototype.getContainer = function getContainer() {
        var ref = this.props;
        var getContainer = ref.getContainer;

        if (typeof getContainer !== 'function') {
          return reactDom.findDOMNode(this);
        }

        return getContainer(
          config.withRef ? this.getWrappedInstance() : undefined,
        );
      };

      WithSortableContainer.prototype.render = function render() {
        var ref = config.withRef ? 'wrappedInstance' : null;
        return React.createElement(
          WrappedComponent,
          Object.assign(
            {},
            {ref: ref},
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
            ),
          ),
        );
      };

      return WithSortableContainer;
    })(React.Component)),
    (_class.displayName = provideDisplayName('sortableList', WrappedComponent)),
    (_class.defaultProps = {
      axis: 'y',
      transitionDuration: 300,
      pressDelay: 0,
      pressThreshold: 5,
      distance: 0,
      useWindowAsScrollContainer: false,
      hideSortableGhost: true,
      animateNodes: true,

      shouldCancelStart: function shouldCancelStart(event) {
        // Cancel sorting if the event target is an `input`, `textarea`, `select` or `option`
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
          // Return true to cancel sorting
          return true;
        }

        return false;
      },

      lockToContainerEdges: false,
      lockOffset: '50%',
      getHelperDimensions: function(ref) {
        var node = ref.node;

        return {
          width: node.offsetWidth,
          height: node.offsetHeight,
        };
      },
    }),
    (_class.propTypes = {
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
    }),
    (_class.childContextTypes = {
      manager: PropTypes.object.isRequired,
    }),
    _temp
  );
}

function sortableElement(WrappedComponent, config) {
  if (config === void 0)
    config = {
      withRef: false,
    };

  var _class, _temp;

  return (
    (_temp = _class = /*@__PURE__*/ (function(superclass) {
      function WithSortableElement() {
        superclass.apply(this, arguments);
      }

      if (superclass) WithSortableElement.__proto__ = superclass;
      WithSortableElement.prototype = Object.create(
        superclass && superclass.prototype,
      );
      WithSortableElement.prototype.constructor = WithSortableElement;

      WithSortableElement.prototype.componentDidMount = function componentDidMount() {
        var ref = this.props;
        var collection = ref.collection;
        var disabled = ref.disabled;
        var index = ref.index;

        if (!disabled) {
          this.setDraggable(collection, index);
        }
      };

      WithSortableElement.prototype.componentWillReceiveProps = function componentWillReceiveProps(
        nextProps,
      ) {
        if (this.props.index !== nextProps.index && this.node) {
          this.node.sortableInfo.index = nextProps.index;
        }

        if (this.props.disabled !== nextProps.disabled) {
          var collection = nextProps.collection;
          var disabled = nextProps.disabled;
          var index = nextProps.index;

          if (disabled) {
            this.removeDraggable(collection);
          } else {
            this.setDraggable(collection, index);
          }
        } else if (this.props.collection !== nextProps.collection) {
          this.removeDraggable(this.props.collection);
          this.setDraggable(nextProps.collection, nextProps.index);
        }
      };

      WithSortableElement.prototype.componentWillUnmount = function componentWillUnmount() {
        var ref = this.props;
        var collection = ref.collection;
        var disabled = ref.disabled;

        if (!disabled) {
          this.removeDraggable(collection);
        }
      };

      WithSortableElement.prototype.setDraggable = function setDraggable(
        collection,
        index,
      ) {
        var node = reactDom.findDOMNode(this);
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
      };

      WithSortableElement.prototype.removeDraggable = function removeDraggable(
        collection,
      ) {
        this.context.manager.remove(collection, this.ref);
      };

      WithSortableElement.prototype.getWrappedInstance = function getWrappedInstance() {
        invariant(
          config.withRef,
          'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableElement() call',
        );
        return this.refs.wrappedInstance;
      };

      WithSortableElement.prototype.render = function render() {
        var ref = config.withRef ? 'wrappedInstance' : null;
        return React.createElement(
          WrappedComponent,
          Object.assign(
            {},
            {ref: ref},
            omit(this.props, 'collection', 'disabled', 'index'),
          ),
        );
      };

      return WithSortableElement;
    })(React.Component)),
    (_class.displayName = provideDisplayName(
      'sortableElement',
      WrappedComponent,
    )),
    (_class.contextTypes = {
      manager: PropTypes.object.isRequired,
    }),
    (_class.propTypes = {
      index: PropTypes.number.isRequired,
      collection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      disabled: PropTypes.bool,
    }),
    (_class.defaultProps = {
      collection: 0,
    }),
    _temp
  );
}

function sortableHandle(WrappedComponent, config) {
  if (config === void 0)
    config = {
      withRef: false,
    };

  var _class, _temp;

  return (
    (_temp = _class = /*@__PURE__*/ (function(superclass) {
      function WithSortableHandle() {
        superclass.apply(this, arguments);
      }

      if (superclass) WithSortableHandle.__proto__ = superclass;
      WithSortableHandle.prototype = Object.create(
        superclass && superclass.prototype,
      );
      WithSortableHandle.prototype.constructor = WithSortableHandle;

      WithSortableHandle.prototype.componentDidMount = function componentDidMount() {
        var node = reactDom.findDOMNode(this);
        node.sortableHandle = true;
      };

      WithSortableHandle.prototype.getWrappedInstance = function getWrappedInstance() {
        invariant(
          config.withRef,
          'To access the wrapped instance, you need to pass in {withRef: true} as the second argument of the SortableHandle() call',
        );
        return this.refs.wrappedInstance;
      };

      WithSortableHandle.prototype.render = function render() {
        var ref = config.withRef ? 'wrappedInstance' : null;
        return React.createElement(
          WrappedComponent,
          Object.assign({}, {ref: ref}, this.props),
        );
      };

      return WithSortableHandle;
    })(React.Component)),
    (_class.displayName = provideDisplayName(
      'sortableHandle',
      WrappedComponent,
    )),
    _temp
  );
}

exports.SortableContainer = sortableContainer;
exports.SortableElement = sortableElement;
exports.SortableHandle = sortableHandle;
exports.sortableContainer = sortableContainer;
exports.sortableElement = sortableElement;
exports.sortableHandle = sortableHandle;
exports.arrayMove = arrayMove;
exports.DragLayer = DragLayer;
//# sourceMappingURL=index.js.map
