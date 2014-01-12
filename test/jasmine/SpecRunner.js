require.config({
  baseUrl: "../../js/",
  urlArgs: 'cb=' + Math.random(),
  paths: {
    jasmine: '../test/lib/jasmine',
    'jasmine-html': '../test/lib/jasmine-html',
    testem: '/testem',
    spec: '../test/jasmine/spec/'
  },
  shim: {
    jasmine: {
      exports: 'jasmine'
    },
    'jasmine-html': {
      deps: ['jasmine'],
      exports: 'jasmine'
    }
  }
});

require (['jasmine-html', 'testem'], function () {

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.updateInterval = 1000;

  var htmlReporter = new jasmine.HtmlReporter();

  jasmineEnv.addReporter(htmlReporter);

  jasmineEnv.specFilter = function(spec) {
    return htmlReporter.specFilter(spec);
  };

  var specs = [];

	specs.push('spec/mydash/mydash-spec');
	specs.push('spec/mydash/trial-spec');

	require (specs, function () {
		jasmineEnv.execute ();
	});
});
