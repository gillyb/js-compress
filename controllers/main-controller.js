
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

		var chosenCompressor = undefined;
		if (fields['jsCompressor'][0] == 'yui-compressor')
			chosenCompressor = yuiCompressor;
		else if (fields['jsCompressor'][0] == 'jsmin-compressor')
			chosenCompressor = jsMinCompressor;
		else if (fields['jsCompressor'][0] == 'all-compressor')
			chosenCompressor = [yuiCompressor, jsMinCompressor];

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
	// do nothing for now...
	// TODO: save file on server and minify...
	// TODO: make sure we delete file after usage...



	res.end();
});