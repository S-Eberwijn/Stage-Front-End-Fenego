var express = require('express');
var favicon = require('serve-favicon');
var childProcess = require('child_process');
const { spawn } = require('child_process')
const logOutput = (name) => (data) => console.log(`[${name}] ${data.toString()}`);
let pythonProcess;
function run() {
    pythonProcess = spawn('python', ['python/media/main.py',"mediapipe","cv2","pypiwin32"]);

    pythonProcess.stdout.on(
        'data',
        logOutput('stdout')
    );

    pythonProcess.stderr.on(
        'data',
        logOutput('stderr')
    );
};

var app = express();

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));


app.get('/', function (req, res) {
    res.sendFile('index.html', { root: `${__dirname}` });
});

app.get('/barcode', function (req, res) {
    pythonProcess.kill('SIGTERM');
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
app.get('/face', function (req, res) {
    res.sendFile('face.html', { root: `${__dirname}\\public` });
});
app.get('/run', function (req, res) {
    run();
});

// Default every route except the above to serve the 404.html
app.get('*', function (req, res) {
    res.sendFile('404.html', { root: `${__dirname}\\public` });
});

app.listen(3000, function () {
    console.log("Listening on port 3000!")
});


childProcess.exec('start chrome --kiosk http;//localhost:3000/run'); //open in kiosk mode, ctrl+W to close or close in taskbar 2nd screen