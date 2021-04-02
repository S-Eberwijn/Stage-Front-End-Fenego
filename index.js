var express = require('express');
var favicon = require('serve-favicon');
// var requirejs = require('requirejs');
//
// requirejs.config({
//     baseUrl: "./public/js/commercetools",
//     paths: {
//         ProductService: "service/ProductService"
//     },
//     //Pass the top-level main.js/index.js require
//     //function to requirejs so that node modules
//     //are loaded relative to the top-level JS file.
//     nodeRequire: require
// });

// requirejs(['foo', 'bar'],
//     function   (foo,   bar) {
//         //foo and bar are loaded according to requirejs
//         //config, but if not found, then node's require
//         //is used to load the module.
//     });

var app = express();

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));


app.get('/', function (req, res) {
    res.sendFile('index.html', { root: `${__dirname}` });
});

app.get('/barcode', function (req, res) {
    res.sendFile('barcode.html', { root: `${__dirname}\\public` });
});

app.listen(3000, function () {
    console.log("Listening on port 3000!")
});
