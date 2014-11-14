
var uglify = require('uglify-js');
var q = require('q');

module.exports = {

    name: 'UglifyJS',
    file: 'uglify-compressor',

    compressJs: function(js) {
        var deferred = q.defer();

        try {
            var parsed = uglify.parser.parse(js);
            parsed = uglify.uglify.ast_mangle(parsed);
            var out = uglify.uglify.gen_code(parsed);

            deferred.resolve({
                compressed: out,
                status: 'OK'
            });
        }
        catch (ex) {
            deferred.resolve({
                compressed: '',
                status: 'ERROR'
            });
        }

        return deferred.promise;
    },
    compressCss: function(css) {
        // TODO: not implemented yet...
    }

};