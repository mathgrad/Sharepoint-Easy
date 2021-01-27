/* Polyfill service v3.102.0
 * For detailed credits and licence information see https://github.com/financial-times/polyfill-service.
 *
 * Features requested: Object.assign,Object.entries,Object.keys,Object.values,Promise,fetch
 *
 * - _ESAbstract.Call, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.CreateMethodProperty, License: CC0 (required by "fetch", "Object.getOwnPropertyNames", "Array.prototype.includes")
 * - _ESAbstract.Get, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.HasOwnProperty, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor")
 * - _ESAbstract.IsCallable, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.SameValueNonNumber, License: CC0 (required by "fetch", "Object.getOwnPropertyNames", "Array.prototype.includes", "_ESAbstract.SameValueZero")
 * - _ESAbstract.ToObject, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive", "_ESAbstract.GetMethod", "_ESAbstract.GetV")
 * - _ESAbstract.GetV, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive", "_ESAbstract.GetMethod")
 * - _ESAbstract.GetMethod, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive")
 * - _ESAbstract.Type, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive", "_ESAbstract.OrdinaryToPrimitive")
 * - _ESAbstract.OrdinaryToPrimitive, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor", "_ESAbstract.ToPropertyKey", "_ESAbstract.ToPrimitive")
 * - _ESAbstract.SameValueZero, License: CC0 (required by "fetch", "Object.getOwnPropertyNames", "Array.prototype.includes")
 * - _ESAbstract.ToInteger, License: CC0 (required by "fetch", "Object.getOwnPropertyNames", "Array.prototype.includes", "_ESAbstract.ToLength")
 * - _ESAbstract.ToLength, License: CC0 (required by "fetch", "Object.getOwnPropertyNames", "Array.prototype.includes")
 * - _ESAbstract.ToPrimitive, License: CC0 (required by "fetch", "Object.getOwnPropertyNames", "Array.prototype.includes", "_ESAbstract.ToString")
 * - _ESAbstract.ToString, License: CC0 (required by "fetch", "Object.getOwnPropertyNames", "Array.prototype.includes")
 * - _ESAbstract.ToPropertyKey, License: CC0 (required by "Object.assign", "Object.getOwnPropertyDescriptor")
 * - Array.prototype.includes, License: MIT (required by "fetch", "Object.getOwnPropertyNames")
 * - Object.getOwnPropertyDescriptor, License: CC0 (required by "fetch", "Symbol.iterator", "Symbol")
 * - Object.keys, License: MIT (required by "fetch", "Symbol.iterator", "Symbol")
 * - _ESAbstract.EnumerableOwnProperties, License: CC0 (required by "Object.entries")
 * - Object.entries, License: CC0
 * - Object.assign, License: CC0
 * - Object.getOwnPropertyNames, License: CC0 (required by "fetch", "Symbol.iterator", "Symbol")
 * - Object.values, License: CC0
 * - Symbol, License: MIT (required by "fetch", "Symbol.iterator")
 * - Symbol.iterator, License: MIT (required by "fetch")
 * - Symbol.toStringTag, License: MIT (required by "Promise")
 * - Promise, License: MIT (required by "fetch")
 * - fetch, License: MIT */

(function(self, undefined) {

// _ESAbstract.Call
/* global IsCallable */
// 7.3.12. Call ( F, V [ , argumentsList ] )
function Call(F, V /* [, argumentsList] */) { // eslint-disable-line no-unused-vars
	// 1. If argumentsList is not present, set argumentsList to a new empty List.
	var argumentsList = arguments.length > 2 ? arguments[2] : [];
	// 2. If IsCallable(F) is false, throw a TypeError exception.
	if (IsCallable(F) === false) {
		throw new TypeError(Object.prototype.toString.call(F) + 'is not a function.');
	}
	// 3. Return ? F.[[Call]](V, argumentsList).
	return F.apply(V, argumentsList);
}

// _ESAbstract.CreateMethodProperty
// 7.3.5. CreateMethodProperty ( O, P, V )
function CreateMethodProperty(O, P, V) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Let newDesc be the PropertyDescriptor{[[Value]]: V, [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true}.
	var newDesc = {
		value: V,
		writable: true,
		enumerable: false,
		configurable: true
	};
	// 4. Return ? O.[[DefineOwnProperty]](P, newDesc).
	Object.defineProperty(O, P, newDesc);
}

// _ESAbstract.Get
// 7.3.1. Get ( O, P )
function Get(O, P) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Return ? O.[[Get]](P, O).
	return O[P];
}

// _ESAbstract.HasOwnProperty
// 7.3.11 HasOwnProperty (O, P)
function HasOwnProperty(o, p) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: IsPropertyKey(P) is true.
	// 3. Let desc be ? O.[[GetOwnProperty]](P).
	// 4. If desc is undefined, return false.
	// 5. Return true.
	// Polyfill.io - As we expect user agents to support ES3 fully we can skip the above steps and use Object.prototype.hasOwnProperty to do them for us.
	return Object.prototype.hasOwnProperty.call(o, p);
}

// _ESAbstract.IsCallable
// 7.2.3. IsCallable ( argument )
function IsCallable(argument) { // eslint-disable-line no-unused-vars
	// 1. If Type(argument) is not Object, return false.
	// 2. If argument has a [[Call]] internal method, return true.
	// 3. Return false.

	// Polyfill.io - Only function objects have a [[Call]] internal method. This means we can simplify this function to check that the argument has a type of function.
	return typeof argument === 'function';
}

// _ESAbstract.SameValueNonNumber
// 7.2.12. SameValueNonNumber ( x, y )
function SameValueNonNumber(x, y) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(x) is not Number.
	// 2. Assert: Type(x) is the same as Type(y).
	// 3. If Type(x) is Undefined, return true.
	// 4. If Type(x) is Null, return true.
	// 5. If Type(x) is String, then
		// a. If x and y are exactly the same sequence of code units (same length and same code units at corresponding indices), return true; otherwise, return false.
	// 6. If Type(x) is Boolean, then
		// a. If x and y are both true or both false, return true; otherwise, return false.
	// 7. If Type(x) is Symbol, then
		// a. If x and y are both the same Symbol value, return true; otherwise, return false.
	// 8. If x and y are the same Object value, return true. Otherwise, return false.

	// Polyfill.io - We can skip all above steps because the === operator does it all for us.
	return x === y;
}

// _ESAbstract.ToObject
// 7.1.13 ToObject ( argument )
// The abstract operation ToObject converts argument to a value of type Object according to Table 12:
// Table 12: ToObject Conversions
/*
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Argument Type | Result                                                                                                                             |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
| Undefined     | Throw a TypeError exception.                                                                                                       |
| Null          | Throw a TypeError exception.                                                                                                       |
| Boolean       | Return a new Boolean object whose [[BooleanData]] internal slot is set to argument. See 19.3 for a description of Boolean objects. |
| Number        | Return a new Number object whose [[NumberData]] internal slot is set to argument. See 20.1 for a description of Number objects.    |
| String        | Return a new String object whose [[StringData]] internal slot is set to argument. See 21.1 for a description of String objects.    |
| Symbol        | Return a new Symbol object whose [[SymbolData]] internal slot is set to argument. See 19.4 for a description of Symbol objects.    |
| Object        | Return argument.                                                                                                                   |
|----------------------------------------------------------------------------------------------------------------------------------------------------|
*/
function ToObject(argument) { // eslint-disable-line no-unused-vars
	if (argument === null || argument === undefined) {
		throw TypeError();
	}
  return Object(argument);
}

// _ESAbstract.GetV
/* global ToObject */
// 7.3.2 GetV (V, P)
function GetV(v, p) { // eslint-disable-line no-unused-vars
	// 1. Assert: IsPropertyKey(P) is true.
	// 2. Let O be ? ToObject(V).
	var o = ToObject(v);
	// 3. Return ? O.[[Get]](P, V).
	return o[p];
}

// _ESAbstract.GetMethod
/* global GetV, IsCallable */
// 7.3.9. GetMethod ( V, P )
function GetMethod(V, P) { // eslint-disable-line no-unused-vars
	// 1. Assert: IsPropertyKey(P) is true.
	// 2. Let func be ? GetV(V, P).
	var func = GetV(V, P);
	// 3. If func is either undefined or null, return undefined.
	if (func === null || func === undefined) {
		return undefined;
	}
	// 4. If IsCallable(func) is false, throw a TypeError exception.
	if (IsCallable(func) === false) {
		throw new TypeError('Method not callable: ' + P);
	}
	// 5. Return func.
	return func;
}

