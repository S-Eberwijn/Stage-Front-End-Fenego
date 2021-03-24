const videoElement = document.getElementById("input_video");
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const cursorLeftElement = document.getElementById("cursorLeft");
const cursorRightElement = document.getElementById("cursorRight");
const spinner = document.getElementById("spinner");
const message = document.getElementById("message");
spinner.style.visibility = "hidden";
message.style.visibility = "hidden";

const mainDiv = document.getElementById("main");
mainDiv.onanimationend = (e) => {
    mainDiv.style.opacity = "1";
};




// let cursorLeftY, cursorLeftX;
// let cursorRightY, cursorRightX;
// function onResults(results) {
//     if(results.multiHandLandmarks && results.multiHandedness) {
//         for (let index = 0; index < results.multiHandLandmarks.length; index++) {
//             if (results.multiHandedness[index].label == "Right") {
//                 console.log("Right");
//                 cursorRightElement.style.display = "block";
//                 cursorRightX = results.multiHandLandmarks[index][9].x*100;
//                 cursorRightY = results.multiHandLandmarks[index][9].y*100;
//                 cursorRightX = 100 - cursorRightX;
//                 cursorRightElement.style.left = cursorRightX + "%";
//                 cursorRightElement.style.top = cursorRightY + "%";
//             } else {
//                 console.log("Left");
//                 cursorLeftElement.style.display = "block";
//                 cursorLeftX = results.multiHandLandmarks[index][9].x*100;
//                 cursorLeftY = results.multiHandLandmarks[index][9].y*100;
//                 cursorLeftX = 100 - cursorLeftX;
//                 cursorLeftElement.style.left = cursorLeftX + "%";
//                 cursorLeftElement.style.top = cursorLeftY + "%";
//             }
//         }
//     }
//     document.querySelectorAll('div.item').forEach(item => {
//         //Check for each item-box if the cursor is colliding.
//         if (isColliding(cursorLeftElement.getBoundingClientRect(), item.getBoundingClientRect()) ||
//             isColliding(cursorRightElement.getBoundingClientRect(), item.getBoundingClientRect())) {
//             if (!item.classList.contains('selected')) {
//                 for (let index = 0; index < Carousel.numVisible; index++) {
//                     if (item.parentElement.children[index] === item) {
//                         item.classList.add('selectingItem');
//                     }
//                 }
//             }
//         } else {
//             if (item.classList.contains('selectingItem')) {
//                 item.classList.remove('selectingItem');
//             }
//         }
//     });
//     //Check for each next-button if the cursor is colliding.
//     nextButtons.forEach(button => {
//         if (isColliding(cursorLeftElement.getBoundingClientRect(), button.getBoundingClientRect()) ||
//             isColliding(cursorRightElement.getBoundingClientRect(), button.getBoundingClientRect())) {
//             button.classList.add('arrow-down');
//         } else {
//             if (button.classList.contains('arrow-down')) {
//                 button.classList.remove('arrow-down');
//             }
//         }
//     });
//
//     //Check for each previous-button if the cursor is colliding.
//     previousButtons.forEach(button => {
//         if (isColliding(cursorLeftElement.getBoundingClientRect(), button.getBoundingClientRect()) ||
//             isColliding(cursorRightElement.getBoundingClientRect(), button.getBoundingClientRect())) {
//             button.classList.add('arrow-up');
//         } else {
//             if (button.classList.contains('arrow-up')) {
//                 button.classList.remove('arrow-up');
//             }
//         }
//     });
// }


let cursorY, cursorX;
function onResults(results) {
    spinner.style.display = "none";
    message.style.display = "none";

    main.classList.add("loaded");

    if (results.multiHandLandmarks !== undefined) {
        if (results.multiHandLandmarks[0] !== undefined) {
            console.log(results.multiHandLandmarks[0][9])
            cursor.style.display = "block";
            cursorX = results.multiHandLandmarks[0][9].x * 100;
            cursorY = results.multiHandLandmarks[0][9].y * 100;
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
    spinner.style.visibility = "visible";
    message.style.visibility = "visible";
    camera.start();
}, 5000);