
var jsmin = require('jsmin').jsmin;
var q = require('q');

module.exports = {

    name: 'JSMin',
    file: 'jsmin-compressor',

    compressJs: function(js) {
        var deferred = q.defer();
        var out = jsmin(js);
        // TODO: check what happens when an error occurs ?
        deferred.resolve({
            compressed: out,
            status: 'OK'
        });
        return deferred.promise;
    },
    compressCss: function(css) {
        // TODO: not implemented yet...
    }

};