// _ESAbstract.Type
// "Type(x)" is used as shorthand for "the type of x"...
function Type(x) { // eslint-disable-line no-unused-vars
	switch (typeof x) {
		case 'undefined':
			return 'undefined';
		case 'boolean':
			return 'boolean';
		case 'number':
			return 'number';
		case 'string':
			return 'string';
		case 'symbol':
			return 'symbol';
		default:
			// typeof null is 'object'
			if (x === null) return 'null';
			// Polyfill.io - This is here because a Symbol polyfill will have a typeof `object`.
			if ('Symbol' in self && (x instanceof self.Symbol || x.constructor === self.Symbol)) return 'symbol';

			return 'object';
	}
}

// _ESAbstract.OrdinaryToPrimitive
/* global Get, IsCallable, Call, Type */
// 7.1.1.1. OrdinaryToPrimitive ( O, hint )
function OrdinaryToPrimitive(O, hint) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Assert: Type(hint) is String and its value is either "string" or "number".
	// 3. If hint is "string", then
	if (hint === 'string') {
		// a. Let methodNames be « "toString", "valueOf" ».
		var methodNames = ['toString', 'valueOf'];
		// 4. Else,
	} else {
		// a. Let methodNames be « "valueOf", "toString" ».
		methodNames = ['valueOf', 'toString'];
	}
	// 5. For each name in methodNames in List order, do
	for (var i = 0; i < methodNames.length; ++i) {
		var name = methodNames[i];
		// a. Let method be ? Get(O, name).
		var method = Get(O, name);
		// b. If IsCallable(method) is true, then
		if (IsCallable(method)) {
			// i. Let result be ? Call(method, O).
			var result = Call(method, O);
			// ii. If Type(result) is not Object, return result.
			if (Type(result) !== 'object') {
				return result;
			}
		}
	}
	// 6. Throw a TypeError exception.
	throw new TypeError('Cannot convert to primitive.');
}

// _ESAbstract.SameValueZero
/* global Type, SameValueNonNumber */
// 7.2.11. SameValueZero ( x, y )
function SameValueZero (x, y) { // eslint-disable-line no-unused-vars
	// 1. If Type(x) is different from Type(y), return false.
	if (Type(x) !== Type(y)) {
		return false;
	}
	// 2. If Type(x) is Number, then
	if (Type(x) === 'number') {
		// a. If x is NaN and y is NaN, return true.
		if (isNaN(x) && isNaN(y)) {
			return true;
		}
		// b. If x is +0 and y is -0, return true.
		if (1/x === Infinity && 1/y === -Infinity) {
			return true;
		}
		// c. If x is -0 and y is +0, return true.
		if (1/x === -Infinity && 1/y === Infinity) {
			return true;
		}
		// d. If x is the same Number value as y, return true.
		if (x === y) {
			return true;
		}
		// e. Return false.
		return false;
	}
	// 3. Return SameValueNonNumber(x, y).
	return SameValueNonNumber(x, y);
}

// _ESAbstract.ToInteger
/* global Type */
// 7.1.4. ToInteger ( argument )
function ToInteger(argument) { // eslint-disable-line no-unused-vars
	if (Type(argument) === 'symbol') {
		throw new TypeError('Cannot convert a Symbol value to a number');
	}

	// 1. Let number be ? ToNumber(argument).
	var number = Number(argument);
	// 2. If number is NaN, return +0.
	if (isNaN(number)) {
		return 0;
	}
	// 3. If number is +0, -0, +∞, or -∞, return number.
	if (1/number === Infinity || 1/number === -Infinity || number === Infinity || number === -Infinity) {
		return number;
	}
	// 4. Return the number value that is the same sign as number and whose magnitude is floor(abs(number)).
	return ((number < 0) ? -1 : 1) * Math.floor(Math.abs(number));
}

// _ESAbstract.ToLength
/* global ToInteger */
// 7.1.15. ToLength ( argument )
function ToLength(argument) { // eslint-disable-line no-unused-vars
	// 1. Let len be ? ToInteger(argument).
	var len = ToInteger(argument);
	// 2. If len ≤ +0, return +0.
	if (len <= 0) {
		return 0;
	}
	// 3. Return min(len, 253-1).
	return Math.min(len, Math.pow(2, 53) -1);
}

// _ESAbstract.ToPrimitive
/* global Type, GetMethod, Call, OrdinaryToPrimitive */
// 7.1.1. ToPrimitive ( input [ , PreferredType ] )
function ToPrimitive(input /* [, PreferredType] */) { // eslint-disable-line no-unused-vars
	var PreferredType = arguments.length > 1 ? arguments[1] : undefined;
	// 1. Assert: input is an ECMAScript language value.
	// 2. If Type(input) is Object, then
	if (Type(input) === 'object') {
		// a. If PreferredType is not present, let hint be "default".
		if (arguments.length < 2) {
			var hint = 'default';
			// b. Else if PreferredType is hint String, let hint be "string".
		} else if (PreferredType === String) {
			hint = 'string';
			// c. Else PreferredType is hint Number, let hint be "number".
		} else if (PreferredType === Number) {
			hint = 'number';
		}
		// d. Let exoticToPrim be ? GetMethod(input, @@toPrimitive).
		var exoticToPrim = typeof self.Symbol === 'function' && typeof self.Symbol.toPrimitive === 'symbol' ? GetMethod(input, self.Symbol.toPrimitive) : undefined;
		// e. If exoticToPrim is not undefined, then
		if (exoticToPrim !== undefined) {
			// i. Let result be ? Call(exoticToPrim, input, « hint »).
			var result = Call(exoticToPrim, input, [hint]);
			// ii. If Type(result) is not Object, return result.
			if (Type(result) !== 'object') {
				return result;
			}
			// iii. Throw a TypeError exception.
			throw new TypeError('Cannot convert exotic object to primitive.');
		}
		// f. If hint is "default", set hint to "number".
		if (hint === 'default') {
			hint = 'number';
		}
		// g. Return ? OrdinaryToPrimitive(input, hint).
		return OrdinaryToPrimitive(input, hint);
	}
	// 3. Return input
	return input;
}
// _ESAbstract.ToString
/* global Type, ToPrimitive */
// 7.1.12. ToString ( argument )
// The abstract operation ToString converts argument to a value of type String according to Table 11:
// Table 11: ToString Conversions
/*
|---------------|--------------------------------------------------------|
| Argument Type | Result                                                 |
|---------------|--------------------------------------------------------|
| Undefined     | Return "undefined".                                    |
|---------------|--------------------------------------------------------|
| Null	        | Return "null".                                         |
|---------------|--------------------------------------------------------|
| Boolean       | If argument is true, return "true".                    |
|               | If argument is false, return "false".                  |
|---------------|--------------------------------------------------------|
| Number        | Return NumberToString(argument).                       |
|---------------|--------------------------------------------------------|
| String        | Return argument.                                       |
|---------------|--------------------------------------------------------|
| Symbol        | Throw a TypeError exception.                           |
|---------------|--------------------------------------------------------|
| Object        | Apply the following steps:                             |
|               | Let primValue be ? ToPrimitive(argument, hint String). |
|               | Return ? ToString(primValue).                          |
|---------------|--------------------------------------------------------|
*/
function ToString(argument) { // eslint-disable-line no-unused-vars
	switch(Type(argument)) {
		case 'symbol':
			throw new TypeError('Cannot convert a Symbol value to a string');
		case 'object':
			var primValue = ToPrimitive(argument, String);
			return ToString(primValue); // eslint-disable-line no-unused-vars
		default:
			return String(argument);
	}
}

// _ESAbstract.ToPropertyKey
/* globals ToPrimitive, Type, ToString */
// 7.1.14. ToPropertyKey ( argument )
function ToPropertyKey(argument) { // eslint-disable-line no-unused-vars
	// 1. Let key be ? ToPrimitive(argument, hint String).
	var key = ToPrimitive(argument, String);
	// 2. If Type(key) is Symbol, then
	if (Type(key) === 'symbol') {
		// a. Return key.
		return key;
	}
	// 3. Return ! ToString(key).
	return ToString(key);
}

