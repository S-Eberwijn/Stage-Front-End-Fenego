var express = require('express');
var favicon = require('serve-favicon');
let fs = require('fs');

var app = express();

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));


app.get('/', function (req, res) {
    res.sendFile('index.html', { root: `${__dirname}` });
});

app.get('/barcode', function (req, res) {
    res.sendFile('barcode.html', { root: `${__dirname}\\public` });
});

app.get('/startscreen', function (req, res) {
    res.sendFile('startscreen.html', { root: `${__dirname}\\public` });
});

app.get('/face', function (req, res) {
    res.sendFile('face.html', { root: `${__dirname}\\public` });
});

app.get('/face2', function (req, res) {
    console.log("face2");
    try {
        console.log("Try")
        fs.unlinkSync("./something.jpg");
    } catch (e){
        console.log('catch');
        res.sendFile('face2.html', { root: `${__dirname}\\public` });
    }
    finally {
        console.log("finally");
        let oldPath = 'C:/Users/11802010/Downloads/screenshot.jpg'
        let newPath = './something.jpg'

        fs.rename(oldPath, newPath, function (err) {
            // if (err) throw err
            console.log('Successfully renamed - AKA moved!')
        })
        res.sendFile('face2.html', { root: `${__dirname}\\public` });
    }
});

app.listen(3000, function () {
    console.log("Listening on port 3000!")
});
