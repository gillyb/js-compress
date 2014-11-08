
var compressor = require('closure-compiler');
var q = require('q');

module.exports = {

    name: 'Closure Compiler',
    file: 'closure-compiler',

    compressJs: function(js) {
        var deferred = q.defer();
        compressor.compile(js, {
            compilation_level: 'SIMPLE_OPTIMIZATIONS'
        },
        function (err, data, extra) {
            if (err) {
                console.log('Closure Compiler :: an error occurred\n' + JSON.stringify(err));
                deferred.resolve({});
                return;
            }
//            if (extra)
//                console.log('Closure Compiler :: extra = ' + extra);

            deferred.resolve(data);
        });
        return deferred.promise;
    },
    compressCss: function(css) {

    }

};