// Array.prototype.includes
/* global CreateMethodProperty, Get, SameValueZero, ToInteger, ToLength, ToObject, ToString */
// 22.1.3.11. Array.prototype.includes ( searchElement [ , fromIndex ] )
CreateMethodProperty(Array.prototype, 'includes', function includes(searchElement /* [ , fromIndex ] */) {
	'use strict';
	// 1. Let O be ? ToObject(this value).
	var O = ToObject(this);
	// 2. Let len be ? ToLength(? Get(O, "length")).
	var len = ToLength(Get(O, "length"));
	// 3. If len is 0, return false.
	if (len === 0) {
		return false;
	}
	// 4. Let n be ? ToInteger(fromIndex). (If fromIndex is undefined, this step produces the value 0.)
	var n = ToInteger(arguments[1]);
	// 5. If n ≥ 0, then
	if (n >= 0) {
		// a. Let k be n.
		var k = n;
		// 6. Else n < 0,
	} else {
		// a. Let k be len + n.
		k = len + n;
		// b. If k < 0, let k be 0.
		if (k < 0) {
			k = 0;
		}
	}
	// 7. Repeat, while k < len
	while (k < len) {
		// a. Let elementK be the result of ? Get(O, ! ToString(k)).
		var elementK = Get(O, ToString(k));
		// b. If SameValueZero(searchElement, elementK) is true, return true.
		if (SameValueZero(searchElement, elementK)) {
			return true;
		}
		// c. Increase k by 1.
		k = k + 1;
	}
	// 8. Return false.
	return false;
});

// Object.getOwnPropertyDescriptor
/* global CreateMethodProperty, ToObject, ToPropertyKey, HasOwnProperty, Type */
(function () {
	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	var supportsDOMDescriptors = (function () {
		try {
			return Object.defineProperty(document.createElement('div'), 'one', {
				get: function () {
					return 1;
				}
			}).one === 1;
		} catch (e) {
			return false;
		}
	});

	var toString = ({}).toString;
	var split = ''.split;

	// 19.1.2.8 Object.getOwnPropertyDescriptor ( O, P )
	CreateMethodProperty(Object, 'getOwnPropertyDescriptor', function getOwnPropertyDescriptor(O, P) {
		// 1. Let obj be ? ToObject(O).
		var obj = ToObject(O);
		// Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
		obj = (Type(obj) === 'string' || obj instanceof String) && toString.call(O) == '[object String]' ? split.call(O, '') : Object(O);

		// 2. Let key be ? ToPropertyKey(P).
		var key = ToPropertyKey(P);

		// 3. Let desc be ? obj.[[GetOwnProperty]](key).
		// 4. Return FromPropertyDescriptor(desc).
		// Polyfill.io Internet Explorer 8 natively supports property descriptors only on DOM objects.
		// We will fallback to the polyfill implementation if the native implementation throws an error.
		if (supportsDOMDescriptors) {
			try {
				return nativeGetOwnPropertyDescriptor(obj, key);
			// eslint-disable-next-line no-empty
			} catch (error) {}
		}
		if (HasOwnProperty(obj, key)) {
			return {
				enumerable: true,
				configurable: true,
				writable: true,
				value: obj[key]
			};
		}
	});
}());

// Object.keys
/* global CreateMethodProperty */
CreateMethodProperty(Object, "keys", (function() {
	'use strict';

	// modified from https://github.com/es-shims/object-keys

	var has = Object.prototype.hasOwnProperty;
	var toStr = Object.prototype.toString;
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
	var hasPrototypeEnumBug = isEnumerable.call(function () { }, 'prototype');
	function hasProtoEnumBug() {
		// Object.create polyfill creates an enumerable __proto__
		var createdObj;
		try {
			createdObj = Object.create({});
		} catch (e) {
			// If this fails the polyfil isn't loaded yet, but will be.
			// Can't add it to depedencies because of it would create a circular depedency.
			return true;
		}

		return isEnumerable.call(createdObj, '__proto__')
	}

	var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	];
	var equalsConstructorPrototype = function (o) {
		var ctor = o.constructor;
		return ctor && ctor.prototype === o;
	};
	var excludedKeys = {
		$console: true,
		$external: true,
		$frame: true,
		$frameElement: true,
		$frames: true,
		$innerHeight: true,
		$innerWidth: true,
		$outerHeight: true,
		$outerWidth: true,
		$pageXOffset: true,
		$pageYOffset: true,
		$parent: true,
		$scrollLeft: true,
		$scrollTop: true,
		$scrollX: true,
		$scrollY: true,
		$self: true,
		$webkitIndexedDB: true,
		$webkitStorageInfo: true,
		$window: true
	};
	var hasAutomationEqualityBug = (function () {
		if (typeof window === 'undefined') { return false; }
		for (var k in window) {
			try {
				if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
					try {
						equalsConstructorPrototype(window[k]);
					} catch (e) {
						return true;
					}
				}
			} catch (e) {
				return true;
			}
		}
		return false;
	}());
	var equalsConstructorPrototypeIfNotBuggy = function (o) {
		if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
			return equalsConstructorPrototype(o);
		}
		try {
			return equalsConstructorPrototype(o);
		} catch (e) {
			return false;
		}
	};

	function isArgumentsObject(value) {
		var str = toStr.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = str !== '[object Array]' &&
				value !== null &&
				typeof value === 'object' &&
				typeof value.length === 'number' &&
				value.length >= 0 &&
				toStr.call(value.callee) === '[object Function]';
		}
		return isArgs;
	}

	return function keys(object) {
		var isFunction = toStr.call(object) === '[object Function]';
		var isArguments = isArgumentsObject(object);
		var isString = toStr.call(object) === '[object String]';
		var theKeys = [];

		if (object === undefined || object === null) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var skipPrototype = hasPrototypeEnumBug && isFunction;
		if (isString && object.length > 0 && !has.call(object, 0)) {
			for (var i = 0; i < object.length; ++i) {
				theKeys.push(String(i));
			}
		}

		if (isArguments && object.length > 0) {
			for (var j = 0; j < object.length; ++j) {
				theKeys.push(String(j));
			}
		} else {
			for (var name in object) {
				if (!(hasProtoEnumBug() && name === '__proto__') && !(skipPrototype && name === 'prototype') && has.call(object, name)) {
					theKeys.push(String(name));
				}
			}
		}

		if (hasDontEnumBug) {
			var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

			for (var k = 0; k < dontEnums.length; ++k) {
				if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
					theKeys.push(dontEnums[k]);
				}
			}
		}
		return theKeys;
	};
}()));

// _ESAbstract.EnumerableOwnProperties
/* globals Type, Get */
// 7.3.21. EnumerableOwnProperties ( O, kind )
function EnumerableOwnProperties(O, kind) { // eslint-disable-line no-unused-vars
	// 1. Assert: Type(O) is Object.
	// 2. Let ownKeys be ? O.[[OwnPropertyKeys]]().
	var ownKeys = Object.keys(O);
	// 3. Let properties be a new empty List.
	var properties = [];
	// 4. For each element key of ownKeys in List order, do
	var length = ownKeys.length;
	for (var i = 0; i < length; i++) {
		var key = ownKeys[i];
		// a. If Type(key) is String, then
		if (Type(key) === 'string') {
			// i. Let desc be ? O.[[GetOwnProperty]](key).
			var desc = Object.getOwnPropertyDescriptor(O, key);
			// ii. If desc is not undefined and desc.[[Enumerable]] is true, then
			if (desc && desc.enumerable) {
				// 1. If kind is "key", append key to properties.
				if (kind === 'key') {
					properties.push(key);
					// 2. Else,
				} else {
					// a. Let value be ? Get(O, key).
					var value = Get(O, key);
					// b. If kind is "value", append value to properties.
					if (kind === 'value') {
						properties.push(value);
						// c. Else,
					} else {
						// i. Assert: kind is "key+value".
						// ii. Let entry be CreateArrayFromList(« key, value »).
						var entry = [key, value];
						// iii. Append entry to properties.
						properties.push(entry);
					}
				}
			}
		}
	}
	// 5. Order the elements of properties so they are in the same relative order as would be produced by the Iterator that would be returned if the EnumerateObjectProperties internal method were invoked with O.
	// 6. Return properties.
	return properties;
}

// Object.entries
/* global CreateMethodProperty, EnumerableOwnProperties, ToObject, Type */

