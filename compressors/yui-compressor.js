
var compressor = require('yuicompressor');
var q = require('q');

module.exports = {

	compressJs: function(js) {
		var deferred = q.defer();
		compressor.compress(js, {
			charset: 'utf8',
			type: 'js',
			nomunge: true // don't obfuscate, only minify
		},
		function (err, data, extra) {
			deferred.resolve(data);
		});
		return deferred.promise;
	},
	compressCss: function(css) {
		var deferred = q.defer();
		compressor.compress(css, {
			charset: 'utf8',
			type: 'css'
		},
		function (err, data, extra) {
			deferred.resolve(data);
		});
		return deferred.promise;
	}

};