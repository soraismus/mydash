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

	// low-level math ops may be faster than call to Math methods
	var
		//nativeAbs = Math.abs,
		nativeCeil = Math.ceil,
		nativeFloor = Math.floor,
		nativeFround = Math.fround,
		nativeMax = Math.max,
		nativeMin = Math.min,
		nativePow = Math.pow,
		nativeRandom = Math.random,
		nativeRound = Math.round,
		nativeTrunc = Math.trunc; // harmony

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
		posMsg  = 'Invalid positive number';
		nnegMsg  = 'Invalid non-negative number';
		strMsg  = 'Invalid string';

	var controlAlias = function () {
		var
			aliases = [],
			fnNames = [],
			alias = (orig) => function (akas) {
				aliases.push (akas);
				fnNames.push (orig);
			},
			set = (orig) => (aka) => _ [aka] = _ [orig],
			//setAliases = () => _.zipCallThru (_.map (set) (fnNames)) (aliases);
			setAliases = () => _.zipMap (_.map (set) (fnNames)) (aliases);

		return [alias, setAliases];
	};

	var [alias, setAliases] = controlAlias ();
	var combinator = alias;
	var bird = alias;

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

	_.abs = (nbr) => _.vowNbr (nbr) < 0 ? (-nbr) : nbr;

	_.and = (ary) => function (val) {
		var result = true;
		var br = _.breakIfFalse;
		var itr = (pred) => br (_.vowBool ((result = _.vowFn (pred) (val))));
		_.each (itr) (_.vowAry (ary));
		return result;
	};

	_.asPred = (val) => (i) => i === val;

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

	_.breakDown = (fn) => function (v) {
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

	_.breakIf = (pred) => (val) => _.vowBool (_.vowFn (pred) (val)) ? breaker : undefined;

	// monad ??
	// => (_.vowAry (results)) [_.brkEach (FN) (MONAD) (_.vowAry (conditions))];
	// FN = _.identity; MONAD = _.identity closed over an incrementing variable
	// a default result?
	// _.if = ... [like _.true]
	_.iff = (conditions) => function (results) {
		var i = -1;
		// this might be an example of a monad pattern
		var itr = function (val) {
			i++;
			return val;
		};
		_.brkEach (_.identity) (itr) (_.vowAry (conditions));
		return (_.vowAry (results)) [i];
	};

	_.iffIs = (vals) => (results) => _.iffWith (_.map (_.asPred) (_.vowAry (vals))) (_.vowAry (results));

	_.iffWith = (predicates) => (results) => function (val) {
		var i = -1;
		var itr = function (val) {
			i++;
			return val;
		};
		_.brkEach (_.callOn (val)) (itr) (_.vowAry (predicates));
		return (_.vowAry (results)) [i];
	};

	_.brkEach = (pred) => (itr) => function (val) {
		_.vowFn (itr);
		var result, br = _.breakIf (_.vowFn (pred));
		var itr2 = (val) => br ( (result = itr (val)) );
		_.each (itr2) (val);
		return result;
	};

	_.brkReduceWith = (pred) => (memo) => (itr) => function (ary) {
		var result = memo, br = _.breakIf (_.vowFn (pred));
		var itr2 = (val) => br ( (result = _.vowFn (itr) (result) (val)) );
		_.each (itr2) (ary);
		return result;
	};

	alias ('call') ('cascade');
	_.call = (ary) => _.reduceWith (_.vowFn (ary.shift ())) (_.call2) (ary);

	// for trampolining thunks
	_.call1 = (fn) => _.vowFn (fn) ();

	alias ('call2') ('compose1');
	alias ('call2') ('pipe1');
	combinator ('call2') ('I$'); // I* combinator
	//_.call2 = _.compose1 = _.pipe1 = (fn) => (val) => _.vowFn (fn) (val);
	_.call2 = (fn) => (val) => _.vowFn (fn) (val);

	// identity twice removed
	combinator ('call3') ('I$$');
	_.call3 = (v1) => (v2) => (v3) => _.call ([v1, v2, v3]);

	bird ('callOn') ('thrush');
	combinator ('callOn') ('T');
	_.callOn = (arg) => (fn) => _.vowFn (fn) (arg);

	_.charAt = (idx) => (str) => nativeCharAt.call (_.vowStr (str), _.vowInt (idx));

	_.compose = (fns) => (val) => _.rreduceWith (val) (_.callOn) (fns);

	alias ('compose2') ('embed');
	alias ('compose2') ('embed1');
	alias ('compose2') ('rassoc');
	bird ('compose2') ('bluebird');
	combinator ('compose2') ('B');
	_.compose2 = (fn1) => (fn2) => (val) => _.vowFn (fn1) (_.vowFn (fn2) (val));

	bird ('compose3') ('becard');
	combinator ('compose3') ('B3');
	_.compose3 = (fn1) => (fn2) => (fn3) => (val) => _.compose ([fn1, fn2, fn3]) (val);

	_.concat = (ary) => _.reduceWith ('') (_.concat2) (_.vowAry (ary));

	_.concat2 = (str1) => (str2) => StrProto.concat (_.vowStr (str1), _.vowStr (str2));

	_.constant = (val) => () => val;

	_.contains = (tgt) => function (val) {
		return nativeIndexOf && (_.vowObj (val)).indexOf === nativeIndexOf ?
			val.indexOf (tgt) != -1 :
			_.any ((i) => i === tgt) (val);
	};

	alias ('containsAll') ('containsBoth');
	_.containsAll = (ary) => (val) => _.all (_.containsOn (val)) (ary);

	alias ('containsAny') ('containsSome');
	alias ('containsAny') ('containsEither');
	_.containsAny = (ary) => (val) => _.any (_.containsOn (val)) (ary);

	_.copy = function (val) {
		(_.vow (_.or ([_.not (_.isObject), _.isArray, _.isHash, _.isFunction]) (val))
		 ('Only arrays and generic objects are permissible'));

		var i, len, result;

		if (! _.isObject (val) || _.isFunction (val)) {
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

	_.crossMap = (itrs) => function (val) {
		_.vowObj (val);
		var i = 0, len = (_.vowAry (itrs)).length, result = [];
		for (; i < len; i++) {
			result.push (_.map (_.vowFn (itrs [i])) (val));
		}
		return result;
	};

	_.decr = (intg) => _.vowInt (intg) - 1;

	_.defined = (val) => ! _.vacant (val);

	alias ('do') ('eachOnto');
	_.do = _.eachOnto = (fns) => function (val) {
		_.vowAry (fns);
		var i = 0, len = (_.vowAry (fns)).length;
		for (; i < len - 1; i++) {
		  _.vowFn (fns [i]) (val);
		}
		return _.vowFn (fns [len - 1]) (val);
	};

	_.do2 = (fn1) => (fn2) => function (val) {
		_.vowFn (fn1) (val);
		return _.vowFn (fn2) (val);
	};

	_.replace = (fn) => (idx) => (ary) => _.put (_.vowFn (fn) ((_.vowAry (ary)) [_.vowInt (idx)])) (idx) (ary);

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

	// exclusive-between
	_.eBtw = (lb) => (ub) => (nbr) => _.vowNbr (nbr) > lb && nbr < ub;

	bird ('embed2') ('dove');
	combinator ('embed2') ('D');
	_.embed2 = (fn1) => (val1) => (fn3) => (val4) => _.vowFn (_.vowFn (fn1) (val1)) (_.vowFn (fn3) (val4));

	bird ('embed3') ('dickcissel');
	combinator ('embed3') ('D1');
	_.embed3 = (v1) => (v2) => (v3) => (v4) => (v5) => _.call ([v1, v2, v3, v4 (v5)]);

	_.empty = (val) => _.length (_.vowObj (val)) === 0;

	_.equiv = (ary) => _.all (_.asPred (_.first ((ary)))) (ary);

	_.equiv2 = (i) => (j) => i === j;

	_.finite = (val) => _.isFinite (val) && ! _.isNaN (parseFloat (val));

	alias ('first') ('head');
	_.first = (ary) => (_.vowAry (ary)) [0];

	bird ('flip') ('cardinal');
	combinator ('flip') ('C');
	_.flip = (fn) => (arg1) => (arg2) => fn (arg2) (arg1);

	_.floor = (nbr) => Math.floor (_.vowNbr (nbr));

	_.full = (val) => ! _.empty (val);

	// str if hash; int if array.
	_.get = (key) => (val) => (_.vowObj (val)) [_.vowIdx (key)];

	_.greplace = (substr) => (pattern) => (str) => StrProto.replace.call (_.vowStr (str),  _.vowStr (substr), _.vowStr (pattern), 'g');

	_.has = (key) => (obj) => hasOwnProperty.call (_.vowObj (obj), _.vowIdx (key));

	// inclusive-between
	_.iBtw = (lb) => (ub) => (nbr) => _.vowNbr (nbr) >= lb && nbr <= ub;
	
	combinator ('identity') ('I');
	_.identity = (val) => val;

	_.ift = (condition) => (then) => _.vowBool (condition) ? then : undefined;
	
	_.ifte = (condition) => (then) => (els) => _.vowBool (condition) ? then : els;

	_.incr = (intg) => _.vowInt (intg) + 1;

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

	_.interject = (fns) => _.do (_.push (_.identity) (fns));

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

	_.isLC = (str) => _.matches ('[a-z]+') (_.vowStr (str));

	_.isNaN = (val) => _.isNumber (val) && val != +val;

	_.isNull = (val) => val === null;

	_.isObject = (val) => val === Object (val);

	_.isNonNegative = (nbr) => _.vowNbr (nbr) >= 0;

	_.isPositive = (nbr) => _.vowNbr (nbr) > 0;

	_.isUC = (str) => _.matches ('[A-Z]+') (_.vowStr (str));

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

	_.mapOnto = (itrs) => (val) => _.map (_.callOn (val)) (_.vowAry (itrs));

	_.matches = (pattern) => (str) => new RegExp (_.vowStr (pattern)).test (_.vowStr (str));

	_.max = (nbrs) => Math.max.apply (null, _.vowAry (nbrs));

	_.max2 = (nbr1) => (nbr2) => _.vowNbr (nbr1) > _.vowNbr (nbr2) ? nbr1 : nbr2;

	_.meld = (arrays) => _.reduce (_meld2) (_.vowAry (arrays));

	_.meld2 = (ary1) => (ary2) => concat (_.vowAry (ary1), _.vowAry (ary2));

	_.min = (nbrs) => Math.min.apply (null, _.vowAry (nbrs));

	_.min2 = (nbr1) => (nbr2) => _.vowNbr (nbr1) > _.vowNbr (nbr2) ? nbr2 : nbr1;

	_.not = (pred) => (val) => ! pred (val);

	_.null = (val) => null;

	_.onTail = (fn) => (ary) => [_.head (_.vowAry (ary)), _.vowFn (fn) (_.tail (ary))];

	_.partialMap = (idxs) => (itr) => function (val) {
		_.vowAry (idxs); _.vowFn (itr); _.vowObj (val);
		var i = 0, len = _.length (val), result = [], valAt = _.atOn (val);
		var idxsContain = _.flip (_.contains) (idxs);
		for (; i < len; i++) {
			result.push (idxsContain (_.vowIdx (i)) ? itr (valAt (i)) : valAt (i));
		}
		return result;
	};

	_.or = (ary) => function (val) {
		var result = false;
		var br = _.breakIfTrue;
		var itr = (pred) => br ((result = _.vowFn (pred) (val)));
		_.each (itr) (_.vowAry (ary));
		return result;
	};

	_.or2 = (pred1) => (pred2) => (val) => _.vowFn (pred1) (val) ? true : _.vowFn (pred2) (val) ? true : false;

	_.pipe = (fns) => (val) => _.reduceWith (val) (_.callOn) (fns);

	_.pipe2 = (fn1) => (fn2) => (val) => _.vowFn (fn2) (_.vowFn (fn1) (val));

	bird ('pipe2On') ('finch');
	combinator ('pipe2On') ('F');
	_.pipe2On = (val) => (fn1) => (fn2) => _.pipe2 (fn1) (fn2) (val);

	_.pluck = (attr) => (val) => (_.vowObj (val)) [_.vowIdx (attr)];

	_.pluckAll = (attrs) => (val) => _.mapOnto (_.map (_.pluck) (_.vowAry (attrs))) (val);

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
		//var result = _.copy (val);
		var check = _.isGuardSet () ?
			(_.isArray (val) ? _.vowInt : _.vowStr) :
			_.identity;
		var idx = _.copy (check (key));
		result [idx] = addendum;
		return result;
	};

	_.putOn = (val) => (addendum) => (key) => _.put (addendum) (key) (val);

	_.range = function (bounds) {
		var len = (_.vowAry (bounds)).length;
		_.vow (len > 0) ('Array must not be empty');
		var start = len === 1 ? 0 : _.vowInt (bounds [0]);
		var stop = len === 1 ? _.vowInt (bounds [0]) : _.vowInt (bounds [1]);
		var step = len < 3 ? 1 : _.vowInt (bounds [2]);
		var result = [];
		var i = 0, count = Math.ceil ((stop - start) / step);
		for (; i < count; i++) {
			result.push (start + step * i);
		}
		return result;
	};

  _.reduce = (itr) => function (ary) {
		_.vowFn (itr);
		var i = 1, len = (_.vowAry (ary)).length, result = ary [0];
		for (; i < len; i++) {
			result = itr (result) (ary [i]);
		}
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

	// check
	_.reverse = (ary) => (_.vowAry (ary)).reverse ();

	_.rreduceWith = (memo) => (itr) => function (ary) {
		_.vowFn (itr);
		var i = (_.vowAry (ary)).length, result = memo;
		for (; i--; ) {
			result = itr (result) (ary [i]);
		}
		return result;
	};

	_.second = (ary) => (_.vowAry (ary)) [1];

	alias ('shift') ('tail');
	_.shift = function (ary) {
		var result = _.copy (_.vowAry (ary));
		result.shift ();
		return result;
	};

	//_.shift2x = _.times (2) (_.shift);
	_.shift2x = function (ary) {
		var result = _.copy (_.vowAry (ary));
		result.shift ();
		result.shift ();
		return result;
	};

	_.slice = (bounds) => function (val) {
		var len = (_.vowAry (bounds)).length;
		_.vow (len > 0) ('Array must not be empty');
		_.vowWith (_.or2 (_.isAry) (_.isString)) (val);
		return val.slice (bounds [0], bounds [1]);
	};

	_.split = (mrk) => (str) => StrProto.split.call (_.vowStr (str), _.vowStr (mrk));

	_.drop = (intg) => (ary) => (_.copy (_.vowAry (ary))).slice (_.vowNNeg (intg));

	_.tap = (fns) => _.do (_.push (_.identity) (fns));

	_.through = (fn) => _.reduceWith (fn) (_.call2);

	_.throwError = function (msg) {
		throw new Error (msg);
	};

	_.throwTypeError = function (msg) {
		throw new TypeError (msg);
	};

	_.thunk = (vals) => () => _.reduceWith (_.vowFn (vals.shift ())) (_.call2) (vals);

	alias ('thunk1') ('suspend');
	alias ('thunk1') ('receive');
	alias ('thunk1') ('store');
	alias ('thunk1') ('fpush');
	_.thunk1 = (val) => () => val;

	alias ('thunk2') ('defer');
	_.thunk2 = (fn) => (val) => () => _.vowFn (fn) (val);

	_.times = (intg) => _.eachOn (_.range ([_.vowInt (intg)]));

	_.toLC = (str) => (_.vowStr (str)).toLowerCase ();

	_.toUC = (str) => (_.vowStr (str)).toUpperCase ();

	// The argmument must be a rectangular array.
	_.transpose = function (ary) {
		var ht = (_.vowAry (ary)).length, len = (_.vowAry (ary [0])).length;
		var i, j, row, result = [];
		for (j = 0; j < len; j++) {
			row = [];
			for (i = 0; i < ht; i++) {
				_.vow ((_.vowAry (ary [i])).length === len) ('Input must be a rectangular array.');
				row.push (ary [i] [j]);
			}
			result.push (row);
		}
		return result;
	};

	_.trim = (str) => (_.vowStr (str)).trim ();

	_.true = (val) => true;

	_.undefined = (val) => undefined;

	// Add validation.
	_.use = (context) => (obj) => (_.let
			(_.first (context))
			(_.through (_.at (1) (context)) (_.pluckAll (_.drop (2) (context)) (obj)))
			(obj));

	_.reify = (label) => (val) => _.put (val) (_.vowStr (label)) ({});

	_.continue = (contexts) => function (val) {
		var lastAttr = _.first (_.last (contexts));
		var lastFn = _.pluck (lastAttr);
		return _.pipe (_.push (lastFn) (_.map (_.use) (contexts))) (val);
	};

	//_.continue = (lastAttr) => (contexts) => (val) => (_.pluck (lastAttr)
			//(_.pipe (_.map (_.use) (contexts)) (val)));
	
	_.env = (firstAttr) => (contexts) => (val) => _.continue (contexts) (_.put (val) (firstAttr) ({}));

	alias ('env') ('continueWith');
	//_.env = (firstAttr) => (lastAttr) => (contexts) => (val) => (_.pluck (lastAttr)
			//(_.pipe (_.map (_.use) (contexts)) (_.put (val) (firstAttr) ({}))));

	_.vacant = (val) => _.isNull (val) || _.isUndefined (val) || _.isNaN (val);

	_.vowWith = (pred) => (msg) => function (val) {
		_.vow (_.isFunction (pred)) (fnMsg);
		_.vow (pred (val)) (msg);
		return val;
	};

	alias ('zip') ('zipEach');
	_.zip = (itr) => (ary1) => function (ary2) {
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

	// zipMap does not match pattern of zipEach and zipReduceWith
	_.zipMap = (itrs) => function (ary) {
		var i = 0,
				result = [],
				len1 = (_.vowAry (itrs)).length,
				len2 = (_.vowAry (ary)).length;
		_.vow (len1 === len2) (equalLengthMsg);
		for (; i < len1; i++) {
			result.push (itrs [i] (ary [i]));
		}
		return result;
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

	alias ('all') ('both');
	_.all = _.brkEach (_.not (_.identity));

	alias ('allOf') ('bothOf');
	_.allOf = _.brkEach (_.not (_.identity)) (_.identity);

	alias ('any') ('some');
	_.any = _.either = _.brkEach (_.identity);

	alias ('anyOf') ('someOf');
	_.anyOf = _.brkEach (_.identity) (_.identity);

	_.asZero = _.asPred (0);

	_.atOn = _.flip (_.at);

	_.breakIfTrue = _.breakIf (_.identity);

	_.breakIfFalse = _.breakIf (_.not (_.identity));

	_.callDown = _.breakDown (_.call);

	_.charAtOn = _.flip (_.charAt);

	_.composeDown = _.breakDown (_.compose);

	_.containsOn = _.flip (_.contains);

	_.doDown = _.breakDown (_.do);

	// Use case: var fn1 = _.dont; fn1 ([fn2, fn3, fn4]) (5);
	_.dont = _.thunk1 (_.identity);
	bird ('dont1') ('kite');
	combinator ('dont1') ('KI');
	_.dont1 = (val) => (val2) => val2;

	_.eachOn = _.flip (_.each);

	_.equivDown = _.breakDown (_.equiv);

	_.interject1 = _.flip (_.do2) (_.identity);

	_.interjectDown = _.breakDown (_.interject);

	_.mapOn = _.flip (_.map);

	_.pipeDown = _.breakDown (_.pipe);

	_.putAt = _.let = _.flip (_.put);

	_.replaceAt = _.flip (_.replace);
	alias ('replaceFirst') ('onHead');
	alias ('replaceFirst') ('drag');
	_.replaceFirst = _.replaceAt (0);

	_.thunkDown = _.breakDown (_.thunk2 (_.call));
	
	_.vowAry = _.vowWith (_.isArray) (aryMsg);

	_.vowBool = _.vowWith (_.isBoolean) (boolMsg);
	_.vowAllBool = _.map (_.vowBool);

	_.vowFn = _.vowWith (_.isFunction) (fnMsg);
	_.vowAllFn = _.map (_.vowFn);

	_.vowFull = _.vowWith (_.full) (fullMsg);
	_.vowAllFull = _.map (_.vowFull);

	_.vowIdx = _.vowWith (_.isIndex) (idxMsg);
	_.vowAllIdx = _.map (_.vowIdx);

	_.vowInt = _.vowWith (_.isInteger) (intMsg);
	_.vowAllInt = _.map (_.vowInt);

	_.vowNbr = _.vowWith (_.isNumber) (nbrMsg);
	_.vowAllNbr = _.map (_.vowNbr);

	_.vowObj = _.vowWith (_.isObject) (objMsg);
	_.vowAllObj = _.map (_.vowObj);

	_.vowNNeg = _.vowWith (_.isNonNegative) (nnegMsg);
	_.vowAllNNeg = _.map (_.vowNNeg);

	_.vowPos = _.vowWith (_.isPositive) (posMsg);
	_.vowAllPos = _.map (_.vowPos);

	_.vowStr = _.vowWith (_.isString) (strMsg);

	_.zipAssign = _.zipReduceWith ({}) (assign);

	_.zipCall = _.zip (_.call2);
	_.zipCallThru = _.zip (_.each);

	// bird combinators
	//_.eagle;
	//_.baldEagle;
	//_.goldfinch;
	//_.hummingbird;
	//_.jay;
	//_.lark = (a) => (b) => a (b (b)); // L
	//_.mockingbird = (a) => a (a); // M
	//// M2
	//_.dblMockingbird = (a) => (b) => a (b) (a (b));
	//_.owl = (a) => (b) => b (a (b)); // O
	//_.queer = (a) => (b) => (c) => b (a (c)); // Q
	//// Q1
	//_.quixotic = (a) => (b) => (c) => a (c (b));
	//// Q2
	//_.quizzical = (a) => (b) => (c) => b (c (a));
	//// Q3
	//_.quirky = (a) => (b) => (c) => c (a (b));
	//// Q4
	//_.quacky = (a) => (b) => (c) => c (b (a));
	//_.robin = (a) => (b) => (c) => b (c) (a); // R
	//// S
	//_.starling = (a) => (b) => (c) => a (c) (b (c));
	//_.turing = (a) => (b) => b (a (a) (b)); // U
	//_.vireo = (a) => (b) => (c) => c (a) (b); // V
	//_.warbler = (a) => (b) => a (b) (b); // W
	//// W1
	//_.converseWarbler = (a) => (b) => b (a) (a);
	////_.sage = _.S (_.L) (_.L); // Y
	//// cardinal once removed
	//_.C$ = (a) => (b) => (c) => (d) => a (b) (d) (c);
	//// robin once removed
	//_.R$ = (a) => (b) => (c) => (d) => a (c) (d) (b);
	//// finch once removed
	//_.F$ = (a) => (b) => (c) => (d) => a (d) (c) (b);
	//// vireo once removed
	//_.V$ = (a) => (b) => (c) => (d) => a (c) (b) (d);
	//_.KM = (a) => (b) => b (b);
	//// (a) => (b) => a (a);
	//combinator ('theta') ('Q');
	////_.theta = 

	setAliases ();

	return _;

});