(function () {
	var toString = ({}).toString;
	var split = ''.split;

	// 19.1.2.5. Object.entries ( O )
	CreateMethodProperty(Object, 'entries', function entries(O) {
		// 1. Let obj be ? ToObject(O).
		var obj = ToObject(O);
		// Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
		obj = (Type(obj) === 'string' || obj instanceof String) && toString.call(O) == '[object String]' ? split.call(O, '') : Object(O);
		// 2. Let nameList be ? EnumerableOwnProperties(obj, "key+value").
		var nameList = EnumerableOwnProperties(obj, "key+value");
		// 3. Return CreateArrayFromList(nameList).
		// Polyfill.io - nameList is already an array.
		return nameList;
	});
}());
// Object.assign
/* global CreateMethodProperty, Get, ToObject */
// 19.1.2.1 Object.assign ( target, ...sources )
CreateMethodProperty(Object, 'assign', function assign(target, source) { // eslint-disable-line no-unused-vars
	// 1. Let to be ? ToObject(target).
	var to = ToObject(target);

	// 2. If only one argument was passed, return to.
	if (arguments.length === 1) {
		return to;
	}

	// 3. Let sources be the List of argument values starting with the second argument
	var sources = Array.prototype.slice.call(arguments, 1);

	// 4. For each element nextSource of sources, in ascending index order, do
	var index1;
	var index2;
	var keys;
	var from;
	for (index1 = 0; index1 < sources.length; index1++) {
		var nextSource = sources[index1];
		// a. If nextSource is undefined or null, let keys be a new empty List.
		if (nextSource === undefined || nextSource === null) {
			keys = [];
			// b. Else,
		} else {
			// Polyfill.io - In order to get strings in ES3 and old V8 working correctly we need to split them into an array ourselves.
			// i. Let from be ! ToObject(nextSource).
			from = Object.prototype.toString.call(nextSource) === '[object String]' ? String(nextSource).split('') : ToObject(nextSource);
			// ii. Let keys be ? from.[[OwnPropertyKeys]]().
			/*
				This step in our polyfill is not complying with the specification.
				[[OwnPropertyKeys]] is meant to return ALL keys, including non-enumerable and symbols.
				TODO: When we have Reflect.ownKeys, use that instead as it is the userland equivalent of [[OwnPropertyKeys]].
			*/
			keys = Object.keys(from);
		}

		// c. For each element nextKey of keys in List order, do
		for (index2 = 0; index2 < keys.length; index2++) {
			var nextKey = keys[index2];
			var enumerable;
			try {
				// i. Let desc be ? from.[[GetOwnProperty]](nextKey).
				var desc = Object.getOwnPropertyDescriptor(from, nextKey);
				// ii. If desc is not undefined and desc.[[Enumerable]] is true, then
				enumerable = desc !== undefined && desc.enumerable === true;
			} catch (e) {
				// Polyfill.io - We use Object.prototype.propertyIsEnumerable as a fallback
				// because `Object.getOwnPropertyDescriptor(window.location, 'hash')` causes Internet Explorer 11 to crash.
				enumerable = Object.prototype.propertyIsEnumerable.call(from, nextKey);
			}
			if (enumerable) {
				// 1. Let propValue be ? Get(from, nextKey).
				var propValue = Get(from, nextKey);
				// 2. Perform ? Set(to, nextKey, propValue, true).
				to[nextKey] = propValue;
			}
		}
	}
	// 5. Return to.
	return to;
});

// Object.getOwnPropertyNames
/* global CreateMethodProperty, ToObject */
(function() {
  var toString = {}.toString;
  var split = "".split;
  var concat = [].concat;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var nativeGetOwnPropertyNames = Object.getOwnPropertyNames || Object.keys;
  var cachedWindowNames =
    typeof self === "object" ? nativeGetOwnPropertyNames(self) : [];

  // 19.1.2.10 Object.getOwnPropertyNames ( O )
  CreateMethodProperty(
    Object,
    "getOwnPropertyNames",
    function getOwnPropertyNames(O) {
      var object = ToObject(O);

      if (toString.call(object) === "[object Window]") {
        try {
          return nativeGetOwnPropertyNames(object);
        } catch (e) {
          // IE bug where layout engine calls userland Object.getOwnPropertyNames for cross-domain `window` objects
          return concat.call([], cachedWindowNames);
        }
      }

      // Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
      object =
        toString.call(object) == "[object String]"
          ? split.call(object, "")
          : Object(object);

      var result = nativeGetOwnPropertyNames(object);
      var extraNonEnumerableKeys = ["length", "prototype"];
      for (var i = 0; i < extraNonEnumerableKeys.length; i++) {
        var key = extraNonEnumerableKeys[i];
        if (hasOwnProperty.call(object, key) && !result.includes(key)) {
          result.push(key);
        }
      }

      if (result.includes("__proto__")) {
        var index = result.indexOf("__proto__");
        result.splice(index, 1);
      }

      return result;
    }
  );
})();

// Object.values
/* global CreateMethodProperty, ToObject */
(function () {
	var toString = ({}).toString;
	var split = ''.split;
	// 19.1.2.21. Object.values ( O )
	CreateMethodProperty(Object, 'values', function values(O) {
		// 1. Let obj be ? ToObject(O).
		// Polyfill.io fallback for non-array-like strings which exist in some ES3 user-agents (IE 8)
		var obj = toString.call(O) == '[object String]' ? split.call(O, '') : ToObject(O);
		// 2. Let nameList be ? EnumerableOwnProperties(obj, "value").
		var nameList = Object.keys(obj).map(function (key) {
			return obj[key];
		});
		// 3. Return CreateArrayFromList(nameList).
		// Polyfill.io - nameList is already an array.
		return nameList;
	});
}());

// Symbol
// A modification of https://github.com/WebReflection/get-own-property-symbols
// (C) Andrea Giammarchi - MIT Licensed

