
var compressor = require('yuicompressor');
var q = require('q');

module.exports = {

    name: 'YUI Compressor',
    file: 'yui-compressor',

    compressJs: function(js) {
        var deferred = q.defer();
        compressor.compress(js, {
            charset: 'utf8',
            type: 'js'
        },
        function (err, data, extra) {
            if (err)
                console.log('YUICompressor :: an error occurred\n' + JSON.stringify(err));
//            if (extra)
//                console.log('YUICompressor :: extra = ' + extra);

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
