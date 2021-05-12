const videoElement = document.getElementById("input_video");
let handDetectionCounter = 0;

function handDetectionCounterReset() { handDetectionCounter = 0; }
var handDetectionCounterResetTimer = setInterval(handDetectionCounterReset, 2000);

function onResults(results) {
    if (results.multiHandLandmarks !== undefined) {
        if (results.multiHandLandmarks[0] !== undefined) {
            clearInterval(handDetectionCounterResetTimer);

            console.log('hands detected')
            console.log(handDetectionCounter)

            handDetectionCounter++
            if (handDetectionCounter > 20) {
                setTimeout(function () {
                    window.location.href = '/face';
                }, 2000);
            }
            handDetectionCounterResetTimer = setInterval(handDetectionCounterReset, 2000);
        }
    }
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
    }
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});

setTimeout(() => {
    camera.start();
}, 750);