/* global Type */
(function (Object,  GOPS, global) {
	'use strict'; //so that ({}).toString.call(null) returns the correct [object Null] rather than [object Window]

	var supportsGetters = (function () {
		// supports getters
		try {
			var a = {};
			Object.defineProperty(a, "t", {
				configurable: true,
				enumerable: false,
				get: function () {
					return true;
				},
				set: undefined
			});
			return !!a.t;
		} catch (e) {
			return false;
		}
	}());

	var	setDescriptor;
	var id = 0;
	var random = '' + Math.random();
	var prefix = '__\x01symbol:';
	var prefixLength = prefix.length;
	var internalSymbol = '__\x01symbol@@' + random;
	var emptySymbolLookup = {};
	var DP = 'defineProperty';
	var DPies = 'defineProperties';
	var GOPN = 'getOwnPropertyNames';
	var GOPD = 'getOwnPropertyDescriptor';
	var PIE = 'propertyIsEnumerable';
	var ObjectProto = Object.prototype;
	var hOP = ObjectProto.hasOwnProperty;
	var pIE = ObjectProto[PIE];
	var toString = ObjectProto.toString;
	var concat = Array.prototype.concat;
	var cachedWindowNames = Object.getOwnPropertyNames ? Object.getOwnPropertyNames(self) : [];
	var nGOPN = Object[GOPN];
	var gOPN = function getOwnPropertyNames (obj) {
		if (toString.call(obj) === '[object Window]') {
			try {
				return nGOPN(obj);
			} catch (e) {
				// IE bug where layout engine calls userland gOPN for cross-domain `window` objects
				return concat.call([], cachedWindowNames);
			}
		}
		return nGOPN(obj);
	};
	var gOPD = Object[GOPD];
	var objectCreate = Object.create;
	var objectKeys = Object.keys;
	var freeze = Object.freeze || Object;
	var objectDefineProperty = Object[DP];
	var $defineProperties = Object[DPies];
	var descriptor = gOPD(Object, GOPN);
	var addInternalIfNeeded = function (o, uid, enumerable) {
		if (!hOP.call(o, internalSymbol)) {
			try {
				objectDefineProperty(o, internalSymbol, {
					enumerable: false,
					configurable: false,
					writable: false,
					value: {}
				});
			} catch (e) {
				o[internalSymbol] = {};
			}
		}
		o[internalSymbol]['@@' + uid] = enumerable;
	};
	var createWithSymbols = function (proto, descriptors) {
		var self = objectCreate(proto);
		gOPN(descriptors).forEach(function (key) {
			if (propertyIsEnumerable.call(descriptors, key)) {
				$defineProperty(self, key, descriptors[key]);
			}
		});
		return self;
	};
	var copyAsNonEnumerable = function (descriptor) {
		var newDescriptor = objectCreate(descriptor);
		newDescriptor.enumerable = false;
		return newDescriptor;
	};
	var get = function get(){};
	var onlyNonSymbols = function (name) {
		return name != internalSymbol &&
			!hOP.call(source, name);
	};
	var onlySymbols = function (name) {
		return name != internalSymbol &&
			hOP.call(source, name);
	};
	var propertyIsEnumerable = function propertyIsEnumerable(key) {
		var uid = '' + key;
		return onlySymbols(uid) ? (
			hOP.call(this, uid) &&
			this[internalSymbol] && this[internalSymbol]['@@' + uid]
		) : pIE.call(this, key);
	};
	var setAndGetSymbol = function (uid) {
		var descriptor = {
			enumerable: false,
			configurable: true,
			get: get,
			set: function (value) {
			setDescriptor(this, uid, {
				enumerable: false,
				configurable: true,
				writable: true,
				value: value
			});
			addInternalIfNeeded(this, uid, true);
			}
		};
		try {
			objectDefineProperty(ObjectProto, uid, descriptor);
		} catch (e) {
			ObjectProto[uid] = descriptor.value;
		}
		source[uid] = objectDefineProperty(
			Object(uid),
			'constructor',
			sourceConstructor
		);
		var description = gOPD(Symbol.prototype, 'description');
		if (description) {
			objectDefineProperty(
				source[uid],
				'description',
				description
			);
		}
		return freeze(source[uid]);
	};

	var symbolDescription = function (s) {
		var sym = thisSymbolValue(s);

		// 3. Return sym.[[Description]].
		if (supportsInferredNames) {
			var name = getInferredName(sym);
			if (name !== "") {
				return name.slice(1, -1); // name.slice('['.length, -']'.length);
			}
		}

		if (emptySymbolLookup[sym] !== undefined) {
			return emptySymbolLookup[sym];
		}

		var string = sym.toString();
		var randomStartIndex = string.lastIndexOf("0.");
		string = string.slice(10, randomStartIndex);

		if (string === "") {
			return undefined;
		}
		return string;
	};

	var Symbol = function Symbol() {
		var description = arguments[0];
		if (this instanceof Symbol) {
			throw new TypeError('Symbol is not a constructor');
		}

		var uid = prefix.concat(description || '', random, ++id);

		if (description !== undefined && (description === null || isNaN(description) || String(description) === "")) {
			emptySymbolLookup[uid] = String(description);
		}

		var that = setAndGetSymbol(uid);

		if (!supportsGetters) {
			Object.defineProperty(that, "description", {
				configurable: true,
				enumerable: false,
				value: symbolDescription(that)
			});
		}

		return that;
	};

	var source = objectCreate(null);
	var sourceConstructor = {value: Symbol};
	var sourceMap = function (uid) {
		return source[uid];
		};
	var $defineProperty = function defineProperty(o, key, descriptor) {
		var uid = '' + key;
		if (onlySymbols(uid)) {
			setDescriptor(o, uid, descriptor.enumerable ?
				copyAsNonEnumerable(descriptor) : descriptor);
			addInternalIfNeeded(o, uid, !!descriptor.enumerable);
		} else {
			objectDefineProperty(o, key, descriptor);
		}
		return o;
	};

	var onlyInternalSymbols = function (obj) {
		return function (name) {
			return hOP.call(obj, internalSymbol) && hOP.call(obj[internalSymbol], '@@' + name);
		};
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(o) {
		return gOPN(o).filter(o === ObjectProto ? onlyInternalSymbols(o) : onlySymbols).map(sourceMap);
		}
	;

	descriptor.value = $defineProperty;
	objectDefineProperty(Object, DP, descriptor);

	descriptor.value = $getOwnPropertySymbols;
	objectDefineProperty(Object, GOPS, descriptor);

	descriptor.value = function getOwnPropertyNames(o) {
		return gOPN(o).filter(onlyNonSymbols);
	};
	objectDefineProperty(Object, GOPN, descriptor);

	descriptor.value = function defineProperties(o, descriptors) {
		var symbols = $getOwnPropertySymbols(descriptors);
		if (symbols.length) {
		objectKeys(descriptors).concat(symbols).forEach(function (uid) {
			if (propertyIsEnumerable.call(descriptors, uid)) {
			$defineProperty(o, uid, descriptors[uid]);
			}
		});
		} else {
		$defineProperties(o, descriptors);
		}
		return o;
	};
	objectDefineProperty(Object, DPies, descriptor);

	descriptor.value = propertyIsEnumerable;
	objectDefineProperty(ObjectProto, PIE, descriptor);

	descriptor.value = Symbol;
	objectDefineProperty(global, 'Symbol', descriptor);

	// defining `Symbol.for(key)`
	descriptor.value = function (key) {
		var uid = prefix.concat(prefix, key, random);
		return uid in ObjectProto ? source[uid] : setAndGetSymbol(uid);
	};
	objectDefineProperty(Symbol, 'for', descriptor);

	// defining `Symbol.keyFor(symbol)`
	descriptor.value = function (symbol) {
		if (onlyNonSymbols(symbol))
		throw new TypeError(symbol + ' is not a symbol');
		return hOP.call(source, symbol) ?
		symbol.slice(prefixLength * 2, -random.length) :
		void 0
		;
	};
	objectDefineProperty(Symbol, 'keyFor', descriptor);

	descriptor.value = function getOwnPropertyDescriptor(o, key) {
		var descriptor = gOPD(o, key);
		if (descriptor && onlySymbols(key)) {
		descriptor.enumerable = propertyIsEnumerable.call(o, key);
		}
		return descriptor;
	};
	objectDefineProperty(Object, GOPD, descriptor);

	descriptor.value = function create(proto, descriptors) {
		return arguments.length === 1 || typeof descriptors === "undefined" ?
		objectCreate(proto) :
		createWithSymbols(proto, descriptors);
	};

	objectDefineProperty(Object, 'create', descriptor);

	var strictModeSupported = (function(){ 'use strict'; return this; }).call(null) === null;
	if (strictModeSupported) {
		descriptor.value = function () {
			var str = toString.call(this);
			return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
		};
	} else {
		descriptor.value = function () {
			// https://github.com/Financial-Times/polyfill-library/issues/164#issuecomment-486965300
			// Polyfill.io this code is here for the situation where a browser does not
			// support strict mode and is executing `Object.prototype.toString.call(null)`.
			// This code ensures that we return the correct result in that situation however,
			// this code also introduces a bug where it will return the incorrect result for
			// `Object.prototype.toString.call(window)`. We can't have the correct result for
			// both `window` and `null`, so we have opted for `null` as we believe this is the more
			// common situation.
			if (this === window) {
				return '[object Null]';
			}

			var str = toString.call(this);
			return (str === '[object String]' && onlySymbols(this)) ? '[object Symbol]' : str;
		};
	}
	objectDefineProperty(ObjectProto, 'toString', descriptor);

	setDescriptor = function (o, key, descriptor) {
		var protoDescriptor = gOPD(ObjectProto, key);
		delete ObjectProto[key];
		objectDefineProperty(o, key, descriptor);
		if (o !== ObjectProto) {
			objectDefineProperty(ObjectProto, key, protoDescriptor);
		}
	};

	// The abstract operation thisSymbolValue(value) performs the following steps:
	function thisSymbolValue(value) {
		// 1. If Type(value) is Symbol, return value.
		if (Type(value) === "symbol") {
			return value;
		}
		// 2. If Type(value) is Object and value has a [[SymbolData]] internal slot, then
		// a. Let s be value.[[SymbolData]].
		// b. Assert: Type(s) is Symbol.
		// c. Return s.
		// 3. Throw a TypeError exception.
		throw TypeError(value + " is not a symbol");
	}

	// Symbol.prototype.description
	if (function () {
		// supports getters
		try {
			var a = {};
			Object.defineProperty(a, "t", {
				configurable: true,
				enumerable: false,
				get: function() {
					return true;
				},
				set: undefined
			});
			return !!a.t;
		} catch (e) {
			return false;
		}
	}()) {
		var getInferredName;
		try {
			// eslint-disable-next-line no-new-func
			getInferredName = Function("s", "var v = s.valueOf(); return { [v]() {} }[v].name;");
			// eslint-disable-next-line no-empty
		} catch (e) { }

		var inferred = function () { };
		var supportsInferredNames = getInferredName && inferred.name === "inferred" ? getInferredName : null;


		// 19.4.3.2 get Symbol.prototype.description
		Object.defineProperty(global.Symbol.prototype, "description", {
			configurable: true,
			enumerable: false,
			get: function () {
				// 1. Let s be the this value.
				var s = this;
				return symbolDescription(s);
			}
		});
	}

}(Object, 'getOwnPropertySymbols', self));

// Symbol.iterator
Object.defineProperty(self.Symbol, 'iterator', { value: self.Symbol('iterator') });

// Symbol.toStringTag
/* global Symbol */
Object.defineProperty(Symbol, 'toStringTag', {
	value: Symbol('toStringTag')
});

// Promise
/*
 Yaku v0.19.3
 (c) 2015 Yad Smood. http://ysmood.org
 License MIT
*/
/*
 Yaku v0.17.9
 (c) 2015 Yad Smood. http://ysmood.org
 License MIT
*/
(function () {
  'use strict';

  var $undefined
      , $null = null
      , isBrowser = typeof self === 'object'
      , root = self
      , nativePromise = root.Promise
      , process = root.process
      , console = root.console
      , isLongStackTrace = true
      , Arr = Array
      , Err = Error

      , $rejected = 1
      , $resolved = 2
      , $pending = 3

      , $Symbol = 'Symbol'
      , $iterator = 'iterator'
      , $species = 'species'
      , $speciesKey = $Symbol + '(' + $species + ')'
      , $return = 'return'

      , $unhandled = '_uh'
      , $promiseTrace = '_pt'
      , $settlerTrace = '_st'

      , $invalidThis = 'Invalid this'
      , $invalidArgument = 'Invalid argument'
      , $fromPrevious = '\nFrom previous '
      , $promiseCircularChain = 'Chaining cycle detected for promise'
      , $unhandledRejectionMsg = 'Uncaught (in promise)'
      , $rejectionHandled = 'rejectionHandled'
      , $unhandledRejection = 'unhandledRejection'

      , $tryCatchFn
      , $tryCatchThis
      , $tryErr = { e: $null }
      , $noop = function () {}
      , $cleanStackReg = /^.+\/node_modules\/yaku\/.+\n?/mg
  ;

  /**
   * This class follows the [Promises/A+](https://promisesaplus.com) and
   * [ES6](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects) spec
   * with some extra helpers.
   * @param  {Function} executor Function object with two arguments resolve, reject.
   * The first argument fulfills the promise, the second argument rejects it.
   * We can call these functions, once our operation is completed.
   */
  var Yaku = function (executor) {
      var self = this,
          err;

      // "this._s" is the internao state of: pending, resolved or rejected
      // "this._v" is the internal value

      if (!isObject(self) || self._s !== $undefined)
          throw genTypeError($invalidThis);

      self._s = $pending;

      if (isLongStackTrace) self[$promiseTrace] = genTraceInfo();

      if (executor !== $noop) {
          if (!isFunction(executor))
              throw genTypeError($invalidArgument);

          err = genTryCatcher(executor)(
              genSettler(self, $resolved),
              genSettler(self, $rejected)
          );

          if (err === $tryErr)
              settlePromise(self, $rejected, err.e);
      }
  };

  Yaku['default'] = Yaku;

  extend(Yaku.prototype, {
      /**
       * Appends fulfillment and rejection handlers to the promise,
       * and returns a new promise resolving to the return value of the called handler.
       * @param  {Function} onFulfilled Optional. Called when the Promise is resolved.
       * @param  {Function} onRejected  Optional. Called when the Promise is rejected.
       * @return {Yaku} It will return a new Yaku which will resolve or reject after
       * @example
       * the current Promise.
       * ```js
       * var Promise = require('yaku');
       * var p = Promise.resolve(10);
       *
       * p.then((v) => {
       *     console.log(v);
       * });
       * ```
       */
      then: function (onFulfilled, onRejected) {
          if (this._s === undefined) throw genTypeError();

          return addHandler(
              this,
              newCapablePromise(Yaku.speciesConstructor(this, Yaku)),
              onFulfilled,
              onRejected
          );
      },

      /**
       * The `catch()` method returns a Promise and deals with rejected cases only.
       * It behaves the same as calling `Promise.prototype.then(undefined, onRejected)`.
       * @param  {Function} onRejected A Function called when the Promise is rejected.
       * This function has one argument, the rejection reason.
       * @return {Yaku} A Promise that deals with rejected cases only.
       * @example
       * ```js
       * var Promise = require('yaku');
       * var p = Promise.reject(new Error("ERR"));
       *
       * p['catch']((v) => {
       *     console.log(v);
       * });
       * ```
       */
      'catch': function (onRejected) {
          return this.then($undefined, onRejected);
      },

      /**
       * Register a callback to be invoked when a promise is settled (either fulfilled or rejected).
       * Similar with the try-catch-finally, it's often used for cleanup.
       * @param  {Function} onFinally A Function called when the Promise is settled.
       * It will not receive any argument.
       * @return {Yaku} A Promise that will reject if onFinally throws an error or returns a rejected promise.
       * Else it will resolve previous promise's final state (either fulfilled or rejected).
       * @example
       * ```js
       * var Promise = require('yaku');
       * var p = Math.random() > 0.5 ? Promise.resolve() : Promise.reject();
       * p.finally(() => {
       *     console.log('finally');
       * });
       * ```
       */
      'finally': function (onFinally) {
          return this.then(function (val) {
              return Yaku.resolve(onFinally()).then(function () {
                  return val;
              });
          }, function (err) {
              return Yaku.resolve(onFinally()).then(function () {
                  throw err;
              });
          });
      },

      // The number of current promises that attach to this Yaku instance.
      _c: 0,

      // The parent Yaku.
      _p: $null
  });

  /**
   * The `Promise.resolve(value)` method returns a Promise object that is resolved with the given value.
   * If the value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable,
   * adopting its eventual state; otherwise the returned promise will be fulfilled with the value.
   * @param  {Any} value Argument to be resolved by this Promise.
   * Can also be a Promise or a thenable to resolve.
   * @return {Yaku}
   * @example
   * ```js
   * var Promise = require('yaku');
   * var p = Promise.resolve(10);
   * ```
   */
  Yaku.resolve = function (val) {
      return isYaku(val) ? val : settleWithX(newCapablePromise(this), val);
  };

  /**
   * The `Promise.reject(reason)` method returns a Promise object that is rejected with the given reason.
   * @param  {Any} reason Reason why this Promise rejected.
   * @return {Yaku}
   * @example
   * ```js
   * var Promise = require('yaku');
   * var p = Promise.reject(new Error("ERR"));
   * ```
   */
  Yaku.reject = function (reason) {
      return settlePromise(newCapablePromise(this), $rejected, reason);
  };

  /**
   * The `Promise.race(iterable)` method returns a promise that resolves or rejects
   * as soon as one of the promises in the iterable resolves or rejects,
   * with the value or reason from that promise.
   * @param  {iterable} iterable An iterable object, such as an Array.
   * @return {Yaku} The race function returns a Promise that is settled
   * the same way as the first passed promise to settle.
   * It resolves or rejects, whichever happens first.
   * @example
   * ```js
   * var Promise = require('yaku');
   * Promise.race([
   *     123,
   *     Promise.resolve(0)
   * ])
   * .then((value) => {
   *     console.log(value); // => 123
   * });
   * ```
   */
  Yaku.race = function (iterable) {
      var self = this
          , p = newCapablePromise(self)

          , resolve = function (val) {
              settlePromise(p, $resolved, val);
          }

          , reject = function (val) {
              settlePromise(p, $rejected, val);
          }

          , ret = genTryCatcher(each)(iterable, function (v) {
              self.resolve(v).then(resolve, reject);
          });

      if (ret === $tryErr) return self.reject(ret.e);

      return p;
  };

  /**
   * The `Promise.all(iterable)` method returns a promise that resolves when
   * all of the promises in the iterable argument have resolved.
   *
   * The result is passed as an array of values from all the promises.
   * If something passed in the iterable array is not a promise,
   * it's converted to one by Promise.resolve. If any of the passed in promises rejects,
   * the all Promise immediately rejects with the value of the promise that rejected,
   * discarding all the other promises whether or not they have resolved.
   * @param  {iterable} iterable An iterable object, such as an Array.
   * @return {Yaku}
   * @example
   * ```js
   * var Promise = require('yaku');
   * Promise.all([
   *     123,
   *     Promise.resolve(0)
   * ])
   * .then((values) => {
   *     console.log(values); // => [123, 0]
   * });
   * ```
   * @example
   * Use with iterable.
   * ```js
   * var Promise = require('yaku');
   * Promise.all((function * () {
   *     yield 10;
   *     yield new Promise(function (r) { setTimeout(r, 1000, "OK") });
   * })())
   * .then((values) => {
   *     console.log(values); // => [123, 0]
   * });
   * ```
   */
  Yaku.all = function (iterable) {
      var self = this
          , p1 = newCapablePromise(self)
          , res = []
          , ret
      ;

      function reject (reason) {
          settlePromise(p1, $rejected, reason);
      }

      ret = genTryCatcher(each)(iterable, function (item, i) {
          self.resolve(item).then(function (value) {
              res[i] = value;
              if (!--ret) settlePromise(p1, $resolved, res);
          }, reject);
      });

      if (ret === $tryErr) return self.reject(ret.e);

      if (!ret) settlePromise(p1, $resolved, []);

      return p1;
  };

  /**
   * The ES6 Symbol object that Yaku should use, by default it will use the
   * global one.
   * @type {Object}
   * @example
   * ```js
   * var core = require("core-js/library");
   * var Promise = require("yaku");
   * Promise.Symbol = core.Symbol;
   * ```
   */
  Yaku.Symbol = root[$Symbol] || {};

  // To support browsers that don't support `Object.defineProperty`.
  genTryCatcher(function () {
      Object.defineProperty(Yaku, getSpecies(), {
          get: function () { return this; }
      });
  })();

  /**
   * Use this api to custom the species behavior.
   * https://tc39.github.io/ecma262/#sec-speciesconstructor
   * @param {Any} O The current this object.
   * @param {Function} defaultConstructor
   */
  Yaku.speciesConstructor = function (O, D) {
      var C = O.constructor;

      return C ? (C[getSpecies()] || D) : D;
  };

  /**
   * Catch all possibly unhandled rejections. If you want to use specific
   * format to display the error stack, overwrite it.
   * If it is set, auto `console.error` unhandled rejection will be disabled.
   * @param {Any} reason The rejection reason.
   * @param {Yaku} p The promise that was rejected.
   * @example
   * ```js
   * var Promise = require('yaku');
   * Promise.unhandledRejection = (reason) => {
   *     console.error(reason);
   * };
   *
   * // The console will log an unhandled rejection error message.
   * Promise.reject('my reason');
   *
   * // The below won't log the unhandled rejection error message.
   * Promise.reject('v')["catch"](() => {});
   * ```
   */
  Yaku.unhandledRejection = function (reason, p) {
      console && console.error(
          $unhandledRejectionMsg,
          isLongStackTrace ? p.longStack : genStackInfo(reason, p)
      );
  };

  /**
   * Emitted whenever a Promise was rejected and an error handler was
   * attached to it (for example with `["catch"]()`) later than after an event loop turn.
   * @param {Any} reason The rejection reason.
   * @param {Yaku} p The promise that was rejected.
   */
  Yaku.rejectionHandled = $noop;

  /**
   * It is used to enable the long stack trace.
   * Once it is enabled, it can't be reverted.
   * While it is very helpful in development and testing environments,
   * it is not recommended to use it in production. It will slow down
   * application and eat up memory.
   * It will add an extra property `longStack` to the Error object.
   * @example
   * ```js
   * var Promise = require('yaku');
   * Promise.enableLongStackTrace();
   * Promise.reject(new Error("err"))["catch"]((err) => {
   *     console.log(err.longStack);
   * });
   * ```
   */
  Yaku.enableLongStackTrace = function () {
      isLongStackTrace = true;
  };

  /**
   * Only Node has `process.nextTick` function. For browser there are
   * so many ways to polyfill it. Yaku won't do it for you, instead you
   * can choose what you prefer. For example, this project
   * [next-tick](https://github.com/medikoo/next-tick).
   * By default, Yaku will use `process.nextTick` on Node, `setTimeout` on browser.
   * @type {Function}
   * @example
   * ```js
   * var Promise = require('yaku');
   * Promise.nextTick = require('next-tick');
   * ```
   * @example
   * You can even use sync resolution if you really know what you are doing.
   * ```js
   * var Promise = require('yaku');
   * Promise.nextTick = fn => fn();
   * ```
   */
  Yaku.nextTick = isBrowser ?
      function (fn) {
          nativePromise ?
              new nativePromise(function (resolve) { resolve(); }).then(fn) :
              setTimeout(fn);
      } :
      process.nextTick;

  // ********************** Private **********************

  Yaku._s = 1;

  /**
   * All static variable name will begin with `$`. Such as `$rejected`.
   * @private
   */

  // ******************************* Utils ********************************

  function getSpecies () {
      return Yaku[$Symbol][$species] || $speciesKey;
  }

  function extend (src, target) {
      for (var k in target) {
          src[k] = target[k];
      }
  }

  function isObject (obj) {
      return obj && typeof obj === 'object';
  }

  function isFunction (obj) {
      return typeof obj === 'function';
  }

  function isInstanceOf (a, b) {
      return a instanceof b;
  }

  function isError (obj) {
      return isInstanceOf(obj, Err);
  }

  function ensureType (obj, fn, msg) {
      if (!fn(obj)) throw genTypeError(msg);
  }

  /**
   * Wrap a function into a try-catch.
   * @private
   * @return {Any | $tryErr}
   */
  function tryCatcher () {
      try {
          return $tryCatchFn.apply($tryCatchThis, arguments);
      } catch (e) {
          $tryErr.e = e;
          return $tryErr;
      }
  }

  /**
   * Generate a try-catch wrapped function.
   * @private
   * @param  {Function} fn
   * @return {Function}
   */
  function genTryCatcher (fn, self) {
      $tryCatchFn = fn;
      $tryCatchThis = self;
      return tryCatcher;
  }

  /**
   * Generate a scheduler.
   * @private
   * @param  {Integer}  initQueueSize
   * @param  {Function} fn `(Yaku, Value) ->` The schedule handler.
   * @return {Function} `(Yaku, Value) ->` The scheduler.
   */
  function genScheduler (initQueueSize, fn) {
      /**
       * All async promise will be scheduled in
       * here, so that they can be execute on the next tick.
       * @private
       */
      var fnQueue = Arr(initQueueSize)
          , fnQueueLen = 0;

      /**
       * Run all queued functions.
       * @private
       */
      function flush () {
          var i = 0;
          while (i < fnQueueLen) {
              fn(fnQueue[i], fnQueue[i + 1]);
              fnQueue[i++] = $undefined;
              fnQueue[i++] = $undefined;
          }

          fnQueueLen = 0;
          if (fnQueue.length > initQueueSize) fnQueue.length = initQueueSize;
      }

      return function (v, arg) {
          fnQueue[fnQueueLen++] = v;
          fnQueue[fnQueueLen++] = arg;

          if (fnQueueLen === 2) Yaku.nextTick(flush);
      };
  }

  /**
   * Generate a iterator
   * @param  {Any} obj
   * @private
   * @return {Object || TypeError}
   */
  function each (iterable, fn) {
      var len
          , i = 0
          , iter
          , item
          , ret
      ;

      if (!iterable) throw genTypeError($invalidArgument);

      var gen = iterable[Yaku[$Symbol][$iterator]];
      if (isFunction(gen))
          iter = gen.call(iterable);
      else if (isFunction(iterable.next)) {
          iter = iterable;
      }
      else if (isInstanceOf(iterable, Arr)) {
          len = iterable.length;
          while (i < len) {
              fn(iterable[i], i++);
          }
          return i;
      } else
          throw genTypeError($invalidArgument);

      while (!(item = iter.next()).done) {
          ret = genTryCatcher(fn)(item.value, i++);
          if (ret === $tryErr) {
              isFunction(iter[$return]) && iter[$return]();
              throw ret.e;
          }
      }

      return i;
  }

  /**
   * Generate type error object.
   * @private
   * @param  {String} msg
   * @return {TypeError}
   */
  function genTypeError (msg) {
      return new TypeError(msg);
  }

  function genTraceInfo (noTitle) {
      return (noTitle ? '' : $fromPrevious) + new Err().stack;
  }


  // *************************** Promise Helpers ****************************

  /**
   * Resolve the value returned by onFulfilled or onRejected.
   * @private
   * @param {Yaku} p1
   * @param {Yaku} p2
   */
  var scheduleHandler = genScheduler(999, function (p1, p2) {
      var x, handler;

      // 2.2.2
      // 2.2.3
      handler = p1._s !== $rejected ? p2._onFulfilled : p2._onRejected;

      // 2.2.7.3
      // 2.2.7.4
      if (handler === $undefined) {
          settlePromise(p2, p1._s, p1._v);
          return;
      }

      // 2.2.7.1
      x = genTryCatcher(callHanler)(handler, p1._v);
      if (x === $tryErr) {
          // 2.2.7.2
          settlePromise(p2, $rejected, x.e);
          return;
      }

      settleWithX(p2, x);
  });

  var scheduleUnhandledRejection = genScheduler(9, function (p) {
      if (!hashOnRejected(p)) {
          p[$unhandled] = 1;
          emitEvent($unhandledRejection, p);
      }
  });

  function emitEvent (name, p) {
      var browserEventName = 'on' + name.toLowerCase()
          , browserHandler = root[browserEventName];

      if (process && process.listeners(name).length)
          name === $unhandledRejection ?
              process.emit(name, p._v, p) : process.emit(name, p);
      else if (browserHandler)
          browserHandler({ reason: p._v, promise: p });
      else
          Yaku[name](p._v, p);
  }

  function isYaku (val) { return val && val._s; }

  function newCapablePromise (Constructor) {
      if (isYaku(Constructor)) return new Constructor($noop);

      var p, r, j;
      p = new Constructor(function (resolve, reject) {
          if (p) throw genTypeError();

          r = resolve;
          j = reject;
      });

      ensureType(r, isFunction);
      ensureType(j, isFunction);

      return p;
  }

  /**
   * It will produce a settlePromise function to user.
   * Such as the resolve and reject in this `new Yaku (resolve, reject) ->`.
   * @private
   * @param  {Yaku} self
   * @param  {Integer} state The value is one of `$pending`, `$resolved` or `$rejected`.
   * @return {Function} `(value) -> undefined` A resolve or reject function.
   */
  function genSettler (self, state) {
      var isCalled = false;
      return function (value) {
          if (isCalled) return;
          isCalled = true;

          if (isLongStackTrace)
              self[$settlerTrace] = genTraceInfo(true);

          if (state === $resolved)
              settleWithX(self, value);
          else
              settlePromise(self, state, value);
      };
  }

  /**
   * Link the promise1 to the promise2.
   * @private
   * @param {Yaku} p1
   * @param {Yaku} p2
   * @param {Function} onFulfilled
   * @param {Function} onRejected
   */
  function addHandler (p1, p2, onFulfilled, onRejected) {
      // 2.2.1
      if (isFunction(onFulfilled))
          p2._onFulfilled = onFulfilled;
      if (isFunction(onRejected)) {
          if (p1[$unhandled]) emitEvent($rejectionHandled, p1);

          p2._onRejected = onRejected;
      }

      if (isLongStackTrace) p2._p = p1;
      p1[p1._c++] = p2;

      // 2.2.6
      if (p1._s !== $pending)
          scheduleHandler(p1, p2);

      // 2.2.7
      return p2;
  }

  // iterate tree
  function hashOnRejected (node) {
      // A node shouldn't be checked twice.
      if (node._umark)
          return true;
      else
          node._umark = true;

      var i = 0
          , len = node._c
          , child;

      while (i < len) {
          child = node[i++];
          if (child._onRejected || hashOnRejected(child)) return true;
      }
  }

  function genStackInfo (reason, p) {
      var stackInfo = [];

      function push (trace) {
          return stackInfo.push(trace.replace(/^\s+|\s+$/g, ''));
      }

      if (isLongStackTrace) {
          if (p[$settlerTrace])
              push(p[$settlerTrace]);

          // Hope you guys could understand how the back trace works.
          // We only have to iterate through the tree from the bottom to root.
          (function iter (node) {
              if (node && $promiseTrace in node) {
                  iter(node._next);
                  push(node[$promiseTrace] + '');
                  iter(node._p);
              }
          })(p);
      }

      return (reason && reason.stack ? reason.stack : reason) +
          ('\n' + stackInfo.join('\n')).replace($cleanStackReg, '');
  }

  function callHanler (handler, value) {
      // 2.2.5
      return handler(value);
  }

  /**
   * Resolve or reject a promise.
   * @private
   * @param  {Yaku} p
   * @param  {Integer} state
   * @param  {Any} value
   */
  function settlePromise (p, state, value) {
      var i = 0
          , len = p._c;

      // 2.1.2
      // 2.1.3
      if (p._s === $pending) {
          // 2.1.1.1
          p._s = state;
          p._v = value;

          if (state === $rejected) {
              if (isLongStackTrace && isError(value)) {
                  value.longStack = genStackInfo(value, p);
              }

              scheduleUnhandledRejection(p);
          }

          // 2.2.4
          while (i < len) {
              scheduleHandler(p, p[i++]);
          }
      }

      return p;
  }

  /**
   * Resolve or reject promise with value x. The x can also be a thenable.
   * @private
   * @param {Yaku} p
   * @param {Any | Thenable} x A normal value or a thenable.
   */
  function settleWithX (p, x) {
      // 2.3.1
      if (x === p && x) {
          settlePromise(p, $rejected, genTypeError($promiseCircularChain));
          return p;
      }

      // 2.3.2
      // 2.3.3
      if (x !== $null && (isFunction(x) || isObject(x))) {
          // 2.3.2.1
          var xthen = genTryCatcher(getThen)(x);

          if (xthen === $tryErr) {
              // 2.3.3.2
              settlePromise(p, $rejected, xthen.e);
              return p;
          }

          if (isFunction(xthen)) {
              if (isLongStackTrace && isYaku(x))
                  p._next = x;

              // Fix https://bugs.chromium.org/p/v8/issues/detail?id=4162
              if (isYaku(x))
                  settleXthen(p, x, xthen);
              else
                  Yaku.nextTick(function () {
                      settleXthen(p, x, xthen);
                  });
          } else
              // 2.3.3.4
              settlePromise(p, $resolved, x);
      } else
          // 2.3.4
          settlePromise(p, $resolved, x);

      return p;
  }

  /**
   * Try to get a promise's then method.
   * @private
   * @param  {Thenable} x
   * @return {Function}
   */
  function getThen (x) { return x.then; }

  /**
   * Resolve then with its promise.
   * @private
   * @param  {Yaku} p
   * @param  {Thenable} x
   * @param  {Function} xthen
   */
  function settleXthen (p, x, xthen) {
      // 2.3.3.3
      var err = genTryCatcher(xthen, x)(function (y) {
          // 2.3.3.3.3
          // 2.3.3.3.1
          x && (x = $null, settleWithX(p, y));
      }, function (r) {
          // 2.3.3.3.3
          // 2.3.3.3.2
          x && (x = $null, settlePromise(p, $rejected, r));
      });

      // 2.3.3.3.4.1
      if (err === $tryErr && x) {
          // 2.3.3.3.4.2
          settlePromise(p, $rejected, err.e);
          x = $null;
      }
  }

  root.Promise = Yaku;
})();

// fetch
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.WHATWGFetch = {})));
}(this, (function (exports) { 'use strict';

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob:
      'FileReader' in self &&
      'Blob' in self &&
      (function() {
        try {
          new Blob();
          return true
        } catch (e) {
          return false
        }
      })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  function isDataView(obj) {
    return obj && DataView.prototype.isPrototypeOf(obj)
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isArrayBufferView =
      ArrayBuffer.isView ||
      function(obj) {
        return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
      };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue + ', ' + value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push(name);
    });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) {
      items.push(value);
    });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) {
      items.push([name, value]);
    });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        this._bodyText = body = Object.prototype.toString.call(body);
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return methods.indexOf(upcased) > -1 ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      this.signal = input.signal;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'same-origin';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.signal = options.signal || this.signal;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, {body: this._bodyInit})
  };

  function decode(body) {
    var form = new FormData();
    body
      .trim()
      .split('&')
      .forEach(function(bytes) {
        if (bytes) {
          var split = bytes.split('=');
          var name = split.shift().replace(/\+/g, ' ');
          var value = split.join('=').replace(/\+/g, ' ');
          form.append(decodeURIComponent(name), decodeURIComponent(value));
        }
      });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ');
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = options.status === undefined ? 200 : options.status;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  exports.DOMException = self.DOMException;
  try {
    new exports.DOMException();
  } catch (err) {
    exports.DOMException = function(message, name) {
      this.message = message;
      this.name = name;
      var error = Error(message);
      this.stack = error.stack;
    };
    exports.DOMException.prototype = Object.create(Error.prototype);
    exports.DOMException.prototype.constructor = exports.DOMException;
  }

  function fetch(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);

      if (request.signal && request.signal.aborted) {
        return reject(new exports.DOMException('Aborted', 'AbortError'))
      }

      var xhr = new XMLHttpRequest();

      function abortXhr() {
        xhr.abort();
      }

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.onabort = function() {
        reject(new exports.DOMException('Aborted', 'AbortError'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      if (request.signal) {
        request.signal.addEventListener('abort', abortXhr);

        xhr.onreadystatechange = function() {
          // DONE (success or failure)
          if (xhr.readyState === 4) {
            request.signal.removeEventListener('abort', abortXhr);
          }
        };
      }

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  }

  fetch.polyfill = true;

  self.fetch = fetch;
  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  exports.Headers = Headers;
  exports.Request = Request;
  exports.Response = Response;
  exports.fetch = fetch;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
})
('object' === typeof window && window || 'object' === typeof self && self || 'object' === typeof global && global || {});
