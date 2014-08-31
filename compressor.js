
var yuiCompressor = require('./compressors/yui-compressor.js');
var jsMinCompressor = require('./compressors/jsmin-compressor.js');

var fs = require('fs');
var q = require('q');

var compressors = [
	yuiCompressor,
	jsMinCompressor
];

var filesToCompress = [
	'D:\\dev\\js-compress\\test\\ajax.js',
	'D:\\dev\\js-compress\\test\\core.js',
	'D:\\dev\\js-compress\\test\\event.js'
];



console.log('reading files');

var compressionPromises = [];
filesToCompress.forEach(function(filename) {
	fs.readFile(filename, function(err, data) {
		if (err) console.log(err); // TODO: do something useful with this!

		console.log('starting to compress file: ' + filename);
		var promise = yuiCompressor.compressJs(data);
		compressionPromises.push(promise);
	});
});

q.all(compressionPromises).then(function() {
	console.log('\nfinished compressing');
	console.log(JSON.stringify(args));
});

console.log('\n\nmy work here is done... :) ');

