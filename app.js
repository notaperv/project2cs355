// import libraries
var express = require('express'),
    ejs     = require('ejs'),
    bodyParser = require('body-parser');


// import routes
var routes = require('./controller/index');
var details = require('./controller/details');
var host  = require('./controller/host');
var server = require('./controller/server');

// initialize express web application framework
// http://expressjs.com/
var app = express();

// these two lines replace bodyParser()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// configure static directory
app.use(express.static('public'));

//configure view rendering engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// subtitle values access via the header template
app.set('subtitle', 'Servertrak');

//configure routes
app.use('/', routes);
app.use('/details', details);
app.use('/host', host);
app.use('/server', server);


app.set('port', 8016);
app.listen(app.get('port'));
console.log("Express server listening on port", app.get('port'));
