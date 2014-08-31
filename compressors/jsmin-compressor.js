
var jsmin = require('jsmin').jsmin;
var q = require('q');

module.exports = {
	
	compressJs: function(js) {
		var deferred = q.defer();
		var out = jsmin(js);
		deferred.resolve(out);
		return deferred;
	},
	compressCss: function(css) {
		// TODO: not implemented yet...
	}

};