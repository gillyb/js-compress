
var q = require('q');

module.exports = {

    // data : the string of js to compress. This can also be an array of multiple strings
    // compressors : an array of compressors to use
    // returns an object with the compressed data including metadata.
    // [{
    // 	compressor: 'yui',
    // 	prev_data_size: 132001,
    // 	new_data_size: 14302,
    // 	compressed: '<js compressed>'
    //  status: 'OK', 'ERROR'
    // }, {...}]
    //
    // Each compressor returns data in this form :
    // {
    //  compressed: '...<compressed_js>...',
    //  status: 'OK'/'ERROR'
    // }
    compressJs: function(data, compressors) {
        var deferred = q.defer();

        if (typeof data == 'string')
            data = [data];
        if (Object.prototype.toString.call(compressors) != '[object Array]')
            compressors = [compressors];

        var bigPromises = [];
        var compressedData = [];
        compressors.forEach(function(compressor) {

            var promises = [];
            var originalJsSize = 0;

            data.forEach(function(jsString) {
                var compressing = compressor['compressJs'].apply(this, [jsString]);
                promises.push(compressing);
                originalJsSize += jsString.length;
            });

            var bigPromise = q.all(promises).then(function(results) {
                var error = false;
                var jsCombined = '';
                for (var i=0; i<results.length; i++) {
                    if (results[i].status == 'OK')
                        jsCombined += results[i].compressed;
                    else
                        error = true;
                }

                compressedData.push({
                    compressor: compressor.name,
                    file: compressor.file,
                    prev_data_size: originalJsSize,
                    new_data_size: jsCombined.length,
                    compressed: jsCombined,
                    status: error ? 'ERROR' : 'OK'
                });
            });
            bigPromises.push(bigPromise);

        });

        q.all(bigPromises).then(function(){
            deferred.resolve(compressedData);
        });

        return deferred.promise;
    }
};