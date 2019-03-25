(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? factory(
        exports,
        require('react'),
        require('prop-types'),
        require('react-dom'),
      )
    : typeof define === 'function' && define.amd
    ? define(['exports', 'react', 'prop-types', 'react-dom'], factory)
    : ((global = global || self),
      factory(
        (global.SortableHOC = {}),
        global.React,
        global.PropTypes,
        global.ReactDOM,
      ));
})(this, function(exports, React, PropTypes, reactDom) {
  'use strict';

  PropTypes =
    PropTypes && PropTypes.hasOwnProperty('default')
      ? PropTypes['default']
      : PropTypes;

  var commonjsGlobal =
    typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : typeof self !== 'undefined'
      ? self
      : {};

  function createCommonjsModule(fn, module) {
    return (module = {exports: {}}), fn(module, module.exports), module.exports;
  }

  var _extends_1 = createCommonjsModule(function(module) {
    function _extends() {
      module.exports = _extends =
        Object.assign ||
        function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }

          return target;
        };

      return _extends.apply(this, arguments);
    }

    module.exports = _extends;
  });

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    }
  }

  var arrayWithoutHoles = _arrayWithoutHoles;

  function _iterableToArray(iter) {
    if (
      Symbol.iterator in Object(iter) ||
      Object.prototype.toString.call(iter) === '[object Arguments]'
    )
      return Array.from(iter);
  }

  var iterableToArray = _iterableToArray;

  function _nonIterableSpread() {
    throw new TypeError('Invalid attempt to spread non-iterable instance');
  }

  var nonIterableSpread = _nonIterableSpread;

  function _toConsumableArray(arr) {
    return (
      arrayWithoutHoles(arr) || iterableToArray(arr) || nonIterableSpread()
    );
  }

  var toConsumableArray = _toConsumableArray;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError('Cannot call a class as a function');
    }
  }

  var classCallCheck = _classCallCheck;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ('value' in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var createClass = _createClass;

  var _typeof_1 = createCommonjsModule(function(module) {
    function _typeof2(obj) {
      if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
        _typeof2 = function _typeof2(obj) {
          return typeof obj;
        };
      } else {
        _typeof2 = function _typeof2(obj) {
          return obj &&
            typeof Symbol === 'function' &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? 'symbol'
            : typeof obj;
        };
      }
      return _typeof2(obj);
    }

    function _typeof(obj) {
      if (
        typeof Symbol === 'function' &&
        _typeof2(Symbol.iterator) === 'symbol'
      ) {
        module.exports = _typeof = function _typeof(obj) {
          return _typeof2(obj);
        };
      } else {
        module.exports = _typeof = function _typeof(obj) {
          return obj &&
            typeof Symbol === 'function' &&
            obj.constructor === Symbol &&
            obj !== Symbol.prototype
            ? 'symbol'
            : _typeof2(obj);
        };
      }

      return _typeof(obj);
    }

    module.exports = _typeof;
  });

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError(
        "this hasn't been initialised - super() hasn't been called",
      );
    }

    return self;
  }

  var assertThisInitialized = _assertThisInitialized;

  function _possibleConstructorReturn(self, call) {
    if (call && (_typeof_1(call) === 'object' || typeof call === 'function')) {
      return call;
    }

    return assertThisInitialized(self);
  }

  var possibleConstructorReturn = _possibleConstructorReturn;

  var getPrototypeOf = createCommonjsModule(function(module) {
    function _getPrototypeOf(o) {
      module.exports = _getPrototypeOf = Object.setPrototypeOf
        ? Object.getPrototypeOf
        : function _getPrototypeOf(o) {
            return o.__proto__ || Object.getPrototypeOf(o);
          };
      return _getPrototypeOf(o);
    }

    module.exports = _getPrototypeOf;
  });

  var setPrototypeOf = createCommonjsModule(function(module) {
    function _setPrototypeOf(o, p) {
      module.exports = _setPrototypeOf =
        Object.setPrototypeOf ||
        function _setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
        };

      return _setPrototypeOf(o, p);
    }

    module.exports = _setPrototypeOf;
  });

  function _inherits(subClass, superClass) {
    if (typeof superClass !== 'function' && superClass !== null) {
      throw new TypeError('Super expression must either be null or a function');
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true,
      },
    });
    if (superClass) setPrototypeOf(subClass, superClass);
  }

  var inherits = _inherits;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true,
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var defineProperty = _defineProperty;

  /**
   * Copyright (c) 2013-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */

  var invariant = function(condition, format, a, b, c, d, e, f) {
    {
      if (format === undefined) {
        throw new Error('invariant requires an error message argument');
      }
    }

    if (!condition) {
      var error;
      if (format === undefined) {
        error = new Error(
          'Minified exception occurred; use the non-minified dev environment ' +
            'for the full error message and additional helpful warnings.',
        );
      } else {
        var args = [a, b, c, d, e, f];
        var argIndex = 0;
        error = new Error(
          format.replace(/%s/g, function() {
            return args[argIndex++];
          }),
        );
        error.name = 'Invariant Violation';
      }

      error.framesToPop = 1; // we don't care about invariant's own frame
      throw error;
    }
  };

  var invariant_1 = invariant;

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

    while (fromRight ? index-- : ++index < length) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  var _baseFindIndex = baseFindIndex;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_1(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var _assocIndexOf = assocIndexOf;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
      index = _assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
      index = _assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return _assocIndexOf(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas;

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
      index = _assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  var _listCacheSet = listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
      length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = _listCacheClear;
  ListCache.prototype['delete'] = _listCacheDelete;
  ListCache.prototype.get = _listCacheGet;
  ListCache.prototype.has = _listCacheHas;
  ListCache.prototype.set = _listCacheSet;

  var _ListCache = ListCache;

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new _ListCache();
    this.size = 0;
  }

  var _stackClear = stackClear;

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
      result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  var _stackDelete = stackDelete;

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  var _stackGet = stackGet;

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  var _stackHas = stackHas;

  /** Detect free variable `global` from Node.js. */
  var freeGlobal =
    typeof commonjsGlobal == 'object' &&
    commonjsGlobal &&
    commonjsGlobal.Object === Object &&
    commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf =
    typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return symToStringTag$1 && symToStringTag$1 in Object(value)
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject_1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = _baseGetTag(value);
    return (
      tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag
    );
  }

  var isFunction_1 = isFunction;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = _root['__core-js_shared__'];

  var _coreJsData = coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(
      (_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO) || '',
    );
    return uid ? 'Symbol(src)_1.' + uid : '';
  })();

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && maskSrcKey in func;
  }

  var _isMasked = isMasked;

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return func + '';
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
    objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp(
    '^' +
      funcToString$1
        .call(hasOwnProperty$1)
        .replace(reRegExpChar, '\\$&')
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
          '$1.*?',
        ) +
      '$',
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject_1(value) || _isMasked(value)) {
      return false;
    }
    var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
  }

  var _baseIsNative = baseIsNative;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  /* Built-in method references that are verified to be native. */
  var Map = _getNative(_root, 'Map');

  var _Map = Map;

  /* Built-in method references that are verified to be native. */
  var nativeCreate = _getNative(Object, 'create');

  var _nativeCreate = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear;

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (_nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return _nativeCreate
      ? data[key] !== undefined
      : hasOwnProperty$3.call(data, key);
  }

  var _hashHas = hashHas;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = _nativeCreate && value === undefined ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
      length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = _hashClear;
  Hash.prototype['delete'] = _hashDelete;
  Hash.prototype.get = _hashGet;
  Hash.prototype.has = _hashHas;
  Hash.prototype.set = _hashSet;

  var _Hash = Hash;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      hash: new _Hash(),
      map: new (_Map || _ListCache)(),
      string: new _Hash(),
    };
  }

  var _mapCacheClear = mapCacheClear;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return type == 'string' ||
      type == 'number' ||
      type == 'symbol' ||
      type == 'boolean'
      ? value !== '__proto__'
      : value === null;
  }

  var _isKeyable = isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return _isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  var _getMapData = getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return _getMapData(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return _getMapData(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas;

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = _getMapData(this, key),
      size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
      length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = _mapCacheClear;
  MapCache.prototype['delete'] = _mapCacheDelete;
  MapCache.prototype.get = _mapCacheGet;
  MapCache.prototype.has = _mapCacheHas;
  MapCache.prototype.set = _mapCacheSet;

  var _MapCache = MapCache;

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof _ListCache) {
      var pairs = data.__data__;
      if (!_Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new _MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  var _stackSet = stackSet;

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = (this.__data__ = new _ListCache(entries));
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = _stackClear;
  Stack.prototype['delete'] = _stackDelete;
  Stack.prototype.get = _stackGet;
  Stack.prototype.has = _stackHas;
  Stack.prototype.set = _stackSet;

  var _Stack = Stack;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED$2);
    return this;
  }

  var _setCacheAdd = setCacheAdd;

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  var _setCacheHas = setCacheHas;

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
      length = values == null ? 0 : values.length;

    this.__data__ = new _MapCache();
    while (++index < length) {
      this.add(values[index]);
    }
  }

  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = _setCacheAdd;
  SetCache.prototype.has = _setCacheHas;

  var _SetCache = SetCache;

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
      length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  var _arraySome = arraySome;

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  var _cacheHas = cacheHas;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
    COMPARE_UNORDERED_FLAG = 2;

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
      arrLength = array.length,
      othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1,
      result = true,
      seen = bitmask & COMPARE_UNORDERED_FLAG ? new _SetCache() : undefined;

    stack.set(array, other);
    stack.set(other, array);

    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
        othValue = other[index];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, arrValue, index, other, array, stack)
          : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (seen) {
        if (
          !_arraySome(other, function(othValue, othIndex) {
            if (
              !_cacheHas(seen, othIndex) &&
              (arrValue === othValue ||
                equalFunc(arrValue, othValue, bitmask, customizer, stack))
            ) {
              return seen.push(othIndex);
            }
          })
        ) {
          result = false;
          break;
        }
      } else if (
        !(
          arrValue === othValue ||
          equalFunc(arrValue, othValue, bitmask, customizer, stack)
        )
      ) {
        result = false;
        break;
      }
    }
    stack['delete'](array);
    stack['delete'](other);
    return result;
  }

  var _equalArrays = equalArrays;

  /** Built-in value references. */
  var Uint8Array = _root.Uint8Array;

  var _Uint8Array = Uint8Array;

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
      result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  var _mapToArray = mapToArray;

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
      result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  var _setToArray = setToArray;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$1 = 1,
    COMPARE_UNORDERED_FLAG$1 = 2;

  /** `Object#toString` result references. */
  var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

  var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(
    object,
    other,
    tag,
    bitmask,
    customizer,
    equalFunc,
    stack,
  ) {
    switch (tag) {
      case dataViewTag:
        if (
          object.byteLength != other.byteLength ||
          object.byteOffset != other.byteOffset
        ) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag:
        if (
          object.byteLength != other.byteLength ||
          !equalFunc(new _Uint8Array(object), new _Uint8Array(other))
        ) {
          return false;
        }
        return true;

      case boolTag:
      case dateTag:
      case numberTag:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq_1(+object, +other);

      case errorTag:
        return object.name == other.name && object.message == other.message;

      case regexpTag:
      case stringTag:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == other + '';

      case mapTag:
        var convert = _mapToArray;

      case setTag:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
        convert || (convert = _setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$1;

        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other);
        var result = _equalArrays(
          convert(object),
          convert(other),
          bitmask,
          customizer,
          equalFunc,
          stack,
        );
        stack['delete'](object);
        return result;

      case symbolTag:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }

  var _equalByTag = equalByTag;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
      length = values.length,
      offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  var _arrayPush = arrayPush;

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  var isArray_1 = isArray;

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray_1(object) ? result : _arrayPush(result, symbolsFunc(object));
  }

  var _baseGetAllKeys = baseGetAllKeys;

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
      length = array == null ? 0 : array.length,
      resIndex = 0,
      result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  var _arrayFilter = arrayFilter;

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  var stubArray_1 = stubArray;

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols
    ? stubArray_1
    : function(object) {
        if (object == null) {
          return [];
        }
        object = Object(object);
        return _arrayFilter(nativeGetSymbols(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };

  var _getSymbols = getSymbols;

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
      result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  var _baseTimes = baseTimes;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$6.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = _baseIsArguments(
    (function() {
      return arguments;
    })(),
  )
    ? _baseIsArguments
    : function(value) {
        return (
          isObjectLike_1(value) &&
          hasOwnProperty$4.call(value, 'callee') &&
          !propertyIsEnumerable$1.call(value, 'callee')
        );
      };

  var isArguments_1 = isArguments;

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  var stubFalse_1 = stubFalse;

  var isBuffer_1 = createCommonjsModule(function(module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule =
      freeExports &&
      'object' == 'object' &&
      module &&
      !module.nodeType &&
      module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Built-in value references. */
    var Buffer = moduleExports ? _root.Buffer : undefined;

    /* Built-in method references for those with the same name as other `lodash` methods. */
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

    /**
     * Checks if `value` is a buffer.
     *
     * @static
     * @memberOf _
     * @since 4.3.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
     * @example
     *
     * _.isBuffer(new Buffer(2));
     * // => true
     *
     * _.isBuffer(new Uint8Array(2));
     * // => false
     */
    var isBuffer = nativeIsBuffer || stubFalse_1;

    module.exports = isBuffer;
  });

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return (
      !!length &&
      (type == 'number' || (type != 'symbol' && reIsUint.test(value))) &&
      (value > -1 && value % 1 == 0 && value < length)
    );
  }

  var _isIndex = isIndex;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return (
      typeof value == 'number' &&
      value > -1 &&
      value % 1 == 0 &&
      value <= MAX_SAFE_INTEGER$1
    );
  }

  var isLength_1 = isLength;

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag$1 = '[object Boolean]',
    dateTag$1 = '[object Date]',
    errorTag$1 = '[object Error]',
    funcTag$1 = '[object Function]',
    mapTag$1 = '[object Map]',
    numberTag$1 = '[object Number]',
    objectTag = '[object Object]',
    regexpTag$1 = '[object RegExp]',
    setTag$1 = '[object Set]',
    stringTag$1 = '[object String]',
    weakMapTag = '[object WeakMap]';

  var arrayBufferTag$1 = '[object ArrayBuffer]',
    dataViewTag$1 = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[
    int8Tag
  ] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[
    uint8Tag
  ] = typedArrayTags[uint8ClampedTag] = typedArrayTags[
    uint16Tag
  ] = typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] = typedArrayTags[
    arrayBufferTag$1
  ] = typedArrayTags[boolTag$1] = typedArrayTags[
    dataViewTag$1
  ] = typedArrayTags[dateTag$1] = typedArrayTags[errorTag$1] = typedArrayTags[
    funcTag$1
  ] = typedArrayTags[mapTag$1] = typedArrayTags[numberTag$1] = typedArrayTags[
    objectTag
  ] = typedArrayTags[regexpTag$1] = typedArrayTags[setTag$1] = typedArrayTags[
    stringTag$1
  ] = typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return (
      isObjectLike_1(value) &&
      isLength_1(value.length) &&
      !!typedArrayTags[_baseGetTag(value)]
    );
  }

  var _baseIsTypedArray = baseIsTypedArray;

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  var _baseUnary = baseUnary;

  var _nodeUtil = createCommonjsModule(function(module, exports) {
    /** Detect free variable `exports`. */
    var freeExports = exports && !exports.nodeType && exports;

    /** Detect free variable `module`. */
    var freeModule =
      freeExports &&
      'object' == 'object' &&
      module &&
      !module.nodeType &&
      module;

    /** Detect the popular CommonJS extension `module.exports`. */
    var moduleExports = freeModule && freeModule.exports === freeExports;

    /** Detect free variable `process` from Node.js. */
    var freeProcess = moduleExports && _freeGlobal.process;

    /** Used to access faster Node.js helpers. */
    var nodeUtil = (function() {
      try {
        // Use `util.types` for Node.js 10+.
        var types =
          freeModule && freeModule.require && freeModule.require('util').types;

        if (types) {
          return types;
        }

        // Legacy `process.binding('util')` for Node.js < 10.
        return (
          freeProcess && freeProcess.binding && freeProcess.binding('util')
        );
      } catch (e) {}
    })();

    module.exports = nodeUtil;
  });

  /* Node.js helper references. */
  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray
    ? _baseUnary(nodeIsTypedArray)
    : _baseIsTypedArray;

  var isTypedArray_1 = isTypedArray;

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray_1(value),
      isArg = !isArr && isArguments_1(value),
      isBuff = !isArr && !isArg && isBuffer_1(value),
      isType = !isArr && !isArg && !isBuff && isTypedArray_1(value),
      skipIndexes = isArr || isArg || isBuff || isType,
      result = skipIndexes ? _baseTimes(value.length, String) : [],
      length = result.length;

    for (var key in value) {
      if (
        (inherited || hasOwnProperty$5.call(value, key)) &&
        !(
          skipIndexes &&
          // Safari 9 has enumerable `arguments.length` in strict mode.
          (key == 'length' ||
            // Node.js 0.10 has enumerable non-index properties on buffers.
            (isBuff && (key == 'offset' || key == 'parent')) ||
            // PhantomJS 2 has enumerable non-index properties on typed arrays.
            (isType &&
              (key == 'buffer' ||
                key == 'byteLength' ||
                key == 'byteOffset')) ||
            // Skip index properties.
            _isIndex(key, length))
        )
      ) {
        result.push(key);
      }
    }
    return result;
  }

  var _arrayLikeKeys = arrayLikeKeys;

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$8;

    return value === proto;
  }

  var _isPrototype = isPrototype;

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  var _overArg = overArg;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = _overArg(Object.keys, Object);

  var _nativeKeys = nativeKeys;

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$9.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!_isPrototype(object)) {
      return _nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$6.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  var _baseKeys = baseKeys;

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength_1(value.length) && !isFunction_1(value);
  }

  var isArrayLike_1 = isArrayLike;

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike_1(object) ? _arrayLikeKeys(object) : _baseKeys(object);
  }

  var keys_1 = keys;

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return _baseGetAllKeys(object, keys_1, _getSymbols);
  }

  var _getAllKeys = getAllKeys;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$2 = 1;

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
      objProps = _getAllKeys(object),
      objLength = objProps.length,
      othProps = _getAllKeys(other),
      othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
        return false;
      }
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);

    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
        othValue = other[key];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, objValue, key, other, object, stack)
          : customizer(objValue, othValue, key, object, other, stack);
      }
      // Recursively compare objects (susceptible to call stack limits).
      if (
        !(compared === undefined
          ? objValue === othValue ||
            equalFunc(objValue, othValue, bitmask, customizer, stack)
          : compared)
      ) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor,
        othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (
        objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(
          typeof objCtor == 'function' &&
          objCtor instanceof objCtor &&
          typeof othCtor == 'function' &&
          othCtor instanceof othCtor
        )
      ) {
        result = false;
      }
    }
    stack['delete'](object);
    stack['delete'](other);
    return result;
  }

  var _equalObjects = equalObjects;

  /* Built-in method references that are verified to be native. */
  var DataView = _getNative(_root, 'DataView');

  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */
  var Promise$1 = _getNative(_root, 'Promise');

  var _Promise = Promise$1;

  /* Built-in method references that are verified to be native. */
  var Set = _getNative(_root, 'Set');

  var _Set = Set;

  /* Built-in method references that are verified to be native. */
  var WeakMap = _getNative(_root, 'WeakMap');

  var _WeakMap = WeakMap;

  /** `Object#toString` result references. */
  var mapTag$2 = '[object Map]',
    objectTag$1 = '[object Object]',
    promiseTag = '[object Promise]',
    setTag$2 = '[object Set]',
    weakMapTag$1 = '[object WeakMap]';

  var dataViewTag$2 = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = _toSource(_DataView),
    mapCtorString = _toSource(_Map),
    promiseCtorString = _toSource(_Promise),
    setCtorString = _toSource(_Set),
    weakMapCtorString = _toSource(_WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = _baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if (
    (_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag$2) ||
    (_Map && getTag(new _Map()) != mapTag$2) ||
    (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
    (_Set && getTag(new _Set()) != setTag$2) ||
    (_WeakMap && getTag(new _WeakMap()) != weakMapTag$1)
  ) {
    getTag = function(value) {
      var result = _baseGetTag(value),
        Ctor = result == objectTag$1 ? value.constructor : undefined,
        ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString:
            return dataViewTag$2;
          case mapCtorString:
            return mapTag$2;
          case promiseCtorString:
            return promiseTag;
          case setCtorString:
            return setTag$2;
          case weakMapCtorString:
            return weakMapTag$1;
        }
      }
      return result;
    };
  }

  var _getTag = getTag;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$3 = 1;

  /** `Object#toString` result references. */
  var argsTag$2 = '[object Arguments]',
    arrayTag$1 = '[object Array]',
    objectTag$2 = '[object Object]';

  /** Used for built-in method references. */
  var objectProto$b = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(
    object,
    other,
    bitmask,
    customizer,
    equalFunc,
    stack,
  ) {
    var objIsArr = isArray_1(object),
      othIsArr = isArray_1(other),
      objTag = objIsArr ? arrayTag$1 : _getTag(object),
      othTag = othIsArr ? arrayTag$1 : _getTag(other);

    objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
    othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

    var objIsObj = objTag == objectTag$2,
      othIsObj = othTag == objectTag$2,
      isSameTag = objTag == othTag;

    if (isSameTag && isBuffer_1(object)) {
      if (!isBuffer_1(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new _Stack());
      return objIsArr || isTypedArray_1(object)
        ? _equalArrays(object, other, bitmask, customizer, equalFunc, stack)
        : _equalByTag(
            object,
            other,
            objTag,
            bitmask,
            customizer,
            equalFunc,
            stack,
          );
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
      var objIsWrapped =
          objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

        stack || (stack = new _Stack());
        return equalFunc(
          objUnwrapped,
          othUnwrapped,
          bitmask,
          customizer,
          stack,
        );
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new _Stack());
    return _equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  var _baseIsEqualDeep = baseIsEqualDeep;

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (
      value == null ||
      other == null ||
      (!isObjectLike_1(value) && !isObjectLike_1(other))
    ) {
      return value !== value && other !== other;
    }
    return _baseIsEqualDeep(
      value,
      other,
      bitmask,
      customizer,
      baseIsEqual,
      stack,
    );
  }

  var _baseIsEqual = baseIsEqual;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$4 = 1,
    COMPARE_UNORDERED_FLAG$2 = 2;

  /**
   * The base implementation of `_.isMatch` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Array} matchData The property names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if (
        noCustomizer && data[2]
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
      ) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
        objValue = object[key],
        srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new _Stack();
        if (customizer) {
          var result = customizer(
            objValue,
            srcValue,
            key,
            object,
            source,
            stack,
          );
        }
        if (
          !(result === undefined
            ? _baseIsEqual(
                srcValue,
                objValue,
                COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2,
                customizer,
                stack,
              )
            : result)
        ) {
          return false;
        }
      }
    }
    return true;
  }

  var _baseIsMatch = baseIsMatch;

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject_1(value);
  }

  var _isStrictComparable = isStrictComparable;

  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = keys_1(object),
      length = result.length;

    while (length--) {
      var key = result[length],
        value = object[key];

      result[length] = [key, value, _isStrictComparable(value)];
    }
    return result;
  }

  var _getMatchData = getMatchData;

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return (
        object[key] === srcValue &&
        (srcValue !== undefined || key in Object(object))
      );
    };
  }

  var _matchesStrictComparable = matchesStrictComparable;

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var matchData = _getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return _matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || _baseIsMatch(object, source, matchData);
    };
  }

  var _baseMatches = baseMatches;

  /** `Object#toString` result references. */
  var symbolTag$1 = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return (
      typeof value == 'symbol' ||
      (isObjectLike_1(value) && _baseGetTag(value) == symbolTag$1)
    );
  }

  var isSymbol_1 = isSymbol;

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray_1(value)) {
      return false;
    }
    var type = typeof value;
    if (
      type == 'number' ||
      type == 'symbol' ||
      type == 'boolean' ||
      value == null ||
      isSymbol_1(value)
    ) {
      return true;
    }
    return (
      reIsPlainProp.test(value) ||
      !reIsDeepProp.test(value) ||
      (object != null && value in Object(object))
    );
  }

  var _isKey = isKey;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (
      typeof func != 'function' ||
      (resolver != null && typeof resolver != 'function')
    ) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || _MapCache)();
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = _MapCache;

  var memoize_1 = memoize;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize_1(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  var _memoizeCapped = memoizeCapped;

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = _memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(
        quote ? subString.replace(reEscapeChar, '$1') : number || match,
      );
    });
    return result;
  });

  var _stringToPath = stringToPath;

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  var _arrayMap = arrayMap;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
    symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray_1(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return _arrayMap(value, baseToString) + '';
    }
    if (isSymbol_1(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY ? '-0' : result;
  }

  var _baseToString = baseToString;

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : _baseToString(value);
  }

  var toString_1 = toString;

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if (isArray_1(value)) {
      return value;
    }
    return _isKey(value, object) ? [value] : _stringToPath(toString_1(value));
  }

  var _castPath = castPath;

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol_1(value)) {
      return value;
    }
    var result = value + '';
    return result == '0' && 1 / value == -INFINITY$1 ? '-0' : result;
  }

  var _toKey = toKey;

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = _castPath(path, object);

    var index = 0,
      length = path.length;

    while (object != null && index < length) {
      object = object[_toKey(path[index++])];
    }
    return index && index == length ? object : undefined;
  }

  var _baseGet = baseGet;

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : _baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  var get_1 = get;

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  var _baseHasIn = baseHasIn;

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = _castPath(path, object);

    var index = -1,
      length = path.length,
      result = false;

    while (++index < length) {
      var key = _toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return (
      !!length &&
      isLength_1(length) &&
      _isIndex(key, length) &&
      (isArray_1(object) || isArguments_1(object))
    );
  }

  var _hasPath = hasPath;

  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.hasIn(object, 'a');
   * // => true
   *
   * _.hasIn(object, 'a.b');
   * // => true
   *
   * _.hasIn(object, ['a', 'b']);
   * // => true
   *
   * _.hasIn(object, 'b');
   * // => false
   */
  function hasIn(object, path) {
    return object != null && _hasPath(object, path, _baseHasIn);
  }

  var hasIn_1 = hasIn;

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$5 = 1,
    COMPARE_UNORDERED_FLAG$3 = 2;

  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if (_isKey(path) && _isStrictComparable(srcValue)) {
      return _matchesStrictComparable(_toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get_1(object, path);
      return objValue === undefined && objValue === srcValue
        ? hasIn_1(object, path)
        : _baseIsEqual(
            srcValue,
            objValue,
            COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3,
          );
    };
  }

  var _baseMatchesProperty = baseMatchesProperty;

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  var identity_1 = identity;

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  var _baseProperty = baseProperty;

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function(object) {
      return _baseGet(object, path);
    };
  }

  var _basePropertyDeep = basePropertyDeep;

  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */
  function property(path) {
    return _isKey(path) ? _baseProperty(_toKey(path)) : _basePropertyDeep(path);
  }

  var property_1 = property;

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return identity_1;
    }
    if (typeof value == 'object') {
      return isArray_1(value)
        ? _baseMatchesProperty(value[0], value[1])
        : _baseMatches(value);
    }
    return property_1(value);
  }

  var _baseIteratee = baseIteratee;

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol_1(value)) {
      return NAN;
    }
    if (isObject_1(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject_1(other) ? other + '' : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return isBinary || reIsOctal.test(value)
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : reIsBadHex.test(value)
      ? NAN
      : +value;
  }

  var toNumber_1 = toNumber;

  /** Used as references for various `Number` constants. */
  var INFINITY$2 = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e308;

  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber_1(value);
    if (value === INFINITY$2 || value === -INFINITY$2) {
      var sign = value < 0 ? -1 : 1;
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }

  var toFinite_1 = toFinite;

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */
  function toInteger(value) {
    var result = toFinite_1(value),
      remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
  }

  var toInteger_1 = toInteger;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * This method is like `_.find` except that it returns the index of the first
   * element `predicate` returns truthy for instead of the element itself.
   *
   * @static
   * @memberOf _
   * @since 1.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {Function} [predicate=_.identity] The function invoked per iteration.
   * @param {number} [fromIndex=0] The index to search from.
   * @returns {number} Returns the index of the found element, else `-1`.
   * @example
   *
   * var users = [
   *   { 'user': 'barney',  'active': false },
   *   { 'user': 'fred',    'active': false },
   *   { 'user': 'pebbles', 'active': true }
   * ];
   *
   * _.findIndex(users, function(o) { return o.user == 'barney'; });
   * // => 0
   *
   * // The `_.matches` iteratee shorthand.
   * _.findIndex(users, { 'user': 'fred', 'active': false });
   * // => 1
   *
   * // The `_.matchesProperty` iteratee shorthand.
   * _.findIndex(users, ['active', false]);
   * // => 0
   *
   * // The `_.property` iteratee shorthand.
   * _.findIndex(users, 'active');
   * // => 2
   */
  function findIndex(array, predicate, fromIndex) {
    var length = array == null ? 0 : array.length;
    if (!length) {
      return -1;
    }
    var index = fromIndex == null ? 0 : toInteger_1(fromIndex);
    if (index < 0) {
      index = nativeMax(length + index, 0);
    }
    return _baseFindIndex(array, _baseIteratee(predicate, 3), index);
  }

  var findIndex_1 = findIndex;

  /** Built-in value references. */
  var getPrototype = _overArg(Object.getPrototypeOf, Object);

  var _getPrototype = getPrototype;

  /** `Object#toString` result references. */
  var objectTag$3 = '[object Object]';

  /** Used for built-in method references. */
  var funcProto$2 = Function.prototype,
    objectProto$c = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$2 = funcProto$2.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$9 = objectProto$c.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString$2.call(Object);

  /**
   * Checks if `value` is a plain object, that is, an object created by the
   * `Object` constructor or one with a `[[Prototype]]` of `null`.
   *
   * @static
   * @memberOf _
   * @since 0.8.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   * }
   *
   * _.isPlainObject(new Foo);
   * // => false
   *
   * _.isPlainObject([1, 2, 3]);
   * // => false
   *
   * _.isPlainObject({ 'x': 0, 'y': 0 });
   * // => true
   *
   * _.isPlainObject(Object.create(null));
   * // => true
   */
  function isPlainObject(value) {
    if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag$3) {
      return false;
    }
    var proto = _getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$9.call(proto, 'constructor') && proto.constructor;
    return (
      typeof Ctor == 'function' &&
      Ctor instanceof Ctor &&
      funcToString$2.call(Ctor) == objectCtorString
    );
  }

  var isPlainObject_1 = isPlainObject;

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(
          Object.getOwnPropertySymbols(source).filter(function(sym) {
            return Object.getOwnPropertyDescriptor(source, sym).enumerable;
          }),
        );
      }

      ownKeys.forEach(function(key) {
        defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  var objectSpread = _objectSpread;

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  var arrayWithHoles = _arrayWithHoles;

  function _iterableToArrayLimit(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i['return'] != null) _i['return']();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  var iterableToArrayLimit = _iterableToArrayLimit;

  function _nonIterableRest() {
    throw new TypeError('Invalid attempt to destructure non-iterable instance');
  }

  var nonIterableRest = _nonIterableRest;

  function _slicedToArray(arr, i) {
    return (
      arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest()
    );
  }

  var slicedToArray = _slicedToArray;

  function arrayMove(array, from, to) {
    {
      if (typeof console !== 'undefined') {
        console.warn(
          "Deprecation warning: arrayMove will no longer be exported by 'react-sortable-hoc' in the next major release. Please install the `array-move` package locally instead. https://www.npmjs.com/package/array-move",
        );
      }
    }

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
    end: ['touchend', 'touchcancel', 'mouseup'],
    move: ['touchmove', 'mousemove'],
    start: ['touchstart', 'mousedown'],
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
  function setInlineStyles(node, styles) {
    Object.keys(styles).forEach(function(key) {
      node.style[key] = styles[key];
    });
  }
  function setTranslate3d(node, translate) {
    node.style[''.concat(vendorPrefix, 'Transform')] =
      translate == null
        ? ''
        : 'translate3d('
            .concat(translate.x, 'px,')
            .concat(translate.y, 'px,0)');
  }
  function setTransitionDuration(node, duration) {
    node.style[''.concat(vendorPrefix, 'TransitionDuration')] =
      duration == null ? '' : ''.concat(duration, 'ms');
  }
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
      bottom: getPixelValue(style.marginBottom),
      left: getPixelValue(style.marginLeft),
      right: getPixelValue(style.marginRight),
      top: getPixelValue(style.marginTop),
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
            left: 0,
            top: 0,
          };

    if (!node) {
      return undefined;
    }

    var nodeOffset = {
      left: offset.left + node.offsetLeft,
      top: offset.top + node.offsetTop,
    };

    if (node.parentNode === parent) {
      return nodeOffset;
    }

    return getEdgeOffset(node.parentNode, parent, nodeOffset);
  }
  function getLockPixelOffsets(_ref) {
    var height = _ref.height,
      width = _ref.width,
      lockOffset = _ref.lockOffset;
    var offsets = Array.isArray(lockOffset)
      ? lockOffset
      : [lockOffset, lockOffset];
    invariant_1(
      offsets.length === 2,
      'lockOffset prop of SortableContainer should be a single ' +
        'value or an array of exactly two values. Given %s',
      lockOffset,
    );

    var _offsets = slicedToArray(offsets, 2),
      minLockOffset = _offsets[0],
      maxLockOffset = _offsets[1];

    return [
      getLockPixelOffset({
        height: height,
        lockOffset: minLockOffset,
        width: width,
      }),
      getLockPixelOffset({
        height: height,
        lockOffset: maxLockOffset,
        width: width,
      }),
    ];
  }

  function isScrollable(el) {
    var computedStyle = window.getComputedStyle(el);
    var overflowRegex = /(auto|scroll)/;
    var properties = ['overflow', 'overflowX', 'overflowY'];
    return properties.find(function(property) {
      return overflowRegex.test(computedStyle[property]);
    });
  }

  function getScrollingParent(el) {
    if (!el) {
      return null;
    } else if (isScrollable(el)) {
      return el;
    } else {
      return getScrollingParent(el.parentNode);
    }
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
    return distances.indexOf(
      Math.min.apply(Math, toConsumableArray(distances)),
    );
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
      toConsumableArray(
        [container1, container2].map(function(cont) {
          return cont.container.getBoundingClientRect();
        }),
      ),
    );
    var scrollDX =
      container2.scrollContainer.scrollLeft -
      container1.scrollContainer.scrollLeft;
    var scrollDY =
      container2.scrollContainer.scrollTop -
      container1.scrollContainer.scrollTop;
    return {
      x: x + delta.x + scrollDX,
      y: y + delta.y + scrollDY,
    };
  }

  var DragLayer = (function() {
    function DragLayer() {
      var _this = this;

      classCallCheck(this, DragLayer);

      defineProperty(this, 'helper', null);

      defineProperty(this, 'lists', []);

      defineProperty(this, 'handleSortMove', function(event) {
        event.preventDefault();

        _this.updatePosition(event);

        _this.updateTargetContainer(event);

        if (_this.targetList) {
          _this.targetList.handleSortMove(event);
        }
      });

      defineProperty(this, 'handleSortEnd', function(event) {
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

    createClass(DragLayer, [
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
          var useWindowAsScrollContainer =
            list.props.useWindowAsScrollContainer;
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
            var containerBoundingRect = list.scrollContainer.getBoundingClientRect();
            var dimensions = getHelperDimensions({
              collection: collection,
              index: index,
              node: node,
            });
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
            var fields = node.querySelectorAll(
              'input, textarea, select, canvas',
            );
            var clonedNode = node.cloneNode(true);

            var clonedFields = toConsumableArray(
              clonedNode.querySelectorAll('input, textarea, select, canvas'),
            );

            if (fields[index]) {
              clonedFields.forEach(function(field, i) {
                if (field.type !== 'file') {
                  field.value = fields[i].value;
                }

                if (field.tagName === NodeType.Canvas) {
                  var destCtx = field.getContext('2d');
                  destCtx.drawImage(fields[i], 0, 0);
                }
              });
            }

            this.helper = parent.appendChild(clonedNode);
            setInlineStyles(this.helper, {
              boxSizing: 'border-box',
              height: ''.concat(this.height, 'px'),
              left: ''.concat(this.boundingClientRect.left - margin.left, 'px'),
              pointerEvents: 'none',
              position: 'fixed',
              top: ''.concat(this.boundingClientRect.top - margin.top, 'px'),
              width: ''.concat(this.width, 'px'),
            });
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
            lockOffset = _this$targetList$prop.lockOffset,
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
            var _getLockPixelOffsets = getLockPixelOffsets({
                height: this.height,
                lockOffset: lockOffset,
                width: this.width,
              }),
              _getLockPixelOffsets2 = slicedToArray(_getLockPixelOffsets, 2),
              minLockOffset = _getLockPixelOffsets2[0],
              maxLockOffset = _getLockPixelOffsets2[1];

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

          setTranslate3d(this.helper, translate);
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
            this.targetList.manager.active = objectSpread(
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
      classCallCheck(this, Manager);

      defineProperty(this, 'refs', {});
    }

    createClass(Manager, [
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
        inherits(WithSortableHandle, _React$Component);

        function WithSortableHandle() {
          classCallCheck(this, WithSortableHandle);

          return possibleConstructorReturn(
            this,
            getPrototypeOf(WithSortableHandle).apply(this, arguments),
          );
        }

        createClass(WithSortableHandle, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              var node = reactDom.findDOMNode(this);
              node.sortableHandle = true;
            },
          },
          {
            key: 'getWrappedInstance',
            value: function getWrappedInstance() {
              invariant_1(
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
              return React.createElement(
                WrappedComponent,
                _extends_1(
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
      })(React.Component)),
      defineProperty(
        _class,
        'displayName',
        provideDisplayName('sortableHandle', WrappedComponent),
      ),
      _temp
    );
  }
  function isSortableHandle(node) {
    return node.sortableHandle != null;
  }

  var AutoScroller = (function() {
    function AutoScroller(container, onScrollCallback) {
      classCallCheck(this, AutoScroller);

      this.container = container;
      this.onScrollCallback = onScrollCallback;
    }

    createClass(AutoScroller, [
      {
        key: 'clear',
        value: function clear() {
          clearInterval(this.interval);
          this.interval = null;
        },
      },
      {
        key: 'update',
        value: function update(_ref) {
          var _this = this;

          var translate = _ref.translate,
            minTranslate = _ref.minTranslate,
            maxTranslate = _ref.maxTranslate,
            width = _ref.width,
            height = _ref.height;
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
          var _this$container = this.container,
            scrollTop = _this$container.scrollTop,
            scrollLeft = _this$container.scrollLeft,
            scrollHeight = _this$container.scrollHeight,
            scrollWidth = _this$container.scrollWidth,
            clientHeight = _this$container.clientHeight,
            clientWidth = _this$container.clientWidth;
          var isTop = scrollTop === 0;
          var isBottom = scrollHeight - scrollTop - clientHeight === 0;
          var isLeft = scrollLeft === 0;
          var isRight = scrollWidth - scrollLeft - clientWidth === 0;

          if (translate.y >= maxTranslate.y - height / 2 && !isBottom) {
            direction.y = 1;
            speed.y =
              acceleration.y *
              Math.abs((maxTranslate.y - height / 2 - translate.y) / height);
          } else if (translate.x >= maxTranslate.x - width / 2 && !isRight) {
            direction.x = 1;
            speed.x =
              acceleration.x *
              Math.abs((maxTranslate.x - width / 2 - translate.x) / width);
          } else if (translate.y <= minTranslate.y + height / 2 && !isTop) {
            direction.y = -1;
            speed.y =
              acceleration.y *
              Math.abs((translate.y - height / 2 - minTranslate.y) / height);
          } else if (translate.x <= minTranslate.x + width / 2 && !isLeft) {
            direction.x = -1;
            speed.x =
              acceleration.x *
              Math.abs((translate.x - width / 2 - minTranslate.x) / width);
          }

          if (this.interval) {
            this.clear();
            this.isAutoScrolling = false;
          }

          if (direction.x !== 0 || direction.y !== 0) {
            this.interval = setInterval(function() {
              _this.isAutoScrolling = true;
              var offset = {
                left: speed.x * direction.x,
                top: speed.y * direction.y,
              };
              _this.container.scrollTop += offset.top;
              _this.container.scrollLeft += offset.left;

              _this.onScrollCallback(offset);
            }, 5);
          }
        },
      },
    ]);

    return AutoScroller;
  })();

  function defaultGetHelperDimensions(_ref) {
    var node = _ref.node;
    return {
      height: node.offsetHeight,
      width: node.offsetWidth,
    };
  }

  function defaultShouldCancelStart(event) {
    var disabledElements = [
      NodeType.Input,
      NodeType.Textarea,
      NodeType.Select,
      NodeType.Option,
      NodeType.Button,
    ];

    if (disabledElements.indexOf(event.target.tagName) !== -1) {
      return true;
    }

    return false;
  }

  var propTypes = {
    animateNodes: PropTypes.bool,
    axis: PropTypes.oneOf(['x', 'y', 'xy']),
    contentWindow: PropTypes.any,
    disableAutoscroll: PropTypes.bool,
    distance: PropTypes.number,
    dragLayer: PropTypes.object,
    getContainer: PropTypes.func,
    getHelperDimensions: PropTypes.func,
    helperClass: PropTypes.string,
    helperContainer: PropTypes.oneOfType([
      PropTypes.func,
      typeof HTMLElement === 'undefined'
        ? PropTypes.any
        : PropTypes.instanceOf(HTMLElement),
    ]),
    hideSortableGhost: PropTypes.bool,
    lockAxis: PropTypes.string,
    lockOffset: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
      PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      ),
    ]),
    lockToContainerEdges: PropTypes.bool,
    onDragEnd: PropTypes.func,
    onSortEnd: PropTypes.func,
    onSortMove: PropTypes.func,
    onSortOver: PropTypes.func,
    onSortStart: PropTypes.func,
    pressDelay: PropTypes.number,
    pressThreshold: PropTypes.number,
    shouldCancelStart: PropTypes.func,
    transitionDuration: PropTypes.number,
    updateBeforeSortStart: PropTypes.func,
    useDragHandle: PropTypes.bool,
    useWindowAsScrollContainer: PropTypes.bool,
  };
  var defaultProps = {
    animateNodes: true,
    axis: 'y',
    disableAutoscroll: false,
    distance: 0,
    getHelperDimensions: defaultGetHelperDimensions,
    hideSortableGhost: true,
    lockOffset: '50%',
    lockToContainerEdges: false,
    pressDelay: 0,
    pressThreshold: 5,
    shouldCancelStart: defaultShouldCancelStart,
    transitionDuration: 300,
    useWindowAsScrollContainer: false,
  };
  var omittedProps = Object.keys(propTypes);
  function validateProps(props) {
    invariant_1(
      !(props.distance && props.pressDelay),
      'Attempted to set both `pressDelay` and `distance` on SortableContainer, you may only use one or the other, not both at the same time.',
    );
  }

  function _finallyRethrows(body, finalizer) {
    try {
      var result = body();
    } catch (e) {
      return finalizer(true, e);
    }

    if (result && result.then) {
      return result.then(
        finalizer.bind(null, false),
        finalizer.bind(null, true),
      );
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
        inherits(WithSortableContainer, _React$Component);

        function WithSortableContainer(props) {
          var _this;

          classCallCheck(this, WithSortableContainer);

          _this = possibleConstructorReturn(
            this,
            getPrototypeOf(WithSortableContainer).call(this, props),
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'checkActiveIndex',
            function(nextProps) {
              var _ref = nextProps || _this.props,
                items = _ref.items;

              var item = _this.manager.active.item;
              var newIndex = isPlainObject_1(item)
                ? findIndex_1(items, function(obj) {
                    return obj.id === item.id;
                  })
                : findIndex_1(items, item);

              if (newIndex === -1) {
                _this.dragLayer.stopDrag();

                return;
              }

              _this.manager.active.index = newIndex;
              _this.index = newIndex;
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'handleStart',
            function(event) {
              var _this$props = _this.props,
                distance = _this$props.distance,
                shouldCancelStart = _this$props.shouldCancelStart,
                items = _this$props.items;

              if (event.button === 2 || shouldCancelStart(event)) {
                return;
              }

              _this.touched = true;
              _this.position = getPosition(event);
              var node = closest(event.target, function(el) {
                return el.sortableInfo != null;
              });

              if (
                node &&
                node.sortableInfo &&
                _this.nodeIsChild(node) &&
                !_this.state.sorting
              ) {
                var useDragHandle = _this.props.useDragHandle;
                var _node$sortableInfo = node.sortableInfo,
                  index = _node$sortableInfo.index,
                  collection = _node$sortableInfo.collection,
                  disabled = _node$sortableInfo.disabled;

                if (disabled) {
                  return;
                }

                if (useDragHandle && !closest(event.target, isSortableHandle)) {
                  return;
                }

                _this.manager.active = {
                  collection: collection,
                  index: index,
                  item: items[index],
                };

                if (
                  !isTouchEvent(event) &&
                  event.target.tagName === NodeType.Anchor
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
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'nodeIsChild',
            function(node) {
              return node.sortableInfo.manager === _this.manager;
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'handleMove',
            function(event) {
              var _this$props2 = _this.props,
                distance = _this$props2.distance,
                pressThreshold = _this$props2.pressThreshold;

              if (
                !_this.state.sorting &&
                _this.touched &&
                !_this._awaitingUpdateBeforeSortStart
              ) {
                var position = getPosition(event);
                var delta = {
                  x: _this.position.x - position.x,
                  y: _this.position.y - position.y,
                };
                var combinedDelta = Math.abs(delta.x) + Math.abs(delta.y);
                _this.delta = delta;

                if (
                  !distance &&
                  (!pressThreshold || combinedDelta >= pressThreshold)
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
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'handleEnd',
            function() {
              _this.touched = false;

              _this.cancel();
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'cancel',
            function() {
              var distance = _this.props.distance;
              var sorting = _this.state.sorting;

              if (!sorting) {
                if (!distance) {
                  clearTimeout(_this.pressTimer);
                }

                _this.manager.active = null;
              }
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'handlePress',
            function(event) {
              try {
                var active = null;

                if (_this.dragLayer.helper) {
                  if (_this.manager.active) {
                    _this.checkActiveIndex();

                    active = _this.manager.getActive();
                  }
                } else {
                  active = _this.dragLayer.startDrag(
                    _this.helperContainer,
                    assertThisInitialized(assertThisInitialized(_this)),
                    event,
                  );
                }

                var _temp6 = (function() {
                  if (active) {
                    var _temp7 = function _temp7() {
                      var index = _node.sortableInfo.index;
                      _this.index = index;
                      _this.newIndex = index;
                      _this.axis = {
                        x: _axis.indexOf('x') >= 0,
                        y: _axis.indexOf('y') >= 0,
                      };
                      _this.initialScroll = {
                        left: _this.scrollContainer.scrollLeft,
                        top: _this.scrollContainer.scrollTop,
                      };
                      _this.initialWindowScroll = {
                        left: window.pageXOffset,
                        top: window.pageYOffset,
                      };

                      if (_hideSortableGhost) {
                        _this.sortableGhost = _node;
                        setInlineStyles(_node, {
                          opacity: 0,
                          visibility: 'hidden',
                        });
                      }

                      if (_helperClass) {
                        var _this$dragLayer$helpe;

                        (_this$dragLayer$helpe =
                          _this.dragLayer.helper.classList).add.apply(
                          _this$dragLayer$helpe,
                          toConsumableArray(_helperClass.split(' ')),
                        );
                      }

                      _this.setState({
                        sorting: true,
                        sortingIndex: index,
                      });

                      if (_onSortStart) {
                        _onSortStart(
                          {
                            collection: _collection,
                            index: index,
                            node: _node,
                          },
                          event,
                        );
                      }
                    };

                    var _this$props3 = _this.props,
                      _axis = _this$props3.axis,
                      _helperClass = _this$props3.helperClass,
                      _hideSortableGhost = _this$props3.hideSortableGhost,
                      updateBeforeSortStart =
                        _this$props3.updateBeforeSortStart,
                      _onSortStart = _this$props3.onSortStart;
                    var _active = active,
                      _node = _active.node,
                      _collection = _active.collection;

                    var _temp8 = (function() {
                      if (typeof updateBeforeSortStart === 'function') {
                        _this._awaitingUpdateBeforeSortStart = true;

                        var _temp9 = _finallyRethrows(
                          function() {
                            var index = _node.sortableInfo.index;
                            return Promise.resolve(
                              updateBeforeSortStart(
                                {
                                  collection: _collection,
                                  index: index,
                                  node: _node,
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
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
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

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'handleSortEnd',
            function(event) {
              var newList =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : null;
              var _this$props4 = _this.props,
                hideSortableGhost = _this$props4.hideSortableGhost,
                onSortEnd = _this$props4.onSortEnd;
              var collection = _this.manager.active.collection;
              var nodes = _this.manager.refs[collection];

              if (!_this.manager.active) {
                return;
              }

              if (window.cancelAnimationFrame && _this.sortMoveAF) {
                window.cancelAnimationFrame(_this.sortMoveAF);
                _this.sortMoveAF = null;
              }

              if (hideSortableGhost && _this.sortableGhost) {
                setInlineStyles(_this.sortableGhost, {
                  opacity: '',
                  visibility: '',
                });
              }

              for (var i = 0, len = nodes.length; i < len; i++) {
                var _node2 = nodes[i];
                var el = _node2.node;
                _node2.edgeOffset = null;
                setTranslate3d(el, null);
                setTransitionDuration(el, null);
              }

              _this.autoScroller.clear();

              _this.manager.active = null;

              _this.setState({
                sorting: false,
                sortingIndex: null,
              });

              if (typeof onSortEnd === 'function') {
                if (newList) {
                  _this.newIndex = newList.getClosestNode(event).index;
                }

                onSortEnd(
                  {
                    collection: collection,
                    newIndex: _this.newIndex,
                    oldIndex: _this.index,
                    newList: newList,
                  },
                  event,
                );
              }

              _this.touched = false;
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'autoscroll',
            function() {
              var disableAutoscroll = _this.props.disableAutoscroll;

              if (disableAutoscroll) {
                return;
              }

              _this.autoScroller.update({
                height: _this.dragLayer.height,
                maxTranslate: _this.dragLayer.maxTranslate,
                minTranslate: _this.dragLayer.minTranslate,
                translate: _this.dragLayer.translate,
                width: _this.dragLayer.width,
              });
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'onAutoScroll',
            function(offset) {
              _this.dragLayer.translate.x += offset.left;
              _this.dragLayer.translate.y += offset.top;

              _this.animateNodes();
            },
          );

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
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

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
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

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
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

              var finalNodes = _this.manager.refs[collection].map(function(
                ref,
              ) {
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

          defineProperty(
            assertThisInitialized(assertThisInitialized(_this)),
            'checkActive',
            function(event) {
              var active = _this.manager.active;

              if (!active) {
                var _node3 = closest(event.target, function(el) {
                  return el.sortableInfo != null;
                });

                if (_node3 && _node3.sortableInfo) {
                  var pos = getPosition(event);
                  var _collection2 = _node3.sortableInfo.collection;

                  var nodes = _this.manager.refs[_collection2].map(function(
                    ref,
                  ) {
                    return ref.node;
                  });

                  if (nodes) {
                    var index = closestRect(pos.x, pos.y, nodes);
                    _this.manager.active = {
                      index: index,
                      collection: _collection2,
                      item: _this.props.items[index],
                    };

                    _this.handlePress(event);
                  }
                }

                return false;
              }

              return true;
            },
          );

          validateProps(props);
          _this.state = {};
          _this.dragLayer = props.dragLayer || new DragLayer();

          _this.dragLayer.addRef(
            assertThisInitialized(assertThisInitialized(_this)),
          );

          _this.dragLayer.onDragEnd = props.onDragEnd;
          _this.manager = new Manager();
          _this.events = {
            end: _this.handleEnd,
            move: _this.handleMove,
            start: _this.handleStart,
          };
          return _this;
        }

        createClass(WithSortableContainer, [
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
                  : getScrollingParent(_this2.container) || _this2.container;
                _this2.initialScroll = {
                  top: _this2.scrollContainer.scrollTop,
                  left: _this2.scrollContainer.scrollLeft,
                };
                _this2.autoScroller = new AutoScroller(
                  _this2.scrollContainer,
                  _this2.onAutoScroll,
                );
                Object.keys(_this2.events).forEach(function(key) {
                  return events[key].forEach(function(eventName) {
                    return _this2.container.addEventListener(
                      eventName,
                      _this2.events[key],
                      false,
                    );
                  });
                });
              });
            },
          },
          {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              var _this3 = this;

              this.dragLayer.removeRef(this);

              if (this.container) {
                Object.keys(this.events).forEach(function(key) {
                  return events[key].forEach(function(eventName) {
                    return _this3.container.removeEventListener(
                      eventName,
                      _this3.events[key],
                    );
                  });
                });
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
                left: this.scrollContainer.scrollLeft - this.initialScroll.left,
                top: this.scrollContainer.scrollTop - this.initialScroll.top,
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
                left: window.pageXOffset - this.initialWindowScroll.left,
                top: window.pageYOffset - this.initialWindowScroll.top,
              };
              var prevIndex = this.newIndex;
              this.newIndex = null;

              for (var i = 0, len = nodes.length; i < len; i++) {
                var _node4 = nodes[i].node;
                var index = _node4.sortableInfo.index;
                var width = _node4.offsetWidth;
                var height = _node4.offsetHeight;
                var offset = {
                  height:
                    this.dragLayer.height > height
                      ? height / 2
                      : this.dragLayer.height / 2,
                  width:
                    this.dragLayer.width > width
                      ? width / 2
                      : this.dragLayer.width / 2,
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

                if (index === this.index) {
                  if (hideSortableGhost) {
                    this.sortableGhost = _node4;
                    setInlineStyles(_node4, {
                      opacity: 0,
                      visibility: 'hidden',
                    });
                  }

                  continue;
                }

                if (transitionDuration) {
                  setTransitionDuration(_node4, transitionDuration);
                }

                if (this.axis.x) {
                  if (this.axis.y) {
                    if (
                      index < this.index &&
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
                        this.dragLayer.containerBoundingRect.width -
                          offset.width
                      ) {
                        if (nextNode) {
                          translate.x =
                            nextNode.edgeOffset.left - edgeOffset.left;
                          translate.y =
                            nextNode.edgeOffset.top - edgeOffset.top;
                        }
                      }

                      if (this.newIndex === null) {
                        this.newIndex = index;
                      }
                    } else if (
                      index > this.index &&
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
                          translate.y =
                            prevNode.edgeOffset.top - edgeOffset.top;
                        }
                      }

                      this.newIndex = index;
                    }
                  } else {
                    if (
                      index > this.index &&
                      sortingOffset.left +
                        windowScrollDelta.left +
                        offset.width >=
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
                }

                if (animateNodes) {
                  setTranslate3d(_node4, translate);
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
            },
          },
          {
            key: 'getWrappedInstance',
            value: function getWrappedInstance() {
              invariant_1(
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
                return reactDom.findDOMNode(this);
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
              return React.createElement(
                WrappedComponent,
                _extends_1(
                  {
                    ref: ref,
                  },
                  omit(this.props, omittedProps),
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
      })(React.Component)),
      defineProperty(
        _class,
        'displayName',
        provideDisplayName('sortableList', WrappedComponent),
      ),
      defineProperty(_class, 'defaultProps', defaultProps),
      defineProperty(_class, 'propTypes', propTypes),
      defineProperty(_class, 'childContextTypes', {
        manager: PropTypes.object.isRequired,
      }),
      _temp
    );
  }

  var propTypes$1 = {
    index: PropTypes.number.isRequired,
    collection: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    disabled: PropTypes.bool,
  };
  var omittedProps$1 = Object.keys(propTypes$1);
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
        inherits(WithSortableElement, _React$Component);

        function WithSortableElement() {
          classCallCheck(this, WithSortableElement);

          return possibleConstructorReturn(
            this,
            getPrototypeOf(WithSortableElement).apply(this, arguments),
          );
        }

        createClass(WithSortableElement, [
          {
            key: 'componentDidMount',
            value: function componentDidMount() {
              this.register();
            },
          },
          {
            key: 'componentDidUpdate',
            value: function componentDidUpdate(prevProps) {
              if (this.node) {
                if (prevProps.index !== this.props.index) {
                  this.node.sortableInfo.index = this.props.index;
                }

                if (prevProps.disabled !== this.props.disabled) {
                  this.node.sortableInfo.disabled = this.props.disabled;
                }
              }

              if (prevProps.collection !== this.props.collection) {
                this.unregister(prevProps.collection);
                this.register();
              }
            },
          },
          {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {
              this.unregister();
            },
          },
          {
            key: 'register',
            value: function register() {
              var _this$props = this.props,
                collection = _this$props.collection,
                disabled = _this$props.disabled,
                index = _this$props.index;
              var node = reactDom.findDOMNode(this);
              node.sortableInfo = {
                collection: collection,
                disabled: disabled,
                index: index,
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
            key: 'unregister',
            value: function unregister() {
              var collection =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : this.props.collection;
              this.context.manager.remove(collection, this.ref);
            },
          },
          {
            key: 'getWrappedInstance',
            value: function getWrappedInstance() {
              invariant_1(
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
              return React.createElement(
                WrappedComponent,
                _extends_1(
                  {
                    ref: ref,
                  },
                  omit(this.props, omittedProps$1),
                ),
              );
            },
          },
        ]);

        return WithSortableElement;
      })(React.Component)),
      defineProperty(
        _class,
        'displayName',
        provideDisplayName('sortableElement', WrappedComponent),
      ),
      defineProperty(_class, 'contextTypes', {
        manager: PropTypes.object.isRequired,
      }),
      defineProperty(_class, 'propTypes', propTypes$1),
      defineProperty(_class, 'defaultProps', {
        collection: 0,
      }),
      _temp
    );
  }

  exports.SortableContainer = sortableContainer;
  exports.sortableContainer = sortableContainer;
  exports.SortableElement = sortableElement;
  exports.sortableElement = sortableElement;
  exports.SortableHandle = sortableHandle;
  exports.sortableHandle = sortableHandle;
  exports.arrayMove = arrayMove;
  exports.DragLayer = DragLayer;

  Object.defineProperty(exports, '__esModule', {value: true});
});
