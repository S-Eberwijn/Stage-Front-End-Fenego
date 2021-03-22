let video = document.getElementById("inputVideo");

// video.style.height = document.body.offsetHeight;
// video.style.width = document.body.offsetWidth;
// console.log('worked');

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
        })
        .catch(function(err0r) {
            console.log("Something went wrong!");
        });
}