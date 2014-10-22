
var uglify = require('uglify-js');
var q = require('q');

module.exports = {

    name: 'UglifyJS',
    file: 'uglify-compressor',

    compressJs: function(js) {
        var deferred = q.defer();
        var out = uglify.minify(js, {fromString:true});
        deferred.resolve(out.code);
        return deferred.promise;
    },
    compressCss: function(css) {
        // TODO: not implemented yet...
    }

};