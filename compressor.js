
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
		//console.log('data : ' + data);
		var promise = yuiCompressor.compressJs(filename);
		compressionPromises.push(promise);
	});
});

q.allSettled(compressionPromises).then(function(results) {
	console.log('\nfinished compressing');
	console.log(results);

	console.log('\n\nmy work here is done... :) ');
});