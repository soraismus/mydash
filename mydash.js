var _ = {};

var i, fns, len, types;

var breaker = {};
_.breaker = breaker;
Object.freeze (_.breaker);

_.stop = {};
Object.freeze (_.stop);

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
  nativeJoin         = ArrayProto.join,
  nativeIsArray      = Array.isArray,
  nativeKeys         = Object.keys,
  nativeBind         = FuncProto.bind;

var StrProto = String.prototype;

var
  nativeCharAt = StrProto.charAt,
  nativeConcat = StrProto.concat,
  nativeContains = StrProto.contains,
  nativeEndsWith = StrProto.endsWith,
  nativeStringIndexOf = StrProto.indexOf,
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
  aryMsg    = 'Invalid array',
  boolMsg   = 'Invalid boolean',
  defMsg    = 'Value must not be null or undefined',
  equalMsg  = 'Values must be equal',
  equalLengthMsg = 'Arrays should have equal length',
  fnMsg     = 'Invalid function',
  fullMsg   = 'Invalid non-empty array or object',
  hshMsg    = 'Invalid generic object',
  idxMsg    = 'Invalid key or index',
  intMsg    = 'Invalid integer',
  nbrMsg    = 'Invalid number',
  objMsg    = 'Invalid object',
  posMsg    = 'Invalid positive number',
  nnegMsg   = 'Invalid non-negative number',
  rgxMsg    = 'Invalid regular expression',
  strMsg    = 'Invalid string',
  structMsg = 'Invalid data structure',
  thkMsg    = 'Invalid thunk';

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
    setAliases = () => _.zipApply (_.map (set) (fnNames)) (aliases);

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
_.isRegex = (val) => toString.call (val) == '[object RegExp]';
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

_.add = (i) => (j) => _.vowNbr (i) + _.vowNbr (j);

_.and = (ary) => function (val) {
  var result = true;
  var br = _.breakIfFalse;
  var itr = (pred) => br (_.vowBool ((result = _.vowFn (pred) (val))));
  _.each (itr) (_.vowAry (ary));
  return result;
};

// Originally the following:
//_.apply = (fn) => (ary) => _.cascade (_.map (fn) (ary));
_.apply = (fn) => function (ary) {
  _.vowFn (fn);
  var len = (_.vowAry (ary)).length;
  return len === 0 ? fn () : _.reduceWith (fn) (_.call2) (ary);
}

_.apply2 = (fn) => (val1) => (val2) => _.vowFn (_.vowFn (fn) (val1)) (val2);

_.arrayLength = (ary) => (_.vowAry (ary)).length;

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

combinator ('compose2') ('B');

combinator ('compose3') ('B3');

bird ('compose3') ('becard');

_.binaryIfBranch = (bools) => function (results) {
  var len1 = _.arrayLength (bools),
      len2 = _.arrayLength (results),
      msg = 'The number of potential results must be an appropriate power of 2.';

  _.vow (len2 === _.pow (2) (len1)) (msg);

  var itr = function () {
    var i = len1;
    return (memo) => function (nbr) {
      i--;
      return memo + nbr * _.pow (2) (i);
    };
  };

  var numerify = (val) => (1 - (+ val)),
      numericValues = _.map (numerify) (bools),
      determineIdx = _.reduceWith (0) (itr ()),
      idx = determineIdx (numericValues);

  return results [idx];
};

// Rename function.
//_.binaryIfBranchApply = (checks) => (results) => function (val) {
  //var truthValues = _.mapOnto (checks) (val);
  //return _.binaryIfBranch (truthValues) (results) (val);
//};
_.binaryIfBranchApply = (checks) => (results) => function (val) {
  var len1 = _.arrayLength (checks),
      len2 = _.arrayLength (results),
      msg = 'The number of potential results must be an appropriate power of 2.';
  _.vow (len2 === _.pow (2) (len1)) (msg);
  
  var itr = function () {
    var i = len1;
    return (memo) => function (nbr) {
      i--;
      return memo + nbr * _.pow (2) (i);
    };
  };
  
  var truthValues = _.mapOnto (checks) (val),
      numerify = (val) => (1 - (+ val)),
      numericValues = _.map (numerify) (truthValues),
      determineIdx = _.reduceWith (0) (itr ()),
      idx = determineIdx (numericValues);
  
  return results [idx];
};

// A version that allows binding of multiple arguments would be preferred.
// This is similar to '_.thunk2'; however, b/c trampolining is not required,
// the two fns are not equivalent.
_.bind = (fn) => (arg) => (_.vowFn (fn)).bind (null, arg);

_.bind2 = (fn) => (arg1) => (arg2) => (_.vowFn (_.vowFn (fn)) (arg1)).bind (null, arg2);

_.bindWithCtxt = (fn) => (ctx) => (arg) => (_.vowFn (fn)).bind (_.vowHsh (ctx), arg);

bird ('compose2') ('bluebird');

alias ('all') ('both');

alias ('allOf') ('bothOf');

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

_.breakIf = (pred) => function (val) {
  _.vowFn (pred);
  return _.vowBool (pred (val)) || _.isBreaker (val) ?
    breaker :
    undefined;
};

//var construct = (namespace) => (fnName) => (signature) => function (fn) {
  //_.vowHsh (namespace); _.vowStr (fnName); _.vowStr (signature); _.vowFn (fn);
  //// _.vowSig (signature);
  //fn ['signature'] = signature;
  //namespace [fnName] = fn;
  //// namespace [fnName] = ensureTypes (fn); // install (fnName) (fn);
  //return fn;
//};
//// predicate (p) of type (_ > b)
//// generic fn (f) of type (_ > _)
//// construct (_) ('brkEach') ('p > f > _ > _') (brkEach);

//var Node = function (val) {
  //var next, value = val;
  //this.val = () => value;
  //this.next = () => next;
  //this.link = function (v) { next = v; };
  //this.unlink = function () {
    //next = undefined;
    //return this;
  //};
//};
//
//var nodify = (v) => v instanceof Node ? v : new Node (v);
//
//_.link = (val1) => function (val2) {
  //var [v1, v2] = _.map (nodify) ([val1, val2]);
  //v1.link (v2);
  //return v1;
