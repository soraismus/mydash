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
		toBeFn        = toEqual (any (Function))
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

	//d ('test0') ('work?') (expect(5).toEqual(5));
  D ('test0') (I ('work') (
				expect(5).toEqual(5)
				));


	describe ('test1', function () {
		it ('should work PLEASE', function () {
			expect (5) .toEqual (5);
		});
	});
	describe ('test2', function () {
		it ('works?', function () {
			expect (_) .toEqual (jasmine.any (Object));
		});
	});
});
