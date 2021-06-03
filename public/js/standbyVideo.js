// const videoElement = document.getElementById("input_video");
let handDetectionCounter = 0;

function handDetectionCounterReset() { handDetectionCounter = 0; }
let handDetectionCounterResetTimer = setInterval(handDetectionCounterReset, 2000);

document.addEventListener('mousemove', e => {
    clearInterval(handDetectionCounterResetTimer);

    handDetectionCounter++;
    if (handDetectionCounter > 20) {
        setTimeout(function() {
            window.location.href = '/face';
        }, 2000);
    }
    handDetectionCounterResetTimer = setInterval(handDetectionCounterReset, 2000);
});