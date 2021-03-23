const videoElement = document.getElementById("input_video");
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const cursorElement = document.getElementById("cursor");

let cursorY, cursorX;
function onResults(results) {

    if (results.multiHandLandmarks[0] !== undefined) {
        console.log(results.multiHandLandmarks[0][9])
        cursor.style.display = "block";
        cursorX = results.multiHandLandmarks[0][9].x*100;
        cursorY = results.multiHandLandmarks[0][9].y*100;
        cursorX = 100 - cursorX;
        cursor.style.left = cursorX + "%";
        cursor.style.top = cursorY + "%";

        document.querySelectorAll('div.item').forEach(item => {
            //Check for each item-box if the cursor is colliding.

            if (isColliding(cursor.getBoundingClientRect(), item.getBoundingClientRect())) {
                if (!item.classList.contains('selected')) {
                    for (let index = 0; index < Carousel.numVisible; index++) {
                        if (item.parentElement.children[index] === item) {
                            item.classList.add('selectingItem');
                        }
                    }
                }
            } else {
                if (item.classList.contains('selectingItem')) {
                    item.classList.remove('selectingItem');
                }
            }
        });
        //Check for each next-button if the cursor is colliding.
        nextButtons.forEach(button => {
            if (isColliding(cursor.getBoundingClientRect(), button.getBoundingClientRect())) {
                button.classList.add('arrow-down');
            } else {
                if (button.classList.contains('arrow-down')) {
                    button.classList.remove('arrow-down');
                }
            }
        });
        //Check for each previous-button if the cursor is colliding.
        previousButtons.forEach(button => {
            if (isColliding(cursor.getBoundingClientRect(), button.getBoundingClientRect())) {
                button.classList.add('arrow-up');
            } else {
                if (button.classList.contains('arrow-up')) {
                    button.classList.remove('arrow-up');
                }
            }
        });
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
    onFrame: async() => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});
camera.start();