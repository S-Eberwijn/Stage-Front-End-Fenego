var express = require('express');
var favicon = require('serve-favicon');

var app = express();

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));


app.get('/', function (req, res) {
    res.sendFile('index.html', { root: `${__dirname}` });
});

app.get('/barcode', function (req, res) {
    res.sendFile('barcode.html', { root: `${__dirname}\\public` });
});

app.get('/main', function (req, res) {
    res.sendFile('FITSmain.html', { root: `${__dirname}\\public` });
});
app.get('/standby', function (req, res) {
    res.sendFile('standby.html', { root: `${__dirname}\\public` });
});
app.get('/findego', function (req, res) {
    res.sendFile('findego.html', { root: `${__dirname}\\public` });
});

// Default every route except the above to serve the 404.html
app.get('*', function (req, res) {
    res.sendFile('404.html', { root: `${__dirname}\\public` });
});

app.listen(3000, function () {
    console.log("Listening on port 3000!")
});
