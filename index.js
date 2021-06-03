var express = require('express');
var favicon = require('serve-favicon');
var childProcess = require('child_process');
const { spawn } = require('child_process')
const logOutput = (name) => (data) => console.log(`[${name}] ${data.toString()}`);
let pythonProcess;

function run() {
    pythonProcess = spawn('python', ['python/media/main.py', "mediapipe", "cv2", "pypiwin32"]);

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

var platformPath = `${__dirname}\\\\public`;
if (process.platform === "linux") {
    platformPath = `${__dirname}\/public`
}
app.use(favicon(__dirname + '/public/favicon.ico'));

app.get('/', function(req, res) {
    res.sendFile('index.html', { root: `${__dirname}` });
});

app.get('/barcode', function(req, res) {
    // pythonProcess.kill('SIGTERM');
    res.sendFile('barcode.html', { root: platformPath });
});

app.get('/main', function(req, res) {
    res.sendFile('FITSmain.html', { root: platformPath });
});
app.get('/standby', function(req, res) {
    run();
    res.sendFile('standby.html', { root: platformPath });
});
app.get('/findego', function(req, res) {
    res.sendFile('findego.html', { root: platformPath });
});
app.get('/face', function(req, res) {
    res.sendFile('face.html', { root: platformPath });
});
app.get('/run', function(req, res) {
    run();
});

// Default every route except the above to serve the 404.html
app.get('*', function(req, res) {
    res.sendFile('404.html', { root: platformPath });
});

app.listen(3000, function() {
    console.log("Listening on port 3000!")
});


childProcess.exec('start chrome --kiosk http;//localhost:3000/standby'); //open in kiosk mode, ctrl+W to close or close in taskbar 2nd screen