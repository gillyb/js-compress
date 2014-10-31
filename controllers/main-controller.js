
var fs = require('fs');
var arrayUtils = require('../scripts/array-utils.js');
var util = require('util');
var multiparty = require('multiparty');

var yuiCompressor = require('../compressors/yui-compressor.js');
var jsMinCompressor = require('../compressors/jsmin-compressor.js');
var uglifyCompressor = require('../compressors/uglify-compressor.js');

var jsCompressor = require('../compressor.js');

app.get('/', function(req, res) {
    res.render('homepage', {
        pageHash: arrayUtils.createHash()
    });
});

app.post('/compress-text', function(req, res) {

    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {

        //console.log('fields : ' + JSON.stringify(fields['jsCompressor']));

        var chosenCompressor = _getChosenCompressor(fields['jsCompressor'][0]);

        if (err) {
            // TODO: give user some feedback...
            //console.log('Error...\n' + JSON.stringify(err));
            res.json({});
        }

        var jsInput = fields['jsInput'];

        jsCompressor.compressJs(jsInput, chosenCompressor).then(function(compressedData) {
            //console.log(JSON.stringify(compressedData));
            res.json(compressedData);
        });
    });
});

app.post('/upload', function(req, res) {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
        if (err) { // TODO: take better care of error and notify user
            console.log('Error occurred : \n' + err);
            res.json({});
        }

        //console.log('fields : ' + JSON.stringify(fields));
        //console.log('files : ' + JSON.stringify(files));

        var dirName = _getDirName(fields['page-hash']);
        if (!fs.existsSync(dirName)) {
            var dateDir = dirName.split('/')[0] + '/' + dirName.split('/')[1];
            if (!fs.existsSync(dateDir))
                fs.mkdirSync(dateDir);
            fs.mkdirSync(dirName);
        }

        // copy the files
        var copyCount = 0;
        for (var i=0; i<files.file.length; i++) {
            var tempFilePath = files.file[i].path;
            var originalFilename = files.file[i].originalFilename;

            fs.createReadStream(tempFilePath)
                .pipe(fs.createWriteStream(dirName + '/' + originalFilename)
                    .on('close', function(err) {
                        if (err)
                            console.log('error : ' + err);
                        //console.log('file copied');

                        fs.unlink(tempFilePath, function(err) {
                            if (err)
                                console.log('error deleting file : ' + err);

                            copyCount++;
                            if (copyCount == files.length)
                                res.json({});
                        });
                    }));
        }

    });
});

app.post('/compress-files', function(req, res) {
    var chosenCompressor = _getChosenCompressor(req.param('jsCompressor'));

    var dirName = _getDirName(req.param('pageHash'));
    var jsFiles = JSON.parse(req.param('jsFiles'));
    var filesContent = [];
    var filesReadCount = 0;

    for (var i=0; i<jsFiles.length; i++) {
        var jsFile = dirName + '/' + jsFiles[i];
        (function(jsFileName, ix) {
            fs.exists(jsFileName, function(jsFilesExists) {
                if (!jsFilesExists)
                    console.log('Failed to find js file : ' + jsFileName);

                fs.readFile(jsFileName, function(err, data) {
                    if (err) {
                        console.log('Error occurred : ' + err);
                        res.json({});
                    }

                    filesContent[ix] = data.toString();

                    filesReadCount++;
                    if (filesReadCount == jsFiles.length) {
                        // we read all the files, now compress and return to user
                        jsCompressor.compressJs(filesContent, chosenCompressor).then(function(compressedJs) {
                            // save compressed files

                            //console.log('::' + compressedJs.length + '::');

                            var compressedFileCount = 0;
                            for (var j=0; j<compressedJs.length; j++) {
                                console.log(dirName + '/' + compressedJs[j].file);
                                fs.writeFile(dirName + '/' + compressedJs[j].file + '.js', compressedJs[j].compressed, function(ex) {
                                    if (ex) {
                                        console.log('error occurred while trying to write file');
                                        res.json({});
                                    }

                                    compressedFileCount++;
                                    if (compressedFileCount == compressedJs.length) {
                                        res.json(compressedJs);
                                    }
                                });
                            }
                        });
                    }
                });
            });
        })(jsFile, i);
    }
});

app.post('/delete-file', function(req, res) {
    var filename = req.param('filename');
    var pageHash = req.param('pageHash');
    var dirName = _getDirName(pageHash);
    fs.unlink(dirName + '/' + filename, function() {
        res.end();
    });
});

app.get('/output/:date/:hash/:file', function(req, res) {
    //console.log('download request');
    var file = __dirname + '/../output/' + req.param('date') + '/' + req.param('hash') + '/' + req.param('file');
    res.download(file);
});

var _getDirName = function(hash) {
    var date = new Date();
    var dirName = 'output/' + date.getFullYear() + '' + (date.getMonth()+1) + '' + date.getDate();
    dirName += '/' + hash;
    return dirName;
};

var _getChosenCompressor = function(compressors) {
    var chosenCompressor = undefined;
    if (compressors == 'yui-compressor')
        chosenCompressor = yuiCompressor;
    else if (compressors == 'jsmin-compressor')
        chosenCompressor = jsMinCompressor;
    else if (compressors == 'uglify-compressor')
        chosenCompressor = uglifyCompressor;
    else if (compressors == 'all-compressor')
        chosenCompressor = [yuiCompressor, jsMinCompressor, uglifyCompressor];
    return chosenCompressor;
};