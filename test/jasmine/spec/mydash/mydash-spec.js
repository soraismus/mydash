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

	var not = (actual) => function (expected) {
		return expect (expected) .not;
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

	var D = (description) => (fn) => describe (description, fn),
			I = (expectation) => function (val) {
				return _.isFunction (val) ?
					() => it (expectation, val) :
					() => it (expectation, () => val);
			},
			d = (descr) => (expec) => function (val) {
				return D (descr) (I (expec) (val));
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

		describe ('call', ()=>{
			var call = _.thunk (_.call);
			var thunk = () => 5;
			var test1 = call (thunk);
			var test2 = call (5);
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
				var callOn = _.thunk (_.callOn);
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
				var ary = [fn, 1, arg2, 3, 4];
				testDbl (toEqual (7)) (_.cascade (ary));
			});
		});

		describe ('thunkUp', ()=>{
			it ('should return a thunk of all arguments until _.value', ()=>{
				var test = () => _.thunkUp (_.at) (0) ([5]) (_.value);
				toBeFn (test);
				//toEqual (5) (_.call (test));
			});
		});

		describe ('length', ()=>{
			it ('should return the length of an array or the number of enumerable attributes of an object', ()=>{
				var ary = [1, 2, 3, 4];
				var obj = { a: 1, b: 2, c: 3, d: 4 };
				var length = _.thunk (_.length);
				testDbl (toEqual (4)) (length (ary));
				testDbl (toEqual (4)) (length (obj));
			});
		});

		describe ('reduceWith', ()=>{
			it ('should act on a collection to return a single value', ()=>{
				var ary1 = [1, 2, 3, 4];
				var ary2 = [8, 4, 2, 1];
				var obj = { a: 1, b: 2, c: 3, d: 4 };
				var sum = (m) => (i) => m + i;
				var div = (m) => (i) => m / i;
				var reduceWith1 = () => _.reduceWith (0) (sum) (ary1);
				var reduceWith2 = () => _.reduceWith (0) (sum) (obj);
				var reduceWith3 = () => _.reduceWith (64) (div) (ary2);

				testDbl (toEqual (10)) (reduceWith1);
				testDbl (toEqual (10)) (reduceWith2);
				testDbl (toEqual (1)) (reduceWith3);
			});
		});

	});

});
