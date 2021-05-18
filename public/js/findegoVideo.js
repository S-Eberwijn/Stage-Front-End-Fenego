const videoElement = document.getElementById("input_video");
const swipeRightButton = document.querySelector(".global-actions .right-action");
const swipeLeftButton = document.querySelector(".global-actions .left-action");

let heartIcon = document.createElement('i');
heartIcon.className = "fas fa-heart fa-5x";

let crossIcon = document.createElement('i');
crossIcon.className = "fas fa-times fa-6x";

const cursor = document.getElementById("cursor");
let isCursorLocked = false;
let cursorX;

function resetCursor() { cursor.style.left = `${50}%` }
var resetCursorTimer = setInterval(resetCursor, 500);

function onResults(results) {
    if (results.multiHandLandmarks !== undefined) {
        if (results.multiHandLandmarks[0] !== undefined) {
            clearInterval(idleTimer);
            clearInterval(resetCursorTimer)

            cursorX = results.multiHandLandmarks[0][12].x * 150;
            cursorX = 125 - cursorX;
            console.log(isCursorLocked)

            if (isCursorLocked) return;

            if (cursorX > 7 && cursorX < 93) {
                cursor.style.left = cursorX + "%";
            } else if (cursorX <= 7) {
                cursor.style.left = 8 + "%";
            } else if (cursorX >= 93) {
                cursor.style.left = 92 + "%";
            }

            isCollidingButton(cursor, swipeLeftButton);
            isCollidingButton(cursor, swipeRightButton);

            idleTimer = setInterval(redirectToStandby, 120000);
            resetCursorTimer = setInterval(resetCursor, 500);
        }
    }
}


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
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});

setTimeout(() => {
    camera.start();
}, 750);


//This is for motion control
swipeLeftButton.addEventListener('animationend', function () {
    document.querySelector('div.card-stack div.card').classList.add('swipe-left');
    document.querySelector('div.card-stack div.card .card-overlay').appendChild(crossIcon)
    document.querySelector('div.card-stack div.card .card-overlay').classList.add('left');

    resetCursor();
    isCursorLocked = true;
    setTimeout(() => { isCursorLocked = false }, 1000);
});
swipeRightButton.addEventListener('animationend', function () {
    document.querySelector('div.card-stack div.card').classList.add('swipe-right');
    document.querySelector('div.card-stack div.card .card-overlay').appendChild(heartIcon)
    document.querySelector('div.card-stack div.card .card-overlay').classList.add('right');

    resetCursor();
    isCursorLocked = true;
    setTimeout(() => { isCursorLocked = false }, 1000);
});


