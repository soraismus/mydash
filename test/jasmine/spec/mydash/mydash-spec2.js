describe ('mydash', function () {
	var _;
	beforeEach (function () {
		var flag = false;
		require (['mydash/mydash'], function (__) {
			_ = __;
			flag = true;
		});
	});

	describe ('at', () => {
		it ('should return the ith component of an array', () => {
			var ary = [5, 7];
			expect (_.at (0) (ary)) .toEqual (5);
		});
	});

});
