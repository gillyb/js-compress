
var compressor = require('./compressor.js');

var yuiCompressor = require('./compressors/yui-compressor.js');
var jsMinCompressor = require('./compressors/jsmin-compressor.js');

var fs = require('fs');

var compressors = [
	yuiCompressor,
	jsMinCompressor
];

var filesToCompress = [
	'D:\\Dev\\js-compress\\test\\ajax.js',
	'D:\\dev\\js-compress\\test\\core.js',
	'D:\\dev\\js-compress\\test\\event.js'
];

var i = 0;
var jsStrings = [];
filesToCompress.forEach(function(filename) {
	fs.readFile(filename, function(err, data) {
		jsStrings.push(data.toString());
		i++;
		if (i == 3)
			startCompressing();
	});
});

function startCompressing() {
	compressor.compressJs(jsStrings, [yuiCompressor, jsMinCompressor])
		.then(function(results) {
			// results is the json object returned
			//console.log(results);
			console.log('\n\nDone!');
		});
}