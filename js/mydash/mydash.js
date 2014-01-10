define ([], function () {

	var _ = {};

	var i, fns, len, types;

	var breaker = {};

	_.stop = {};

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

	var StrProto = String.prototype;

	var
		nativeCharAt = StrProto.charAt,
		nativeConcat = StrProto.concat,
		nativeContains = StrProto.contains,
		nativeEndsWith = StrProto.endsWith,
		nativeIndexOf = StrProto.indexOf,
		nativeLastIndexOf = StrProto.lastIndexOf,
		nativeMatch = StrProto.match,
		nativeRepeat = StrProto.repeat,
		nativeReplace = StrProto.replace,
		nativeSearch = StrProto.search,
		nativeSlice = StrProto.slice,
		nativeSplit = StrProto.split,
		nativeStartsWith = StrProto.startsWith,
		nativeSubstr = StrProto.substr,
		nativeSubstring = StrProto.substring,
		nativeToLowerCase = StrProto.toLowerCase,
		nativeToUpperCase = StrProto.toUpperCase,
		nativeTrim = StrProto.trim;

	var RegExpProto = RegExp.prototype;

	var
		nativeExec = RegExpProto.exec,
		nativeTest = RegExpProto.test;

  var
		aryMsg  = 'Invalid array',
		boolMsg = 'Invalid boolean',
		equalLengthMsg = 'Arrays should have equal length',
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

	var assign = (obj) => (key) => function (attr) {
		obj [_.vowIdx (key)] = attr;
		return obj;
	};

	_.at = (idx) => function (val) {
		_.vowInt (idx)
		_.vowObj (val);
		return _.defined (val.length) ?
			val [idx] :
			val [(_.keys (val)) [idx]];
	};

	_.breakAtValue = (fn) => function (v) {
		var arg = v, store = [];
		function helper (val) {
			if (val === _.stop) {
				store.push (arg);
				return _.vowFn (fn) (store);
			} else {
				store.push (arg);
				arg = val;
				return helper;
			}
		};
		return helper;
	};

	// aliases
	_.call = _.cascade = (ary) => _.reduceWith (_.vowFn (ary.shift ())) (_.call2) (ary);

	// for trampolining thunks
	_.call1 = (fn) => _.vowFn (fn) ();

	// aliases
	_.call2 = _.compose1 = _.pipe1 = (fn) => (val) => _.vowFn (fn) (val);

	_.callOn = (arg) => (fn) => _.vowFn (fn) (arg);

	_.compose = (fns) => (val) => _.rreduceWith (val) (_.callOn) (fns);

	// aliases
	_.compose2 = _.embed = _.rassoc = (fn1) => (fn2) => (val) => vowFn (fn1) (vowFn (fn2) (val));

	_.constant = (val) => () => val;

	_.copy = function (val) {
		(_.vow (! _.isObject (val) || _.isArray (val) || _.isHash (val))
		 ('Only arrays and generic objects are permissible'));

		var i, len, result;

		if (! _.isObject (val)) {
			return val;
		}

		if (_.isArray (val)) {
			i = 0; len = val.length; result = [];
			for (; i < len; i++) {
				result.push (_.copy (val [i]));
			}
			return result;
		}

		result = {};
		for (i in val) {
			if (_.has (i) (val)) {
				result [i] = _.copy (val [i]);
			}
		}
		return result;
	};

	_.defined = (val) => ! _.vacant (val);

	_.each = (itr) => function (val) {
		_.vowFn (itr);
		_.vowObj (val);
		var i = 0, len = _.length (val), valAt = _.atOn (val);
		for (; i < len; i++) {
			if (itr (valAt (i)) === breaker) {
				return;
			}
		}
	};

	_.empty = (val) => _.length (_.vowObj (val)) === 0;

	_.finite = (val) => _.isFinite (val) && ! _.isNaN (parseFloat (val));

	_.first = (ary) => (_.vowAry (ary)) [0];

	_.flip = (fn) => (arg1) => (arg2) => fn (arg2) (arg1);

	_.full = (val) => ! _.empty (val);

	_.has = (key) => (obj) => hasOwnProperty.call (_.vowObj (obj), _.vowIdx (key));
	
	_.identity = (val) => val;

	_.ift = (condition) => (then) => _.vowBool (condition) ? then : undefined;
	
	_.ifte = (condition) => (then) => (els) => _.vowBool (condition) ? then : els;

	_.insert = (addendum) => (idx) => function (ary) {
		var i = 0, len = (_.vowAry (ary)).length,
				result = new Array (len + 1);
		result [idx] = addendum;
		for (i; i < idx; i++) {
			result [i] = _.copy (ary [i]);
		}
		for (i = idx + 1; i <= len; i++) {
			result [i] = _.copy (ary [i - 1]);
		}
		return result;
	};

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

	_.last = (ary) => (_.vowAry (ary)) [ary.length - 1];

	_.length = (val) => _.isArray (val) ? val.length : (_.keys (_.vowObj (val))).length;

	_.map = (itr) => function (val) {
		_.vowFn (itr);
		var i = 0, len = _.length (val), results = [], valAt = _.atOn (val);
		for (; i < len; i++) {
			results.push (itr (valAt (i)));
		}
		return results;
	};

	_.pipe = (fns) => (val) => _.reduceWith (val) (_.callOn) (fns);

	_.pipe2 = (fn1) => (fn2) => (val) => _.vowFn (fn2) (_.vowFn (fn1) (val));

	_.pop = function (ary) {
		var result = _.copy (_.vowAry (ary));
		result.pop ();
		return result;
	};

	_.push = (val) => function (ary) {
		var result = _.copy (_.vowAry (ary));
		result.push (val);
		return result;
	};

	_.put = (addendum) => (key) => function (val) {
		var result = _.copy (_.vowObj (val));
		var check = _.isGuardSet () ?
			(_.isArray (val) ? _.vowInt : _.vowStr) :
			_.identity;
		var idx = _.copy (check (key));
		result [idx] = addendum;
		return result;
	};

	_.reduceWith = (memo) => (itr) => function (ary) {
		_.vowFn (itr);
		var i = 0, len = (_.vowAry (ary)).length, result = memo;
		for (; i < len; i++) {
			result = itr (result) (ary [i]);
		};
		return result;
	};

	_.rreduceWith = (memo) => (itr) => function (ary) {
		_.vowFn (itr);
		var i = (_.vowAry (ary)).length, result = memo;
		for (; i--; ) {
			result = itr (result) (ary [i]);
		}
		return result;
	};

	_.throwError = function (msg) {
		throw new Error (msg);
	};

	_.throwTypeError = function (msg) {
		throw new TypeError (msg);
	};

	_.thunk = (vals) => () => _.reduceWith (_.vowFn (vals.shift ())) (_.call2) (vals);

	_.thunk1 = _.receive = _.store = _.fpush = (val) => () => val;

	// aliases
	_.thunk2 = _.defer = (fn) => (val) => () => _.vowFn (fn) (val);

	_.vacant = (val) => _.isNull (val) || _.isUndefined (val) || _.isNaN (val);

	_.vowWith = (pred) => (msg) => function (val) {
		_.vow (_.isFunction (pred)) (fnMsg);
		_.vow (pred (val)) (msg);
		return val;
	};

	_.reduceWith = (memo) => (itr) => function (ary) {
		_.vowFn (itr);
		var i = 0, len = (_.vowAry (ary)).length, result = memo;
		for (; i < len; i++) {
			result = itr (result) (ary [i]);
		};
		return result;
	};

	// aliases
	_.zip = _.zipEach = (itr) => (ary1) => function (ary2) {
		_.vowFn (itr);
		var i = 0,
				len1 = (_.vowAry (ary1)).length,
				len2 = (_.vowAry (ary2)).length;
		_.vow (len1 === len2) (equalLengthMsg);
		for (; i < len1; i++) {
			if (itr (ary1 [i]) (ary2 [i]) === breaker) {
				return
			}
		}
	};

	_.zipReduceWith = (memo) => (itr) => (ary1) => function (ary2) {
		_.vowFn (itr);
		var i = 0,
				len1 = (_.vowAry (ary1)).length,
				len2 = (_.vowAry (ary2)).length,
				result = memo;
		_.vow (len1 === len2) (equalLengthMsg);
		for (; i < len1; i++) {
			result = itr (result) (ary1 [i]) (ary2 [i]);
		}
		return result;
	};

	// derivative functions
	// --------------------

	_.atOn = _.flip (_.at);

	_.composeDown = _.breakAtValue (_.compose);

	_.pipeDown = _.breakAtValue (_.pipe);

	_.thunkDown = _.breakAtValue (_.thunk2 (_.call));
	
	_.vowAry = _.vowWith (_.isArray) (aryMsg);

	_.vowBool = _.vowWith (_.isBoolean) (boolMsg);

	_.vowFn = _.vowWith (_.isFunction) (fnMsg);

	_.vowFull = _.vowWith (_.full) (fullMsg);

	_.vowIdx = _.vowWith (_.isIndex) (idxMsg);

	_.vowInt = _.vowWith (_.isInteger) (intMsg);

	_.vowNbr = _.vowWith (_.isNumber) (nbrMsg);

	_.vowObj = _.vowWith (_.isObject) (objMsg);

	_.vowStr = _.vowWith (_.isString) (strMsg);

	_.zipAssign = _.zipReduceWith ({}) (assign);

	return _;

});

