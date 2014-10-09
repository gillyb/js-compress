
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

app = express();
var __port__ = 9090;


// configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/img'));
app.use(express.static(__dirname + '/public'));

app.disable('x-powered-by');
app.set('view engine', 'jade')
app.set('views', __dirname + '/views');


// controllers
require('./controllers/main-controller.js');


app.listen(__port__, function() {
	console.log('listening on port : ' + __port__);
}).on('error', function(ex) {
	console.log('server error : ' + ex);
});