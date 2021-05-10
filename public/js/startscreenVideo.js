const videoElement = document.getElementById("input_video");
const cursor = document.getElementById("cursorLeft");
const modes = document.querySelectorAll('div.mode');
let cursorY, cursorX;


function onResults(results) {
    if (results.multiHandLandmarks !== undefined) {
        if (results.multiHandLandmarks[0] !== undefined) {
            cursor.style.display = "block";
            cursorX = results.multiHandLandmarks[0][12].x * 150;
            cursorY = results.multiHandLandmarks[0][12].y * 150;
            cursorX = 100 - cursorX;
            cursor.style.left = cursorX + "%";
            cursor.style.top = cursorY + "%";

            modes.forEach(mode => {
                isCollidingButton(cursor, mode);
            });
        }
    }
}

modes.forEach(mode => {
    mode.addEventListener('animationend', function() {
        if (mode.id.toLowerCase().includes('findego')) {
            console.log('findego');
            window.location.href = "/findego";
        } else if (mode.id.toLowerCase().includes('main')) {
            console.log('main');
            window.location.href = "/main";
        }
    })
})

function isColliding(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

function isCollidingButton(cursor, button) {
    if (isColliding(cursor.getBoundingClientRect(), button.getBoundingClientRect()) && !button.classList.contains('disabled')) {
        button.classList.add('selecting');
    } else {
        if (button.classList.contains('selecting')) {
            button.classList.remove('selecting');
        }
    }
}

const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
    }
});

hands.onResults(onResults);

/**
 * Instantiate a camera. We'll feed each frame we receive into the solution.
 */
const camera = new Camera(videoElement, {
    onFrame: async() => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});

setTimeout(() => {
    camera.start();
}, 750);