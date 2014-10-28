
var compressor = require('./compressor.js');

var yuiCompressor = require('./compressors/yui-compressor.js');
var jsMinCompressor = require('./compressors/jsmin-compressor.js');

var fs = require('fs');

var compressors = [
	yuiCompressor/*,
	jsMinCompressor*/
];

var filesToCompress = [
	'/Users/gilly/dev/js-compress/scripts/main.js'/*,
	'/Users/gilly/dev/js-compress/test/core.js',
	'/Users/gilly/dev/js-compress/test/event.js'*/
];

var i = 0;
var jsStrings = [];
filesToCompress.forEach(function(filename) {
	fs.readFile(filename, function(err, data) {
		jsStrings.push(data.toString());
		i++;
		if (i == filesToCompress.length)
			startCompressing();
	});
});

function startCompressing() {
	compressor.compressJs(jsStrings, compressors)
		.then(function(results) {
			// results is the json object returned
			console.log(results);
			console.log('\n\nDone!');
		});
}
