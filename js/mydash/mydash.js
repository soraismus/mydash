define ([], function () {

	var _ = {};

	var i, fns, len, types;

	var breaker = {};

	// native js:
	// isFinite, isNaN, keys, parseInt, parseFloat, values

	var
	  ArrayProto = Array.prototype,
		ObjProto   = Object.prototype,
		FuncProto  = Function.prototype;

  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  var
		aryMsg  = 'Invalid array',
		boolMsg = 'Invalid boolean',
		fnMsg   = 'Invalid function',
		fullMsg = 'Invalid empty array or object',
		idxMsg  = 'Invalid key or index',
	  intMsg  = 'Invalid integer',
		nbrMsg  = 'Invalid number',
		objMsg  = 'Invalid object',
		strMsg  = 'Invalid string';

	var controlGuard = function () {
		var
	    set = true,

			vow = (condition) => function (msg) {
				if (set) {
					if (! _.isBoolean (condition)) {
						throw new Error (boolMsg);
					}
					if (! _.isString (msg)) {
						throw new Error (strMsg);
					}
					if (! condition) {
						throw new Error (msg);
					}
				}
			},

			isGuardSet = () => set,

			restoreGuard = () => (set = true),

			setGuard = function (state) {
				if (set && ! _.isBoolean (state)) {
					throwTypeError (boolMsg);
				}
				set = state;
				return set;
			},

			toggleGuard = function () {
				set = ! set;
				return set;
			};
    
    return [vow, isGuardSet, restoreGuard, setGuard, toggleGuard];
	};

	[_.vow, _.isGuardSet, _.restoreGuard, _.setGuard, _.toggleGuard] = controlGuard ();

	_.isArguments = (val) => toString.call (val) == '[object Arguments]';
	_.isDate = (val) => toString.call (val) == '[object Date]';
	_.isNumber = (val) => toString.call (val) == '[object Number]';
	_.isRegExp = (val) => toString.call (val) == '[object RegExp]';
	_.isString = (val) => toString.call (val) == '[object String]';

	if (! _.isArguments (arguments)) {
		_.isArguments = (val) => !! (val && _.has ('callee', val));
	}

	_.isFunction = (val) => toString.call (val) == '[object Function]';
  if (typeof (/./) !== 'function') {
    _.isFunction = function (val) {
      return typeof val === 'function';
    };
  }

	_.at = (idx) => function (val) {
		_.vowInt (idx)
		_.vowObj (val);
		return _.defined (val.length) ?
			val [idx] :
			val [(_.keys (val)) [idx]];
	};

	// for trampolining thunks
	_.call = (fn) => _.vowFn (fn) ();

	_.callOn = (arg) => (fn) => _.vowFn (fn) (arg);

	_.cascade = function (ary) {
		_.vowAry (ary);
		_.vowFull (ary);
		var fn = _.vowFn (ary.shift ());
		return _.reduceWith (fn) ((memo) => (i) => _.vowFn (memo) (i)) (ary);
	};

	_.constant = (val) => () => val;

	_.defined = (val) => ! _.vacant (val);

	_.each = (itr) => function (val) {
		_.vowFn (itr);
		_.vowObj (val);
		var i = 0, len = length (val), valAt = atOn (val);
		for (; i < len; i++) {
			if (itr (valAt (i)) === breaker) {
				return;
			}
		}
	};

	_.empty = (val) => _.length (_.vowObj (val)) === 0;

	_.finite = (val) => _.isFinite (val) && ! _.isNaN (parseFloat (val));

	_.flip = (fn) => (arg1) => (arg2) => fn (arg2) (arg1);

	_.full = (val) => ! _.empty (val);

	_.has = (key) => (obj) => hasOwnProperty.call (_.vowObj (obj), _.vowIdx (key));
	
	_.identity = (val) => val;

	_.isArray = (val) => nativeIsArray (val) || toString.call (val) == '[object Array]';

	_.isBoolean = (val) => (val === true ||
			val === false || toString.call (val) == '[object Boolean]');

	// NOT TESTED
	_.isElement = (val) => !! (val && val.nodeType === 1);

	_.isFinite = (val) => isFinite (val) && ! _.isNaN (parseFloat (val));

	_.isHash = (val) => _.isObject (val) && ! (
			_.isArray (val) || _.isFunction (val) || _.isRegExp (val) ||
			_.isDate (val) || _.isString (val));

	_.isIndex = (val) => _.isInteger (val) || _.isString (val);

	_.isInteger = (val) => _.isNumber (val) && val === (val >>> 0);

	_.isNaN = (val) => _.isNumber (val) && val != +val;

	_.isNull = (val) => val === null;

	_.isObject = (val) => val === Object (val);

	_.isUndefined = (val) => val === void 0;

	_.keys = (obj) => Object.keys (_.vowObj (obj));

	_.length = (val) => _.isArray (val) ? val.length : (_.keys (_.vowObj (val))).length;

	_.reduceWith = (memo) => (itr) => function (val) {
		_.vowFn (itr);
		_.vowObj (val);
		var i = 0, len = _.length (val), valAt = _.atOn (val);
		for (; i < len; i++) {
			memo = itr (memo) (valAt (i));
		};
		return memo;
	};

	_.thunk = (fn) => (val) => () => _.vowFn (fn) (val);

	_.value = {};

	_.thunkUp = function (fn) {
		var arg = fn, store = [];
		function helper (val) {
			if (val === _.value) {
				return () => _.cascade (store);
			} else {
				store.push (arg);
				arg = val;
				return helper;
			}
		};
		return helper;
	};

	_.throwError = function (msg) {
		throw new Error (msg);
	};

	_.throwTypeError = function (msg) {
		throw new TypeError (msg);
	};

	_.vacant = (val) => _.isNull (val) || _.isUndefined (val) || _.isNaN (val);

	_.vowWith = (pred) => (msg) => function (val) {
		_.vow (_.isFunction (pred)) (fnMsg);
		_.vow (pred (val)) (msg);
		return val;
	};

	// derivative functions
	// --------------------

	_.atOn = _.flip (_.at);
	
	_.vowAry = _.vowWith (_.isArray) (aryMsg);

	_.vowBool = _.vowWith (_.isBoolean) (boolMsg);

	_.vowFn = _.vowWith (_.isFunction) (fnMsg);

	_.vowFull = _.vowWith (_.full) (fullMsg);

	_.vowIdx = _.vowWith (_.isIndex) (idxMsg);

	_.vowInt = _.vowWith (_.isInteger) (intMsg);

	_.vowNbr = _.vowWith (_.isNumber) (nbrMsg);

	_.vowObj = _.vowWith (_.isObject) (objMsg);

	_.vowStr = _.vowWith (_.isString) (strMsg);

	return _;

});