//};
//
//_.unlink = (v) => v instanceof Node ? v.unlink () : v;
//
//_.isNode = (v) => v instanceof Node;
//_.vowNode;

// The suffix 'Across' indicates the use of a generator instead of an array.
_.breakAcross = (pred) => (itr) => function (generator) {
  // The default value of 'true' is returned when the generator returns 'breaker' immediately.
  _.vowFn (itr);
  var result = true,
      br = _.breakIf (_.vowFn (pred)),
      set = function (v) {
        result = _.isBreaker (v) ? result : itr (v);
        return br (itr (v));
      };
  _.trampoline (_.compose2 (set) (generator));
  return result;
};

_.brkEach = (pred) => (itr) => function (val) {
  _.vowFn (itr);
  var result, br = _.breakIf (_.vowFn (pred));
  var itr2 = (val) => br ( (result = itr (val)) );
  _.each (itr2) (val);
  return result;
};

_.brkEachWith = (dfault) => (pred) => (itr) => function (val) {
  _.vowFn (itr);
  var br, itr2, result;

  result = dfault;
  br     = _.breakIf (_.vowFn (pred));
  itr2   = (val) => br ( (result = itr (val)) );

  _.each (itr2) (val);
  return result;
};

_.brkReduceWith = (pred) => (memo) => (itr) => function (ary) {
  var result = memo, br = _.breakIf (_.vowFn (pred));
  var itr2 = (val) => br ( (result = _.vowFn (itr) (result) (val)) );
  _.each (itr2) (ary);
  return result;
};

// This is a function to implement a 'maybe' monad.
_.bypassWith = (marker) => (pred) => (fn) => (val) => _.vowBool (_.vowFn (pred) (val)) ? marker : _.vowFn (fn) (val);

combinator ('flip') ('C');

_.call = function (ary) {
  var len = (_.vowAry (ary)).length;
  switch (len) {
    case 0:  return;
    case 1:  return ary [0] ();
    default: return _.reduceWith (ary.shift ()) (_.call2) (ary);
  }
};

// for trampolining thunks
_.call1 = (fn) => _.vowFn (fn) ();

bird ('flip') ('cardinal');

_.call2 = (fn) => (val) => _.vowFn (fn) (val);

// This is equivalent to _.apply2.
_.call3 = (v1) => (v2) => (v3) => _.call ([v1, v2, v3]);

_.callOn = (arg) => (fn) => _.vowFn (fn) (arg);

alias ('call') ('cascade');

alias ('thread') ('chain');

_.charAt = (idx) => (str) => nativeCharAt.call (_.vowStr (str), _.vowInt (idx));

_.charCodeAt = (idx) => (str) => (_.vowStr (str)).charCodeAt (_.vowInt (idx))

_.compose = (fns) => (val) => _.rreduceWith (val) (_.callOn) (fns);

alias ('call2') ('compose1');

_.compose2 = (fn1) => (fn2) => (val) => _.vowFn (fn1) (_.vowFn (fn2) (val));

_.compose3 = (fn1) => (fn2) => (fn3) => (val) => _.compose ([fn1, fn2, fn3]) (val);

_.comprehend = (initial) => (itr) => function (fn) {
  var i = initial;
  _.vowFn (itr); _.vowFn (fn);
  return function () {
    var result = fn (i);
    i = itr (i);
    return result;
  };
};

_.concat = (ary) => _.reduceWith ('') (_.concat2) (_.vowAry (ary));

_.concat2 = (str1) => (str2) => StrProto.concat (_.vowStr (str1), _.vowStr (str2));

_.conjugate = (fn1) => (inverseFn1) => (fn2) => _.compose ([fn1, fn2, inverseFn1]);

_.constant = (val) => () => val;

_.constrainedArrayLength = (len1) => function (ary2) {
  var len2;
  _.vow (len1 === (len2 = _.arrayLength (ary2))) (equalLengthMsg);
  return len2;
};

_.contains = (val) => function (tgt) {
  return nativeIndexOf && (_.vowObj (val)).indexOf === nativeIndexOf ?
    nativeIndexOf.call (val, tgt) !== -1 :
    _.any ((i) => i === tgt) (val);
};

_.containsAll = (val) => (ary) => _.all (_.contains (val)) (ary);

_.containsAny = (val) => (ary) => _.any (_.contains (val)) (ary);

alias ('containsAll') ('containsBoth');

alias ('containsAny') ('containsEither');

alias ('containsAny') ('containsSome');

_.continue = (contexts) => function (val) {
  var lastAttr = _.first (_.vowAry (_.last (_.vowAry (contexts))));
  var lastFn = _.pluck (lastAttr);
  return _.pipe (_.push (lastFn) (_.map (_.use) (contexts))) (val);
};

_.glob = (contexts) => function (val) {
  var lastAttr = _.first (_.vowAry (_.last (_.vowAry (contexts))));
  var lastFn = _.pluck (lastAttr);
  return _.pipe (_.map (_.use) (contexts)) (val);
};

alias ('env') ('continueWith');

_.deepCopy = function (val) {
  (_.vow (_.or ([_.not (_.isObject), _.isArray, _.isHash, _.isFunction]) (val))
    ('Only arrays and generic objects are permissible'));

  var i, len, result;

  if (! _.isObject (val) || _.isFunction (val)) {
    return val;
  }

  if (_.isArray (val)) {
    i = 0; len = val.length; result = [];
    for (; i < len; i++) {
      result.push (_.deepCopy (val [i]));
    }
    return result;
  }

  result = {};
  for (i in val) {
    if (_.has (i) (val)) {
      result [i] = _.deepCopy (val [i]);
    }
  }
  return result;
};

_.cross = function (arrays) {
  var crossedArrays = _.reduce (_.cross2) (_.vowAllAry (arrays));
  return _.map (_.flatten) (crossedArrays);
};

_.cross2 = (ary1) => function (ary2) {
  var j,
      i = 0,
      getLn = (ary) => _.length (_.vowAry (ary)),
      len1 = getLn (ary1),
      len2 = getLn (ary2),
      result = [];

  for (; i < len1; i++) {
    j = 0;
    for (; j < len2; j++) {
      result.push ([ary1 [i], ary2 [j]]);
    }
  }

  return result;
};

