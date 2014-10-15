
var fs = require('fs');
var arrayUtils = require('../scripts/array-utils.js');
var util = require('util');
var multiparty = require('multiparty');

var yuiCompressor = require('../compressors/yui-compressor.js');
var jsMinCompressor = require('../compressors/jsmin-compressor.js');

var jsCompressor = require('../compressor.js');

app.get('/', function(req, res) {
    res.render('homepage', {
        pageHash: arrayUtils.createHash()
    });
});

app.post('/compress-text', function(req, res) {

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        console.log('fields : ' + JSON.stringify(fields['jsCompressor']));

        var chosenCompressor = _getChosenCompressor(fields['jsCompressor']);

        if (err) {
            // TODO: give user some feedback...
            console.log('Error...\n' + JSON.stringify(err));
        }

        var jsInput = fields['jsInput'];

        jsCompressor.compressJs(jsInput, chosenCompressor).then(function(compressedData) {
            console.log(JSON.stringify(compressedData));
            res.json(compressedData);
        });

    });

});

app.post('/upload', function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err) // TODO: take better care of error and notify user
            console.log('Error occurred : \n' + err);

        console.log('fields : ' + JSON.stringify(fields));
        console.log('files : ' + JSON.stringify(files));

        var dirName = _getDirName(fields['page-hash']);
        if (!fs.existsSync(dirName)) {
            var dateDir = dirName.split('/')[0];
            if (!fs.existsSync(dateDir))
                fs.mkdirSync(dateDir);
            fs.mkdirSync(dirName);
        }

        // copy the file
        for (var i=0; i<files.file.length; i++) {
            var tempFilePath = files.file[i].path;
            var originalFilename = files.file[i].originalFilename;

            fs.createReadStream(tempFilePath)
                .pipe(fs.createWriteStream(dirName + '/' + originalFilename)
                    .on('close', function(err) {
                        if (err) console.log('error : ' + err);
                        console.log('file copied');
                        fs.unlink(tempFilePath, function(err) {
                            if (err) console.log('error deleting file : ' + err);
                            console.log('file deleted');
                        });
                    }));
        }

    });
});

app.post('/compress-files', function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err) // TODO: take better care of the error and notify user!
            console.log('Error occurred : \n' + err);

        console.log('fields : ' + JSON.stringify(fields));

        var chosenCompressor = _getChosenCompressor(fields['jsCompressor']);

        var dirName = _getDirName(fields['page-hash']);
        var jsFiles = fields['js-files'];
        var filesContent = [];
        var filesReadCount = 0;

        for (var i=0; i<jsFiles.length; i++) {
            var jsFile = dirName + '/' + jsFiles[i];
            (function(jsFileName, ix) {
                fs.exists(jsFileName, function(jsFilesExists) {
                    if (!jsFilesExists)
                        console.log('Failed to find js file : ' + jsFileName);

                    fs.readFile(jsFileName, function(err, data) {
                        if (err)
                            console.log('Error occurred : ' + err);

                        filesContent[ix] = data;

                        filesReadCount++;
                        if (filesReadCount == jsFiles.length) {
                            // we read all the files, now compress and return to user
                            jsCompressor.compressJs(filesContent, chosenCompressor).then(function(compressedJs) {
                                res.json(compressedJs);
                            });
                        }
                    });
                });
            })(jsFile, i);
        }
    });
});

var _getDirName = function(hash) {
    var date = new Date();
    var dirName = '' + date.getFullYear() + '' + (date.getMonth()+1) + '' + date.getDate();
    dirName += '/' + hash;
    return dirName;
};

var _getChosenCompressor = function(compressors) {
    var chosenCompressor = undefined;
    if (compressors[0] == 'yui-compressor')
        chosenCompressor = yuiCompressor;
    else if (compressors[0] == 'jsmin-compressor')
        chosenCompressor = jsMinCompressor;
    else if (compressors[0] == 'all-compressor')
        chosenCompressor = [yuiCompressor, jsMinCompressor];
    return chosenCompressor;
};