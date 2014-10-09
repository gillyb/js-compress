
var yuiCompressor = require('../compressors/yui-compressor.js');
var jsMinCompressor = require('../compressors/jsmin-compressor.js');

var jsCompressor = require('../compressor.js');

app.get('/', function(req, res) {
	res.render('homepage');
});

app.post('/compress-text', function(req, res) {
	var jsText = req.body['jsText'];

	console.log(jsText);
	jsCompressor.compressJs(jsText, yuiCompressor)
		.then(function(compressedData) {
			console.log(JSON.stringify(compressedData));
			res.json(compressedData);
		});
});

app.post('/upload', function(req, res) {
	// do nothing for now...
	// TODO: save file on server and minify...
	// TODO: make sure we delete file after usage...
	res.end();
});