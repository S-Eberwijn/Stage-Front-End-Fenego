const videoElement = document.getElementById("input_video");
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const cursorRightElement = document.getElementById("cursorRight");
const spinner = document.getElementById("spinner");

let cursorY, cursorX;
function onResults(results) {
    if (isFirstTime) {
        spinnerElement.parentNode.removeChild(spinnerElement);
        mainElement.classList.add('fadeIn');
        mainElement.style.opacity = 1;
        isFirstTime = false;
    }


    if (results.multiHandLandmarks !== undefined) {
        if (results.multiHandLandmarks[0] !== undefined) {
            console.log(results.multiHandLandmarks[0][9])
            cursor.style.display = "block";
            cursorX = results.multiHandLandmarks[0][9].x * 100;
            cursorY = results.multiHandLandmarks[0][9].y * 100;
            cursorX = 100 - cursorX;
            cursor.style.left = cursorX + "%";
            cursor.style.top = cursorY + "%";

            items.forEach(item => {
                if (isColliding(cursorLeft.getBoundingClientRect(), item.getBoundingClientRect())) {
                    if (!item.classList.contains('selected')) {
                        for (let index = 0; index < MAX_VISIBLE_ITEMS; index++) {
                            if (item.parentElement.children[index] === item) {
                                if (!carouselIsMoving) {
                                    item.classList.add('selecting');
                                }
                            }
                        }
                    }
                } else {
                    if (item.classList.contains('selecting')) {
                        item.classList.remove('selecting');
                    }
                }
            });
            //TODO: Rewrite this to a function.
            //Check for each next-button if the cursor is colliding.
            nextButtons.forEach(button => {
                console.log()
                if (isColliding(cursorLeft.getBoundingClientRect(), button.getBoundingClientRect()) && !button.classList.contains('disabled')) {
                    button.classList.add('selecting');
                } else {
                    if (button.classList.contains('selecting')) {
                        button.classList.remove('selecting');
                    }
                }
            });
            //Check for each previous-button if the cursor is colliding.
            previousButtons.forEach(button => {
                if (isColliding(cursorLeft.getBoundingClientRect(), button.getBoundingClientRect()) && !button.classList.contains('disabled')) {
                    button.classList.add('selecting');
                } else {
                    if (button.classList.contains('selecting')) {
                        button.classList.remove('selecting');
                    }
                }
            });
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
}, greeterAnimationTime);
