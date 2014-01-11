define (['mydash/mydash'], function (_) {

	var
		aryMsg  = 'Invalid array',
		boolMsg = 'Invalid boolean',
		fnMsg   = 'Invalid function',
		idxMsg  = 'Invalid key or index',
		intMsg  = 'Invalid integer',
		nbrMsg  = 'Invalid number',
		objMsg  = 'Invalid object',
		strMsg  = 'Invalid string';

	var toBe = (actual) => function (expected) {
		return _.isFunction (expected) ?
			expect (expected ()) .toBe (actual) :
			expect (expected) .toBe (actual);
	};

	var not = (expected) => (expect (expected)) .not;

	var notToBe = (actual) => (expected) => (not (expected)) .toBe (actual);

	var toContain = (actual) => function (expected) {
		return _.isFunction (expected) ?
			expect (expected ()) .toContain (actual) :
			expect (expected) .toContain (actual);
	};

	var toEqual = (actual) => function (expected) {
		return _.isFunction (expected) ?
			expect (expected ()) .toEqual (actual) :
			expect (expected) .toEqual (actual);
	};

	var
		any           = jasmine.any,
		toBeAry       = toEqual (any (Array)),
		toBeBool      = toEqual (any (Boolean)),
		toBeFn        = toEqual (any (Function)),
		toBeNbr       = toEqual (any (Number)),
		toBeObj       = toEqual (any (Object)),
		toBeStr       = toEqual (any (String)),
		toBeTrue      = toEqual (true),
		toBeFalse     = toEqual (false),
		toBeNull      = toEqual (null),
		toBeUndefined = toEqual (undefined);

	var toHaveLength = (act) => function (exp) {
		return _.isFunction (exp) ?
			expect (_.length (exp ())) .toEqual (act) :
			expect (_.length (exp)) .toEqual (act);
	};

	var toBeIdx = (actual) => function (expected) {
		return _.isFunction (expected) ?
			toBeTrue (_.isIdx (expected ())) :
			toBeTrue (_.isIdx (expected));
	};

	var toBeInt = (actual) => function (expected) {
		return _.isFunction (expected) ?
			toBeTrue (_.isInteger (expected ())) :
			toBeTrue (_.isInteger (expected));
	};

	var toThrow = (actual) => function (expected) {
		return _.isFunction (expected) ?
			expect (expected) .toThrow (actual) :
			expect (() => expected) .toThrow (actual);
	};

	var
		toThrowAryMsg  = toThrow (new Error (aryMsg)),
		toThrowBoolMsg = toThrow (new Error (boolMsg)),
		toThrowFnMsg   = toThrow (new Error (fnMsg)),
		toThrowIdxMsg  = toThrow (new Error (idxMsg)),
		toThrowIntMsg  = toThrow (new Error (intMsg)),
		toThrowNbrMsg  = toThrow (new Error (nbrMsg)),
		toThrowObjMsg  = toThrow (new Error (objMsg)),
		toThrowStrMsg  = toThrow (new Error (strMsg)),
		toThrowTE      = toThrow (any (Error));

	var test = (withGuard) => (withoutGuard) => function (expected) {
		withGuard (expected);
		_.setGuard (false);
		withoutGuard (expected);
		_.restoreGuard ();
	};

	var testDbl = (withGuard) => function (expected) {
		withGuard (expected);
		_.setGuard (false);
		withGuard (expected);
		_.restoreGuard ();
	};

	describe ('ControlGuard Suite', ()=>{
		it ('should control whether guard-testing occurs', ()=>{
			toBeTrue (_.isGuardSet);
			toBeFalse (_.setGuard (false));
			toBeFalse (_.isGuardSet);
			toBeTrue (_.setGuard (true));
			toBeTrue (_.isGuardSet);
			toBeFalse (_.toggleGuard);
			toBeFalse (_.isGuardSet);
			toBeTrue (_.toggleGuard);
			toBeTrue (_.isGuardSet);
			toBeFalse (_.setGuard (false));
			toBeTrue (_.restoreGuard);
			toBeTrue (_.isGuardSet);
		});
	});

	describe ('Determining Type:', () => {
		var slice = Array.prototype.slice;

		describe ('isArguments', ()=>{
			it ('should determine if an object is \'arguments\'', ()=>{
				testDbl (toBeTrue) (_.isArguments (arguments));
				testDbl (toBeFalse) (_.isArguments (slice.call(arguments)));
			})});

		describe ('isArray', ()=>{
			it ('should determine if a value is an array', ()=>{
				testDbl (toBeTrue) (_.isArray ([]));
				testDbl (toBeFalse) (_.isArray ({}));
				testDbl (toBeFalse) (_.isArray (arguments));
				testDbl (toBeTrue) (_.isArray (slice.call(arguments)));
			})});

		describe ('isBoolean', ()=>{
			it ('should determine if a value is boolean', ()=>{
				testDbl (toBeTrue) (_.isBoolean (true));
				testDbl (toBeTrue) (_.isBoolean (false));
				testDbl (toBeFalse) (_.isBoolean (null));
				testDbl (toBeFalse) (_.isBoolean (undefined));
				testDbl (toBeFalse) (_.isBoolean (0));
			})});

		describe ('isDate', ()=>{
			it ('should determine if a value is a date', ()=>{
				testDbl (toBeTrue) (_.isDate (new Date ()));
				testDbl (toBeFalse) (_.isDate ({}));
			})});

		describe ('isFunction', ()=>{
			it ('should determine if a value is a function', ()=>{
				testDbl (toBeTrue) (_.isFunction (_.identity));
				testDbl (toBeFalse) (_.isFunction (0));
			})});

		describe ('isHash', ()=>{
			it ('should determine if a value is a generic object', ()=>{
				testDbl (toBeFalse) (_.isHash (true));
				testDbl (toBeFalse) (_.isHash (0));
				testDbl (toBeFalse) (_.isHash ('a'));
				testDbl (toBeFalse) (_.isHash ([]));
				testDbl (toBeTrue) (_.isHash ({}));
				testDbl (toBeFalse) (_.isHash (/a/));
				testDbl (toBeFalse) (_.isHash (_.identity));
				testDbl (toBeFalse) (_.isHash (new Date ()));
				testDbl (toBeFalse) (_.isHash (new String ('a')));
				testDbl (toBeFalse) (_.isHash (new RegExp ('a')));
				testDbl (toBeFalse) (_.isHash (new Function (_.identity)));
			})});

		describe ('isIndex', ()=>{
			it ('should determine if a value can be an index of an array or object',
				()=>{
					testDbl (toBeTrue) (_.isIndex (0));
					testDbl (toBeTrue) (_.isIndex ('a'));
					testDbl (toBeFalse) (_.isIndex (null));
					testDbl (toBeFalse) (_.isIndex ([]));
					testDbl (toBeFalse) (_.isIndex ({}));
				})});

		describe ('isInteger', ()=>{
			it ('should determine if a value is an integer', ()=>{
				testDbl (toBeTrue) (_.isInteger (0));
				testDbl (toBeTrue) (_.isInteger (1));
				testDbl (toBeFalse) (_.isInteger (0.3));
				testDbl (toBeFalse) (_.isInteger (NaN));
				testDbl (toBeFalse) (_.isInteger (Infinity));
				testDbl (toBeFalse) (_.isInteger (null));
				testDbl (toBeFalse) (_.isInteger ('a'));
				testDbl (toBeFalse) (_.isInteger ([]));
				testDbl (toBeFalse) (_.isInteger ({}));
			})});

		describe ('isNumber', ()=>{
			it ('should determine if a value is a number', ()=>{
				testDbl (toBeTrue) (_.isNumber (0));
				testDbl (toBeTrue) (_.isNumber (1));
				testDbl (toBeTrue) (_.isNumber (0.3));
				testDbl (toBeTrue) (_.isNumber (NaN));
				testDbl (toBeTrue) (_.isNumber (Infinity));
				testDbl (toBeFalse) (_.isNumber (null));
				testDbl (toBeFalse) (_.isNumber ('a'));
				testDbl (toBeFalse) (_.isNumber ([]));
				testDbl (toBeFalse) (_.isNumber ({}));
			})});

		describe ('isFinite', ()=>{
			it ('should determine if a value is a finite number', ()=>{
				testDbl (toBeTrue) (_.isFinite (0));
				testDbl (toBeTrue) (_.isFinite (1));
				testDbl (toBeTrue) (_.isFinite (0.3));
				testDbl (toBeFalse) (_.isFinite (NaN));
				testDbl (toBeFalse) (_.isFinite (Infinity));
				testDbl (toBeFalse) (_.isFinite (-Infinity));
				testDbl (toBeFalse) (_.isFinite (null));
				testDbl (toBeFalse) (_.isFinite ('a'));
				testDbl (toBeFalse) (_.isFinite ([]));
				testDbl (toBeFalse) (_.isFinite ({}));
			})});

		describe ('isNaN', ()=>{
			it ('should determine if a value is NaN', ()=>{
				testDbl (toBeTrue) (_.isNaN (NaN));
				testDbl (toBeFalse) (_.isNaN (null));
				testDbl (toBeFalse) (_.isNaN (undefined));
				testDbl (toBeFalse) (_.isNaN (0));
			})});

		describe ('isObject', ()=>{
			it ('should determine if a value is any kind of  object', ()=>{
				testDbl (toBeFalse) (_.isObject (true));
				testDbl (toBeFalse) (_.isObject (0));
				testDbl (toBeFalse) (_.isObject ('a'));
				testDbl (toBeTrue) (_.isObject ([]));
				testDbl (toBeTrue) (_.isObject ({}));
				testDbl (toBeTrue) (_.isObject (/a/));
				testDbl (toBeTrue) (_.isObject (_.identity));
				testDbl (toBeTrue) (_.isObject (new Date ()));
				testDbl (toBeTrue) (_.isObject (new String ('a')));
				testDbl (toBeTrue) (_.isObject (new RegExp ('a')));
				testDbl (toBeTrue) (_.isObject (new Function (_.identity)));
			})});

		describe ('isRegExp', ()=>{
			it ('should determine if a value is a regexp', ()=>{
				testDbl (toBeTrue) (_.isRegExp (/a/));
				testDbl (toBeTrue) (_.isRegExp (new RegExp ('a')));
				testDbl (toBeFalse) (_.isRegExp ('a'));
				testDbl (toBeFalse) (_.isRegExp ({}));
			})});

		describe ('isString', ()=>{
			it ('should determine if a value is a string', ()=>{
				testDbl (toBeTrue) (_.isString ('a'));
				//testDbl (toBeFalse) (_.isString (new String ('a')));
				testDbl (toBeFalse) (_.isString (null));
				testDbl (toBeFalse) (_.isString (0));
				testDbl (toBeFalse) (_.isString ([]));
				testDbl (toBeFalse) (_.isString ({}));
			})});

	});

	describe ('Collection Functions', ()=>{

		describe ('at', () => {
			var ary = [5, 10],
					obj = { a: 6, b: 11 },
					kys = _.keys (obj);

			it ('should return the ith compoent of an array', () => {
				testDbl (toEqual (5)) (_.at (0) (ary)),
				testDbl (toEqual (10)) (_.at (1) (ary))
			});

			it ('should return the attr corresponding to the ith component of the keys array of an obj', () => {
				testDbl (toEqual (obj [kys [0]])) (_.at (0) (obj));
				testDbl (toEqual (obj [kys [1]])) (_.at (1) (obj));
			});

			it ('should raise an error if the args aren\'t of the right type', () => {
				test (toThrowIntMsg) (toBeUndefined) (() => _.at (null) (ary));
				test (toThrowObjMsg) (toThrow ('val is null')) (() => _.at (0) (null));
			});

		});

		describe ('atOn', () => {
			var ary = [5, 10],
					obj = { a: 6, b: 11 },
					kys = _.keys (obj);

			it ('should return the ith compoent of an array', () => {
				testDbl (toEqual (5)) (_.atOn (ary) (0)),
				testDbl (toEqual (10)) (_.atOn (ary) (1))
			});

			it ('should return the attr corresponding to the ith component of the keys array of an obj', () => {
				testDbl (toEqual (obj [kys [0]])) (_.atOn (obj) (0));
				testDbl (toEqual (obj [kys [1]])) (_.atOn (obj) (1));
			});

			it ('should raise an error if the args aren\'t of the right type', () => {
				test (toThrowIntMsg) (toBeUndefined) (() => _.atOn (ary) (null));
				test (toThrowObjMsg) (toThrow ('val is null')) (() => _.atOn (null) (0));
			});

		});

		describe ('call1', ()=>{
			var call1 = _.thunk2 (_.call1);
			var thunk = () => 5;
			var test1 = call1 (thunk);
			var test2 = call1 (5);
			it ('should trampoline a thunk (i.e., a nullary closure)', ()=>{
				var thunk = () => 5;
				testDbl (toEqual (5)) (test1);
				testDbl (notToBe (any (Function))) (test1);
			});
			it ('should refuse to accept a non-functional argument', ()=>{
				test (toThrowFnMsg) (toThrow) (test2);
			});
		});

		describe ('callOn', ()=>{
			it ('should allow an argument to precede a function', ()=>{
				var callOn = _.thunk2 (_.callOn);
				testDbl (toBeFn) (callOn (5));
				testDbl (toEqual (5)) (_.callOn (5) (_.identity));
			});

			it ('should refuse a non-functional 2nd argument', ()=>{
				test (toThrowFnMsg) (toThrow) (() => _.callOn (5) (5));
			});
		});

		describe ('cascade', ()=>{
			it ('should take the 1st component of an array as a function and then iteratively apply the function onto the remaining elements of the array', ()=>{
				var fn = (i) => (j) => (k) => (l) => j (5);
				var arg2 = (i) => i + 2;
				var ary1 = [fn, 1, arg2, 3, 4];
				var ary2 = [fn]
				testDbl (toEqual (7)) (_.cascade (ary1));
				expect (_.cascade (ary2)) .toEqual (fn);
				
			});
		});

		describe ("compose", function () {
		  var fn1 = (i) => i + 1;
			var fn2 = (i) => 2 * i;
			var fn3 = (i) => i * i * i;

			it ("should return a function that is the chained composition of the fns in the given array", function () {
			 testDbl (toEqual (8)) (_.compose ([fn3, fn2, fn1]) (0));
			});
		});

		describe ("composeDown", function () {
		  var fn1 = (i) => i + 1;
			var fn2 = (i) => 2 * i;
			var fn3 = (i) => i * i * i;

			it ("should return a function that is the chained composition of the fn args", function () {
			 testDbl (toEqual (2)) (_.composeDown (fn2) (fn1) (_.stop) (0));
			 testDbl (toEqual (8)) (_.composeDown (fn3) (fn2) (fn1) (_.stop) (0));
			});
		});

		describe ("each", function () {
			var store = [];
			var fn = (i) => store.push (i);
			var ary = [0, 'a', false];
			var obj = { a: 0, b: 'a', c: false };

			it ("should apply a function to each member of a collection", function () {
				_.each (fn) (ary);
				toContain (0) (store);
				toContain ('a') (store);
				toContain (false) (store);
			});
		});
				

		describe ('length', ()=>{
			it ('should return the length of an array or the number of enumerable attributes of an object', ()=>{
				var ary = [1, 2, 3, 4];
				var obj = { a: 1, b: 2, c: 3, d: 4 };
				var length = _.thunk2 (_.length);
				testDbl (toEqual (4)) (length (ary));
				testDbl (toEqual (4)) (length (obj));
			});
		});

		describe ("map", function () {
		  it ("should return a new array or object, the components of which transformed by the itr", function () {
		    var ary = [1, 2, 4, 8];
				var obj = { a: 1, b: 2, c: 4, d: 8 };
				var itr = (i) => i * i;
				var result1 = _.map (itr) (ary);
				var result2 = _.map (itr) (obj);
				toContain (1) (result1);
				toContain (4) (result1);
				toContain (16) (result1);
				expect (result1) .not.toContain (2);

				toContain (1) (result2);
				toContain (4) (result2);
				toContain (16) (result2);
				expect (result2) .not.toContain (2);
			});
		});

		describe ("copy", function () {
		  it ("should return a deep copy of the argument", function () {
		    var a1 = 5;
				var a2 = "a2";
				var a3 = [];
				var a4 = [a1, a2];
				var a5 = [a1, [a2]];
				var a6 = {};
				var a7 = { a: a1, b: a2 };
				var a8 = { a: a1, b: [a2] };
				var a9 = { a: { b: {} }, c: { d: [{}] } };
				testDbl (toEqual (5)) (_.copy (a1));
				testDbl (toEqual ('a2')) (_.copy (a2));
				testDbl (toBeAry) (_.copy (a3));
				testDbl (toHaveLength (2)) (_.copy (a4));
				testDbl (toContain (a1)) (_.copy (a4));
				testDbl (toContain (a2)) (_.copy (a4));
				testDbl (toHaveLength (2)) (_.copy (a5));
				testDbl (toContain (a1)) (_.copy (a5));
				testDbl (toBeAry) ((_.copy (a5)) [1]);
				testDbl (toBeObj) (_.copy (a6));
				testDbl (toHaveLength (0)) (_.copy (a6));
				testDbl (toBeObj) (_.copy (a7));
				testDbl (toHaveLength (2)) (_.copy (a7));
				testDbl (toEqual (a1)) ((_.copy (a7)) ['a']);
				testDbl (toBeObj) (_.copy (a8));
				testDbl (toHaveLength (2)) (_.copy (a8));
				testDbl (toBeAry) ((_.copy (a8)) ['b']);
				testDbl (toBeObj) (_.copy (a9));
				testDbl (toHaveLength (2)) (_.copy (a9));
				testDbl (toBeAry) ((_.copy (a9)) ['c'] ['d']);
				testDbl (toBeObj) ((_.copy (a9)) ['c'] ['d'] [0]);
				
			});
		});

		describe ("insert", function () {
		  it ("should return a copy of the array but with a new component inserted at the specified index", function () {
				var ary = [2, 4, 6, 8];
				var result = _.insert (100) (2) (ary);
				testDbl (toHaveLength (5)) (result);
				testDbl (toEqual (100)) (result [2]);
				testDbl (toEqual (6)) (result [3]);
			});
		});

		describe ("or", function () {
		  it ("should return a predicate that tests whether any of the component predicates is satisfied", function () {
		    var ary = [(i) => i > 10, (i) => i < 20, (i) => i % 2 === 0];
				var ary2 = [(i) => i > 10, (i) => i % 2 === 0, _.isString];
				var v1 = 12;
				var v2 = 13;
				var result = _.or (ary);
				var result2 = _.or (ary2);
				toBeFn (() => result);
				toBeTrue (result (12));
				toBeTrue (result (13));
				toBeTrue (result (2));
				toBeFalse (result2 (3));
			});
		});

		describe ("pop", function () {
		  it ("should return an array with all the given array's components except the last", function () {
		    var ary1 = [ ['one'], null, 21, { a: 7 } ];
				var ary2 = _.pop (ary1);
				testDbl (toHaveLength (3)) (ary2);
				testDbl (toEqual (21)) (ary2 [ary2.length - 1]);
			});
		});

		describe ("push", function () {
		  it ("should return an array with the first given arg as an additional component", function () {
				var ary1 = [5, 'a2', true];
				var ary2 = _.push (7) (ary1);
				testDbl (toHaveLength (4)) (ary2);
				testDbl (toEqual (7)) (ary2 [ary2.length - 1]);
			});
		});

		describe ("put", function () {
		  it ("should return an array with the specified element at the specified index", function () {
		    var ary = [1, 5, 7];
				var obj = { a: 2, b: 3, c: 4 };
				var result1 = _.put (100) (1) (ary);
				var result2 = _.put (100) ('d') (obj);
				var result3 = _.thunkDown (_.put) (100) ('a') (ary) (_.stop);
				testDbl (toBeAry) (result1);
				testDbl (toHaveLength (3)) (result1);
				testDbl (toEqual (100)) (result1 [1]);
				test (toThrowIntMsg) (toThrow) (result3);
				testDbl (toBeObj) (result2);
				testDbl (toHaveLength (4)) (result2);
				testDbl (toEqual (100)) (result2 ['d']);
			});
		});

		describe ("range", function () {
		  it ("should return an appropriate arithemetic progression", function () {
		    toHaveLength (1) (_.range ([1]));
				toContain (0) (_.range ([1]));
				toHaveLength (2) (_.range ([2]));
				toContain (0) (_.range ([2]));
				toContain (1) (_.range ([2]));
				toHaveLength (20) (_.range ([20]));
				toContain (0) (_.range ([20]));
				toContain (19) (_.range ([20]));
				expect (_.range ([20])) .not.toContain (20);
				//console.log (_.range ([5, 10]));
				//console.log (_.range ([5, 11, 2]));
				//console.log (_.range ([3, 13, 3]));
			});
		});

		describe ('reduceWith', ()=>{
			it ('should act on a collection to return a single value', ()=>{
				var ary1 = [1, 2, 3, 4];
				var ary2 = [8, 4, 2, 1];
				var ary3 = [];
				var obj = { a: 1, b: 2, c: 3, d: 4 };
				var sum = (m) => (i) => m + i;
				var div = (m) => (i) => m / i;
				var fn = () => 5;

				testDbl (toEqual (10)) (_.reduceWith (0) (sum) (ary1));
				testDbl (toEqual (1)) (_.reduceWith (64) (div) (ary2));
				testDbl (toEqual (0)) (_.reduceWith (0) (sum) ([]));
				testDbl (toEqual (1)) (_.reduceWith (1) (div) ([]));
				expect (_.reduceWith (fn) (sum) ([])) .toEqual (fn);
			});
		});

		describe ('thunkDown', ()=>{
			it ('should return a thunk of all arguments until _.stop', ()=>{
				var test = () => _.thunkDown (_.at) (0) ([5]) (_.stop);
				toEqual (5) (_.call1 (test));
				expect ((_.thunkDown (_.at) (0) ([5]) (_.stop)) ()) .toEqual (5);
			})
		});

		describe ("zipReduceWith", function () {
			it ('should act on two collections to return a single value', ()=>{
		    var ary1 = [1, 2, 3, 4];
				var ary2 = [2, 4, 6, 8];
				var itr = ((memo) => (i) => (j) => [memo [0] + i, memo [1] + j]);
				var result = _.zipReduceWith ([0, 0]) (itr) (ary1) (ary2);
				expect (result [0]) .toEqual (10);
				testDbl (toContain (10)) (result);
				testDbl (toContain (20)) (result);
			});
		});

		describe ("zipAssign", function () {
		  it ("creates an object with the components of the first array as its keys and the components of the second array as its respective attributes", function () {
		    var keys = ['a', 'b', 'c'];
				var attributes = [5, 'attr2', false];
				var result = _.zipAssign (keys) (attributes);
				testDbl (toBeObj) (result);
				testDbl (toEqual (5)) (result ['a']);
				testDbl (toEqual ('attr2')) (result ['b']);
			});
		});

	});

	describe ("String Functions", function () {
	  
		describe ("concat", function () {
		  it ("should concatenate multiple strings", function () {
		    var ary = ['a', 'b', 'c'];
				var result = _.concat (ary);
				testDbl (toBeStr) (result);
				testDbl (toEqual ('abc')) (result);
			});
		});

		describe ("split", function () {
		  it ("should split a string into an array", function () {
		    var str = 'a,b,c,d,e';
				var mrk = ',';
				var result = _.split (mrk) (str);
				testDbl (toBeAry) (result);
				testDbl (toHaveLength (5)) (result);
				testDbl (toEqual ('c')) (result [2]);
			});
		});

	});

});