_.crossHalves = function (ary) {
  var len  = _.length (_.vowAry (ary)),
      mid  = _.floor (len / 2),
      ary1 = ary.slice (0, mid),
      ary2 = ary.slice (mid);
  return _.cross2 (ary1) (ary2);
};

_.crossMerge2 = (ary1) => (ary2) => _.flattenOneLevel (_.cross2 (ary1) (ary2));

_.crossCall2 = (fn) => (val1) => (val2) => _.crossMap (_.map (_.vowFn (fn)) (val1)) (val2);

_.crossMap = (itrs) => (arrays) => _.crossMap2 (_.map (_.apply) (itrs)) (_.cross (arrays));

_.crossMap2 = (itrs) => function (val) {
  _.vowObj (val);
  var i = 0, len = (_.vowAry (itrs)).length, result = [];
  for (; i < len; i++) {
    result.push (_.map (_.vowFn (itrs [i])) (val));
  }
  return result;
};

_.crossMergeCall2 = (fn) => (val1) => (val2) => _.flattenOneLevel (_.crossCall2 (fn) (val1) (val2));

combinator ('embed2') ('D');

combinator ('embed3') ('D1');

_.decr = (intg) => _.vowInt (intg) - 1;

_.putAll = (val) => (keys) => function (addenda) {
  var result = _.deepCopy (_.vowObj (val)),
      len1 = _.arrayLength (addenda),
      len2 = _.constrainedArrayLength (keys),
      i = 0;
  for (; i < len1; i++) {
    result [_.vowIdx (keys [i])] = addenda [i];
  }
  return result;
};

_.defaults = (defaultSets) => function (hsh) {
  var itr, result, keys, props;

  result = _.vowHsh (hsh);
  keys   = [];
  props  = [];

  itr = function (source) {
    for (var prop in source) {
      if (result [prop] === void 0) {
        keys.push(prop);
        props.push(source [prop]);
      }
    }
  };

  _.each (itr) (_.vowAllHsh (defaultSets));

  return _.putAll (result) (keys) (props);
};

// This is a function to implement a 'maybe' monad.
_.defaultWith = (pred) => (defaultVal) => (val) => _.vowBool (_.vowFn (pred) (val)) ? defaultVal : val;

alias ('thunk2') ('defer');

_.defined = (val) => ! _.vacant (val);

bird ('embed3') ('dickcissel');

_.distance = (nbr1) => (nbr2) => _.abs (_.vowNbr (nbr1) - _.vowNbr (nbr2));

_.distLessThan = (nbr1) => (nbr2) => (nbr3) => _.distance (nbr2) (nbr3) < _.vowNbr (nbr1);

_.distEquals = (nbr1) => (nbr2) => (nbr3) => _.distance (nbr2) (nbr3) === _.vowNbr (nbr1);

_.divide = (i) => (j) => _.vowNbr (i) / _.vowNbr (j);

_.do = (fns) => function (val) {
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

_.dont1 = (val) => (val2) => val2;

bird ('embed2') ('dove');

alias ('replaceFirst') ('drag');

_.drop = (intg) => (ary) => (_.deepCopy (_.vowAry (ary))).slice (_.vowNNeg (intg));

_.dup = (fn) => (val) => _.vowFn (_.vowFn (fn) (val)) (val);

alias ('dup') ('dupArgOf');

_.duplicate = (count) => function (val) {
  var i = 0, len = _.vowInt (count), result = [];
  for (; i < len; i++) {
    result.push (val);
  }
  return result;
};

// '_.at' should work on strings as well as arrays and hashes.
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

_.eachApply = (itr) => (arrays) => _.each (_.apply (_.vowFn (itr))) (_.vowAllAry (arrays));

_.eachChar = (itr) => function (str) {
  _.vowFn (itr);
  _.vowStr (str);
  var i = 0, len = _.length (str), charAt = _.charAtOn (str);
  for (; i < len; i++) {
    if (itr (charAt (i)) === breaker) {
      return;
    }
  }
};

alias ('do') ('eachOnto');

// exclusive-between
_.eBtw = (lb) => (ub) => (nbr) => _.vowNbr (nbr) > lb && nbr < ub;

alias ('any') ('either');

alias ('compose2') ('embed');

alias ('compose2') ('embed1');

_.embed2 = (fn1) => (val1) => (fn3) => (val4) => _.vowFn (_.vowFn (fn1) (val1)) (_.vowFn (fn3) (val4));

_.embed3 = (v1) => (v2) => (v3) => (v4) => (v5) => _.call ([v1, v2, v3, v4 (v5)]);

_.empty = (val) => _.length (_.vowObj (val)) === 0;

_.env = (firstAttr) => (contexts) => (val) => _.continue (_.vowAry (contexts)) (_.put (val) (firstAttr) ({}));
_.globWith = (firstAttr) => (contexts) => (val) => _.glob (_.vowAry (contexts)) (_.put (val) (firstAttr) ({}));

_.equiv = (ary) => _.all (_.asPred (_.first ((ary)))) (ary);

_.equiv2 = (i) => (j) => i === j;

_.extend = (val) => function (properties) {
  _.vowHsh (properties);
  var prop, result = _.deepCopy (val);
  for (prop in properties) {
    result [prop] = source [prop];
  };
  return result;
};

combinator ('pipe2On') ('F');

_.false = (val) => false;

_.filter = (pred) => function (val) {
  _.vowFn (pred);
  _.vowObj (val);
  var results = [],
      itr = function (i) {
        if (_.vowBool (pred (i))) {
          results.push (i);
        }
      };
  _.each (itr) (val);
  return results;
};

bird ('pipe2On') ('finch');

_.find = (pred) => function (val) {
  var result, itr = function (v) {
    if (pred (v)) {
      result = v;
      return breaker;
    }
  }
  _.each (itr) (val);
  return result;
};

_.finite = (val) => _.isFinite (val) && ! _.isNaN (parseFloat (val));

_.first = (ary) => (_.vowAry (ary)) [0];

_.flatten = function (ary) {
  var output = [],
      helper = function (ary, output) {
        var itr = function (val) {
          if (_.isArray (val) || _.isArguments (val)) {
            helper (val, output);
          } else {
            output.push (val);
          }
        };
        _.each (itr) (ary);
        return output;
      };
  return helper (ary, output);
};

_.flattenOneLevel = function (ary) {
  if (_.all (_.isArray) (ary)) {
    return concat.apply ([], _.vowAllAry (_.vowAry (ary)));
  } else {
    return ary;
  }
};

_.flip = (fn) => (arg1) => (arg2) => fn (arg2) (arg1);

_.floor = (nbr) => Math.floor (_.vowNbr (nbr));

alias ('thunk1') ('fpush');

_.full = (val) => ! _.empty (val);

_.generate = (initial) => (pred) => (itr) => function (fn) {
  var i = initial;
  _.vowFn (pred); _.vowFn (itr); _.vowFn (fn);
  return function () {
    var result, fnResult = fn (i);
    if (_.vowBool (pred (fnResult) (i))) {
      result = fnResult;
      i = itr (i);
      return result;
    } else {
      return breaker;
    }
  };
};

// Rename function.
_.generalizedConjugate = (op) => (inverse) => (val1) => function (val2) {
  return _.vowFn (op) (op (val1) (val2)) (_.vowFn (inverse) (val1));
};

_.get = (key) => (val) => _.isArray (val) ? val [_.vowInt (key)] : (_.vowObj (val)) [_.vowStr (key)];

_.greplace = (substr) => (pattern) => (str) => StrProto.replace.call (_.vowStr (str),  _.vowStr (substr), _.vowStr (pattern), 'g');

_.gremove = (substr) => (str) => _.greplace (substr) ('') (str);

_.has = (key) => (obj) => hasOwnProperty.call (_.vowObj (obj), _.vowIdx (key));

alias ('first') ('head');

combinator ('identity') ('I');

combinator ('call2') ('I$'); // I* combinator

// identity twice removed
combinator ('call3') ('I$$');

// inclusive-between
_.iBtw = (lb) => (ub) => (nbr) => _.vowNbr (nbr) >= lb && nbr <= ub;

_.identity = (val) => val;

_.iffOn = (then) => (els) => (bool) => bool ? then : els;

// monad ??
// => (_.vowAry (results)) [_.brkEach (FN) (MONAD) (_.vowAry (conditions))];
// FN = _.identity; MONAD = _.identity closed over an incrementing variable
// a default result?
// _.if = ... [like _.true]
_.if = (conditions) => function (results) {
  var i = -1;
  // this might be an example of a monad pattern
  var itr = function (val) {
    i++;
    return val;
  };
  _.brkEach (_.identity) (itr) (_.vowAry (conditions));
  return (_.vowAry (results)) [i];
};

// Should I rename this fn '_.ifApply'?
_.iff = (pred) => (trueFn) => (falseFn) => (val) => pred (val) ? trueFn (val) : falseFn (val);

//_.iffIs = (vals) => (results) => _.iffWith (_.map (_.asPred) (_.vowAry (vals))) (_.vowAry (results));
_.iffIs = (vals) => (results) => _.iffWith () (_.map (_.asPred) (_.vowAry (vals))) (_.map (_.thunk1) (_.vowAry (results)));

_.makePred = (val) => _.isFunction (val) ? val : _.asPred (val);
_.makeFn = (val) => _.isFunction (val) ? val : _.thunk1 (val);

_.ifThenApply = (checks) => (results) => function (val) {
  var len1 = (_.vowAry (checks)).length,
      len2 = (_.vowAry (results)).length;

  _.vow (len1 === len2) (equalLengthMsg);

  var preds = _.map (_.makePred) (checks),
      fns = _.map (_.makeFn) (results),
      i = -1;

  var itr = function (val) {
    i++;
    return val;
  };

  // Should I convert 'preds' array into a generator?
  _.brkEach (_.callOn (val)) (itr) (preds);
  return fns [i] (val);
};

// This doesn't seem to work.
// Change fn's name.
_.iffWithDefault = (defaultVal) => (checks) => (results) => function (val) {
  var len1 = (_.vowAry (checks)).length,
      len2 = (_.vowAry (results)).length;

  _.vow (len1 === len2) (equalLengthMsg);

  var preds = _.map (_.makePred) (checks),
      fns = _.map (_.makeFn) (results),
      i = -1;

  var itr = function (val) {
    i++;
    return val;
  };

  // Should I convert 'preds' array into a generator?
  var lastPred = _.brkEach (_.callOn (val)) (itr) (preds);
  return (i === len1 - 1 && ! lastPred (val)) ? defaultVal : fns [i] (val);
};

// leaf = x;
// [[x, N], [x2, N], [x3, N], ...]
var sister = _.drop (1);
var daughter = (ary) => ary [0] [1];
// [[_.a1 [[_.b1, [[_.c1 [x1]]]]]]];

_.switch = (checks) => (results) => function (val) {
  var len1 = (_.vowAry (checks)).length,
      len2 = (_.vowAry (results)).length;

  _.vow (len1 === len2) (equalLengthMsg);

  var preds = _.map (_.makePred) (checks),
      i = -1;

  var itr = function (val) {
    i++;
    return val;
  };

  // Should I convert 'preds' array into a generator?
  _.brkEach (_.callOn (val)) (itr) (preds);
  return results [i] (val);
};

_.switchWith = (defaultVal) => (checks) => (results) => function (val) {
  var len1 = (_.vowAry (checks)).length,
      len2 = (_.vowAry (results)).length;

  _.vow (len1 === len2) (equalLengthMsg);

  var preds = _.map (_.makePred) (checks),
      i = -1;

  var itr = function (val) {
    i++;
    return val;
  };

  // Should I convert 'preds' array into a generator?
  var lastPred = _.brkEach (_.callOn (val)) (itr) (preds);
  return (i === len1 - 1 && ! lastPred (val)) ? defaultVal : results [i];
};

_.ift = (condition) => (then) => _.vowBool (condition) ? then : undefined;

_.ifte = (condition) => (then) => (els) => _.vowBool (condition) ? then : els;

_.incr = (intg) => _.vowInt (intg) + 1;

_.indexOf = (container) => function (constituent) {
    return _.isArray (container) ?
      nativeIndexOf.call (container, constituent) :
      nativeStringIndexOf.call (_.vowStr (container), _.vowStr (constituent));
};

alias ('parasitize') ('infest');

_.insert = (addendum) => (idx) => function (ary) {
  var i = 0, len = (_.vowAry (ary)).length,
      result = new Array (len + 1);
  result [idx] = addendum;
  for (i; i < idx; i++) {
    result [i] = _.deepCopy (ary [i]);
  }
  for (i = idx + 1; i <= len; i++) {
    result [i] = _.deepCopy (ary [i - 1]);
  }
  return result;
};

_.interject = (fns) => _.do (_.push (_.identity) (fns));

// functional.js uses 'invoke' to represent the mapping of an object's method.
// Perhaps I should use this word for some other purpose.
alias ('map') ('invoke');

_.isArray = (val) => nativeIsArray (val) || toString.call (val) == '[object Array]';

_.isBoolean = (val) => (val === true ||
    val === false || toString.call (val) == '[object Boolean]');

_.isBreaker = (val) => val === breaker;

_.isElement = (val) => !! (val && val.nodeType === 1);

_.isFinite = (val) => isFinite (val) && ! _.isNaN (parseFloat (val));

_.isHash = (val) => _.isObject (val) && ! (
    _.isArray (val) || _.isFunction (val) || _.isRegex (val) ||
    _.isDate (val) || _.isString (val));

_.isIndex = (val) => _.isInteger (val) || _.isString (val);

_.isInteger = (val) => _.isNumber (val) && val === (val >> 0);

_.isLC = (str) => _.matches ('[a-z]+') (_.vowStr (str));

_.isNaN = (val) => _.isNumber (val) && val != +val;

_.isNull = (val) => val === null;

_.isObject = (val) => val === Object (val);

_.isNonNegative = (nbr) => _.vowNbr (nbr) >= 0;

_.isPositive = (nbr) => _.vowNbr (nbr) > 0;

_.isThunk = (val) => _.isFunction (val) && val.length === 0;

_.isUC = (str) => _.matches ('[A-Z]+') (_.vowStr (str));

_.isUndefined = (val) => val === void 0;

_.isZero = (val) => val === 0;

_.join = (ary) => nativeJoin.call (_.vowAry (ary), '');

_.joinWith = (link) => (ary) => nativeJoin.call (_.vowAry (ary), _.vowStr (link));

_.keys = (obj) => Object.keys (_.vowObj (obj));

combinator ('dont1') ('KI');

bird ('dont1') ('kite');

_.last = (ary) => (_.vowAry (ary)) [ary.length - 1];

//_.length = (val) => _.isArray (val) ? val.length : (_.keys (_.vowObj (val))).length;
_.length = (val) => _.isArray (val) ? val.length : (_.isString (val) ? val.length : (_.keys (_.vowObj (val))).length);

_.magnitudeLessThan = (limit) => (nbr) => _.abs (_.vowNbr (nbr)) < _.vowPos (limit)

_.map = (itr) => function (val) {
  _.vowFn (itr);
  var i = 0, len = _.length (val), results = [], valAt = _.atOn (val);
  for (; i < len; i++) {
    results.push (itr (valAt (i)));
  }
  return results;
};

_.mapApply = (itr) => (arrays) => _.map (_.apply (_.vowFn (itr))) (_.vowAllAry (arrays));

_.mapChar = (itr) => function (str) {
  _.vowFn (itr);
  _.vowStr (str);
  return _.pipe ([_.arrayify, _.map (itr), _.join]) (str);
};

_.mapApplyOnto = (itrs) => (ary) => _.map (_.applyOn (_.vowAry (ary))) (_.vowAry (itrs));

_.mapOnto = (itrs) => (val) => _.map (_.callOn (val)) (_.vowAry (itrs));

// TODO: Refactor to allow multiple flags.
//_.match = (pattern) => (str) => new RegExp (_.vowStr (pattern)) .test (str);
_.match = (pattern) => (flag) => function (str) {
  var dictionary = { ignoreCase: 'i', global: 'g', noFlags: '' };
  return new RegExp (pattern, dictionary[flag]) .test (str);
};

_.matches = (pattern) => (str) => new RegExp (_.vowStr (pattern)).test (_.vowStr (str));

_.max = (nbrs) => Math.max.apply (null, _.vowAry (nbrs));

_.max2 = (nbr1) => (nbr2) => _.vowNbr (nbr1) > _.vowNbr (nbr2) ? nbr1 : nbr2;

// This is an implementation of the 'maybe' monad.
_.maybe = (fns) => _.pipe (_.map (_.bypassVacant) (fns));

_.meld = (arrays) => _.reduce (_.meld2) (_.vowAry (arrays));

_.meld2 = (ary1) => (ary2) => concat.call (_.vowAry (ary1), _.vowAry (ary2));

_.memoize = (hasher) => function (fn) {
  _.vowFn (fn);
  var memo = {};
  return function (arg) {
    var key = hasher (arg);
    return _.has (key) (memo) ?
      memo [key] :
      (memo [key] = fn (arg));
  };
};

_.min = (nbrs) => Math.min.apply (null, _.vowAry (nbrs));

_.min2 = (nbr1) => (nbr2) => _.vowNbr (nbr1) > _.vowNbr (nbr2) ? nbr2 : nbr1;

_.mod = (i) => (j) => _.vowInt (i) % _.vowInt (j);

_.multiply = (i) => (j) => _.vowNbr (i) * _.vowNbr (j);

alias ('none') ('neither');

_.not = (pred) => (val) => ! pred (val);

alias ('notAll') ('notBoth');

_.nTimes = (intg) => function (fn) {
  var i = -1;
  return function (arg) {
    i++;
    return i < intg ?
      fn (arg) :
      arg;
  };
};

_.null = (val) => null;

_.objectify = (labels) => (vals) => _.putAll (labels) (vals) ({}); 

_.ofLength = (intg) => (val) => _.length (val) === _.vowInt (intg);

_.once = _.nTimes (1);

alias ('replaceFirst') ('onHead');

_.onTail = (fn) => (ary) => [_.head (_.vowAry (ary)), _.vowFn (fn) (_.tail (ary))];

_.pair = (val1) => (val2) => [val1, val2];

// Consider renaming the following fn.
_.parasitize = (fn1) => (fn2) => (val) => _.vowFn (_.vowFn (fn1) (_.vowFn (fn2) (val))) (val);

_.parseInt = (str) => (radix) => Number.parseInt (str, radix);

_.partialMap = (idxs) => (itr) => function (val) {
  _.vowAry (idxs); _.vowFn (itr); _.vowObj (val);
  var i = 0, len = _.length (val), result = [], valAt = _.atOn (val);
  var idxsContain = _.contains (idxs);
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

alias ('call2') ('pipe1');

_.pipe2 = (fn1) => (fn2) => (val) => _.vowFn (fn2) (_.vowFn (fn1) (val));

_.pipe2On = (val) => (fn1) => (fn2) => _.pipe2 (fn1) (fn2) (val);

_.pluck = (attr) => (val) => (_.vowObj (val)) [_.vowIdx (attr)];

_.pluckAll = (attrs) => (val) => _.mapOnto (_.map (_.pluck) (_.vowAry (attrs))) (val);

_.pop = function (ary) {
  var result = _.deepCopy (_.vowAry (ary));
  result.pop ();
  return result;
};

_.pow = (base) => (exponent) => Math.pow (base, exponent);

alias ('flip') ('pull1');

_.pull2 = (val1) => (val2) => (val3) => _.vowFn (_.vowFn (val2) (val3)) (val1);

var push = (ary) => (val) => ary.push (val);

_.push = (val) => function (ary) {
  var result = _.deepCopy (_.vowAry (ary));
  result.push (val);
  return result;
};

_.put = (val) => (key) => function (addendum) {
  var result = _.deepCopy (_.vowObj (val));
  var check = _.isGuardSet () ?
    (_.isArray (val) ? _.vowInt : _.vowStr) :
    _.identity;
  var idx = _.deepCopy (check (key));
  result [idx] = addendum;
  return result;
};

_.putAll = (val) => (keys) => function (addenda) {
  var result = _.deepCopy (_.vowObj (val)),
      len1 = _.arrayLength (addenda),
      len2 = _.constrainedArrayLength (keys),
      i = 0;
  for (; i < len1; i++) {
    result [_.vowIdx (keys [i])] = addenda [i];
  }
  return result;
};

_.putOn = (val) => (addendum) => (key) => _.put (addendum) (key) (val);

combinator ('pull2') ('R');

// Refactor.
_.range = function (bounds) {
  var len = (_.vowAry (bounds)).length;
  _.vow (len > 0) ('Array must not be empty');
  
  var start = len === 1 ? 0 : _.vowInt (bounds [0]),
      stop = len === 1 ? _.vowInt (bounds [0]) : _.vowInt (bounds [1]),
      step = len < 3 ? 1 : _.vowInt (bounds [2]),
      result = [],
      i = 0, count = Math.ceil ((stop - start) / step);
  for (; i < count; i++) {
    result.push (start + step * i);
  }
  return result;
};

alias ('compose2') ('rassoc');

alias ('thunk1') ('receive');

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

_.regexTest = (rgx) => (str) => (_.vowRgx (rgx)).test (_.vowStr (str));

_.reify = (label) => (val) => _.put (val) (_.vowStr (label)) ({});

_.reject = (pred) => (val) => _.filter (_.not (pred)) (val);

_.repeat = (intg) => (str) => nativeRepeat.call (_.vowStr (str), _.vowInt (intg));

_.replace = (fn) => (idx) => (ary) => _.put (_.vowFn (fn) ((_.vowAry (ary)) [_.vowInt (idx)])) (idx) (ary);

// check
_.reverse = function (ary) {
  result = _.deepCopy (_.vowAry (ary));
  return result.reverse ();
};

alias ('shift') ('rest');

_.sift = (ary) => _.mapOnto ([_.first, _.rest]) (_.vowAry (ary));

_.strReplace = (toBeReplaced) => (replacement) => (flag) => function (str) {
  var dictionary = { global: 'g', noFlags: '' };
  return nativeReplace.call (_.vowStr (str), _.vowStr (toBeReplaced), _.vowStr (replacement), dictionary[flag]);
};

bird ('pull2') ('robin');

_.rreduceWith = (memo) => (itr) => function (ary) {
  _.vowFn (itr);
  var i = (_.vowAry (ary)).length, result = memo;
  for (; i--; ) {
    result = itr (result) (ary [i]);
  }
  return result;
};

combinator ('parasitize') ('S');

_.scale = (scalar) => (vector) => _.map (_.multiply (_.vowNbr (scalar))) (_.vowAllNbr (vector));

_.second = (ary) => (_.vowAry (ary)) [1];

alias ('find') ('select');

alias ('sequence') ('seq');

_.shift = function (ary) {
  var result = _.deepCopy (_.vowAry (ary));
  result.shift ();
  return result;
};

_.shift2x = function (ary) {
  var result = _.deepCopy (_.vowAry (ary));
  result.shift ();
  result.shift ();
  return result;
};

_.sign = (nbr) => _.vowNbr (nbr) < 0 ? -1 : (nbr > 0 ? 1 : 0);

// Confirm that this is appropriate.
//_.isEnumerable => (val) => typeof val.length === 'number';
_.isEnumerable = (val) => _.isArray (val) || _.isString (val);
// _.vowEnum;

_.slice = (bounds) => function (val) {
  _.vowWith (_.or2 (_.isArray) (_.isString)) ('Input must be a string or array.') (val);
  var len, lb, ub;
  if (_.isNumber (bounds)) {
    len = 1;
    lb = bounds;
    ub = val.length;
  } else {
    len = (_.vowAry (bounds)).length;
    lb = bounds [0];
    ub = bounds [1];
  }
  _.vow (len > 0) ('There must be at least one bound.');
  return val.slice (lb, ub);
};

alias ('any') ('some');

alias ('anyOf') ('someOf');

_.split = (mrk) => (str) => StrProto.split.call (_.vowStr (str), _.vowStr (mrk));

// bird combinator
_.starling = (fn1) => (fn2) => (val) => _.vowFn (_.vowFn (fn1) (val)) (_.vowFn (fn2) (val));

alias ('thunk1') ('store');

_.subtract = (i) => (j) => _.vowNbr (i) - _.vowNbr (j);

alias ('thunk1') ('suspend');

combinator ('callOn') ('T');

alias ('shift') ('tail');

_.tap = (fns) => _.do (_.push (_.identity) (fns));

// TODO: Use '_.reduce' instead of '_.map'.
_.thread = (val) => _.map (_.callOn (val));

alias ('thread') ('threadFirst');

_.threadLast = (val) => (fns) => _.callOn (val) (_.pipe (fns));

_.through = (fn) => _.reduceWith (fn) (_.call2);

_.throwError = function (msg) {
  throw new Error (msg);
};

_.throwTypeError = function (msg) {
  throw new TypeError (msg);
};

bird ('callOn') ('thrush');

_.thunk = (vals) => function () {
  _.vowAry (vals);
  return _.reduceWith (_.vowFn (vals.shift ())) (_.call2) (vals);
};

// Javascript allows nullary functions to be called on arguments.
// Of course, however, this will have no effect.
_.thunk1 = (val) => () => val;

_.thunk2 = (fn) => (val) => () => _.vowFn (fn) (val);

_.times = (intg) => _.eachOn (_.range ([_.vowInt (intg)]));

_.toLC = (str) => (_.vowStr (str)).toLowerCase ();

_.toNbr = (val) => (+ val);

_.toUC = (str) => (_.vowStr (str)).toUpperCase ();

// Should there be a limit of calls if there is no terminus?
_.trampoline = function (generator) {
  _.vowFn (generator);
  var result, intermed;
  while (! _.isBreaker ((intermed = generator ()))) {
    result = intermed;
  }
  return result;
};

_.trampoline_Nx = (count) => function (generator) {
  _.vowPos (count);
  var i = count - 1;
  _.times (i) (generator);
  return generator ();
};

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

_.traverse = (ary) => _.generate (0) ((_) => (idx) => idx < ary.length) (_.incr) (_.atOn (_.vowAry (ary)));

_.trim = (str) => (_.vowStr (str)).trim ();

_.true = (val) => true;

_.tunnel = (fn) => function (val) {
  _.vowFn (fn) (val);
  return val;
};

_.undefined = (val) => undefined;

_.unshift = (val) => function (ary) {
  var result = _.deepCopy (_.vowAry (ary));
  result.unshift (val);
  return result;
};

_.use = (context) => (obj) => (_.let
    (_.first (_.vowAry (context)))
    (_.through (_.at (1) (context)) (_.pluckAll (_.drop (2) (context)) (_.vowObj (obj))))
    (obj));

_.vacant = (val) => _.isNull (val) || _.isUndefined (val) || _.isNaN (val);

// Provide a permanent name for the following fn.
_.temp1 = (a) => (b) => (c) => c (a) (b);
combinator ('temp1') ('V');
bird ('temp1') ('vireo');

// Consider implementing a system such that
// (1) a call-series of set length requires a fn's name to be suffixed
// with the numeral representing that length,
// (2) a call-series of indefinite length requires a fn's name to be
// suffixed with 'Down',
// (3) an array requires no distinguishing suffix,
// (4) a linked-list may require a distinguishing suffix.

_.vowAllEqual = (vals) => _.vowWith (_.equiv) (equalMsg) (_.vowAry (vals));

_.vowAllEqualLength = (vals) => _.vowWith (_.equiv) (equalLengthMsg) (_.vowAry (vals));

// The message for this guard function must be set ad hoc.
_.vowEqual = (val1) => (val2) => _.vow (val1 === val2);

_.vowEqualLength = (val1) => (val2) => _.vowEqual (val1) (val2) (equalLengthMsg);

_.vowStruct = (preds) => (val) => _.vowWith (_.or (preds)) (structMsg) (val);

_.vowWith = (pred) => (msg) => function (val) {
  _.vow (_.isFunction (pred)) (fnMsg);
  var msgWithVal;
  if (! _.vacant (val)) {
    msgWithVal = msg + " : " + val.toString() + "\t";
  } else {
    msgWithVal = msg;
  }
  _.vow (pred (val)) (msgWithVal);
  return val;
};

combinator ('dup') ('W');

bird ('dup') ('warbler');

_.while;
_.until;

// NOT TESTED.
_.xor = (ary) => function (val) {
  var result = false;
  var br = (function () {
    var fn = function (input) {
      return _.isBreaker (input) ? breaker : undefined;
    };
    return function (input) {
      if (input) {
        fn = _.breakIfFalse;
      }
      return fn (input);
    }
  })();
  var itr = (pred) => br ((result = _.vowFn (pred) (val)));
  _.each (itr) (_.vowAry (ary)); return result;
};

_.zip = function (arrays) {
  _.vowAllAry (arrays);
  var len = _.max (_.map (_.length) (arrays)),
      nbr = arrays.length,
      transpose = _.transpose (arrays),
      i = 0,
      result = [],
      row,
      j;
  for (; i < nbr; i++) {
    j = 0;
    row = [];
    for (; j < len; j++) {
      row.push (arrays [i] [j]);
    }
    result.push (row);
  }
  return result;
};

_.zip2 = (ary1) => function (ary2) {
  var i = 0,
      getLn = (ary) => _.length (_.vowAry (ary)),
      len   = _.max (_.map (getLn) ([ary1, ary2])),
      result = [];
  for (; i < len; i++) {
    result.push ([ary1 [i], ary2 [i]]);
  }
  return result;
};

_.zip3 = (ary1) => (ary2) => function (ary3) {
  var i = 0,
      getLn = (ary) => _.length (_.vowAry (ary)),
      len   = _.max (_.map (getLn) ([ary1, ary2, ary3])),
      result = [];
  for (; i < len; i++) {
    result.push ([ary1 [i], ary2 [i], ary3 [i]]);
  }
  return result;
};

_.zipEach = (itr) => function (arrays) {
  var  getLn = (ary) => _.length (_.vowAry (ary)),
      lengths = _.map (getLn) (arrays);

  _.vowAllEqualLength (lengths);

  var len = lengths [0],
      nbr = arrays.length,
      applyFn = _.apply (_.vowFn (itr)),
      i = 0,
      argumentSet,
      j;

  for (; i < len; i++) {
    j = 0;
    argumentSet = [];
    for (; j < nbr; j++) {
      argumentSet.push (arrays [j] [i]);
    }
    if (applyFn (argumentSet) === breaker) {
      return;
    }
  }
};

_.zipEach2 = (itr) => (ary1) => function (ary2) {
  _.vowFn (itr);
  var i = 0,
      len1 = (_.vowAry (ary1)).length,
      len2 = (_.vowAry (ary2)).length;
  _.vow (len1 === len2) (equalLengthMsg);
  for (; i < len1; i++) {
    if (itr (ary1 [i]) (ary2 [i]) === breaker) {
      return;
    }
  }
};

alias ('zipApply') ('zipMapCall');

_.zipMap = (itr) => function (arrays) {
  var  getLn = (ary) => _.length (_.vowAry (ary)),
      lengths = _.map (getLn) (arrays);

  _.vowAllEqualLength (lengths);

  var len = lengths [0],
      nbr = arrays.length,
      applyFn = _.apply (_.vowFn (itr)),
      i = 0,
      result = [],
      argumentSet,
      j;

  for (; i < len; i++) {
    j = 0;
    argumentSet = [];
    for (; j < nbr; j++) {
      argumentSet.push (arrays [j] [i]);
    }
    result.push (applyFn (argumentSet));
  }
  return result;
};

_.zipMap2 = (itr) => (ary1) => function (ary2) {
  var i = 0,
      result = [],
      len1 = (_.vowAry (ary1)).length,
      len2 = (_.vowAry (ary2)).length;
  _.vow (len1 === len2) (equalLengthMsg);
  for (; i < len1; i++) {
    result.push (itr (ary1 [i]) (ary2 [i]));
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

_.all = _.brkEachWith (false) (_.not (_.identity));

_.allAcross = _.breakAcross (_.not (_.identity));

_.allOf = _.brkEach (_.not (_.identity)) (_.identity);

_.any = _.brkEachWith (false) (_.identity);

_.anyAcross = _.breakAcross (_.identity);

_.anyOf = _.brkEach (_.identity) (_.identity);

// This is probably incorrect.
_.applyDown = _.breakDown (_.apply);

_.applyOn = _.flip (_.apply);

_.arrayify = _.split ('');

_.atOn = _.flip (_.at);

_.breakIfTrue = _.breakIf (_.identity);

_.breakIfFalse = _.breakIf (_.not (_.identity));

// This is a function to implement a 'maybe' monad.
_.bypass = _.bypassWith (null);

// This is a function to implement a 'maybe' monad.
_.bypassVacant = _.bypass (_.vacant);

_.callDown = _.breakDown (_.call);

_.charAtOn = _.flip (_.charAt);

_.composeDown = _.breakDown (_.compose);

_.concatDown = _.breakDown (_.concat);

_.containsOn = _.flip (_.contains);

// This is a function to implement a 'maybe' monad.
_.default = _.defaultWith (_.vacant);

_.doDown = _.breakDown (_.do);

// Use case: var fn1 = _.dont; fn1 ([fn2, fn3, fn4]) (5);
_.dont = _.thunk1 (_.identity);

_.dotProduct = _.zipMap2 (_.multiply);

_.eachCharOn = _.flip (_.eachChar);

_.eachOn = _.flip (_.each);

_.equivDown = _.breakDown (_.equiv);

_.interject1 = _.flip (_.do2) (_.identity);

_.interjectDown = _.breakDown (_.interject);

// The suffix 'Tnl' indicates an instance of the #tunnel pattern.
_.logTnl = _.tunnel (console.log);

_.mapOn = _.flip (_.map);

_.matchOn = _.flip (_.match);

// _.none = (itr) => _.all (_.not (itr));
_.none = (itr) => _.brkEachWith (true) (_.not (_.identity)) (_.not (itr));

// _.notAll = (itr) => _.any (_.not (itr));
_.notAll = (itr) => _.brkEachWith (true) (_.identity) (_.not (itr));

_.pairOn = _.flip (_.pair);

_.pipeDown = _.breakDown (_.pipe);

_.putAt = _.let = _.flip (_.put);

_.replaceAt = _.flip (_.replace);
_.replaceFirst = _.replaceAt (0);

_.sequence = _.comprehend (0) (_.incr);

_.sliceOn = _.flip (_.slice);

_.thunkDown = _.breakDown (_.thunk2 (_.call));

_.vowAry = _.vowWith (_.isArray) (aryMsg);
_.vowAllAry = _.map (_.vowAry);

_.vowBool = _.vowWith (_.isBoolean) (boolMsg);
_.vowAllBool = _.map (_.vowBool);

_.vowDef = _.vowWith (_.defined) (defMsg);
_.vowAllDef = _.map (_.vowDef);

_.vowFn = _.vowWith (_.isFunction) (fnMsg);
_.vowAllFn = _.map (_.vowFn);

_.vowFull = _.vowWith (_.full) (fullMsg);
_.vowAllFull = _.map (_.vowFull);

_.vowHsh = _.vowWith (_.isHash) (hshMsg);
_.vowAllHsh = _.map (_.vowHsh);

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

_.vowRgx = _.vowWith (_.isRegex) (rgxMsg);
_.vowAllRgx = _.map (_.vowRgx)

_.vowStr = _.vowWith (_.isString) (strMsg);
_.vowAllStr = _.map (_.vowStr);

_.vowThk = _.vowWith (_.isThunk) (thkMsg);
_.vowAllThk = _.map (_.vowThk);

_.zipAssign = _.zipReduceWith ({}) (assign);

_.zipApply = _.zipMap2 (_.call2);

_.zipCall = _.zipEach2 (_.call2);
_.zipCallThru = _.zipEach2 (_.each);

// bird combinators
//_.eagle;
//_.baldEagle;
//_.goldfinch;
//_.hummingbird;
//_.jay;
//_.kestrel = (a) => (b) => a; // related to kite and _.tunnel
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
//
// Z combinator is the applicative-order version of the Y combinator.
//
// var a = (f) => f (f);
// var b = (g) => g (g);
// var omega = a (b);
//var omega = (((f) => f (f)) ((g) => g (g)));
// omega prevents termination b/c of the
// self-application of the intermediate fns
//
// var callcc =
// (f, cc) => f ((x, k) => cc (x), cc);
// callcc (f, _.identity) --> 
// what's the purpose of 'k'?

setAliases ();

module.exports = _;
