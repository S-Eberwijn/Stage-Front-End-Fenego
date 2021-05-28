const greeting = document.getElementById('greeting');
const videoElement = document.getElementById("input_video");
const cursor = document.getElementById("cursor");
const modes = document.querySelectorAll('div.mode');
const wrapper = document.querySelector('#wrapper');

let cursorY, cursorX;

document.addEventListener('mousemove', e => {
    clearInterval(idleTimer);

    cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px; display: block;`);

    idleTimer = setInterval(redirectToStandby, 120000);
});

// function onResults(results) {
//     if (results.multiHandLandmarks !== undefined) {
//         if (results.multiHandLandmarks[0] !== undefined) {
//             clearInterval(idleTimer);
//             cursor.style.display = "block";
//             cursorX = results.multiHandLandmarks[0][12].x * 150;
//             cursorY = results.multiHandLandmarks[0][12].y * 150;
//             cursorX = 100 - cursorX;
//             cursor.style.left = cursorX + "%";
//             cursor.style.top = cursorY + "%";



//             if (window.getComputedStyle(wrapper).getPropertyValue("opacity") != "0") {
//                 modes.forEach(mode => {
//                     isCollidingButton(cursor, mode);
//                 })
//             }
//             idleTimer = setInterval(redirectToStandby, 120000);
//         }
//     }

// }

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

// function isColliding(a, b) {
//     return !(
//         ((a.y + a.height) < (b.y)) ||
//         (a.y > (b.y + b.height)) ||
//         ((a.x + a.width) < b.x) ||
//         (a.x > (b.x + b.width))
//     );
// }

// function isCollidingButton(cursor, button) {
//     if (isColliding(cursor.getBoundingClientRect(), button.getBoundingClientRect()) && !button.classList.contains('disabled')) {
//         button.classList.add('selecting');
//     } else {
//         if (button.classList.contains('selecting')) {
//             button.classList.remove('selecting');
//         }
//     }
// }

// const hands = new Hands({
//     locateFile: (file) => {
//         return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.1/${file}`;
//     }
// });

// hands.onResults(onResults);

/**
 * Instantiate a camera. We'll feed each frame we receive into the solution.
 */
// const camera = new Camera(videoElement, {
//     onFrame: async() => {
//         await hands.send({ image: videoElement });
//     },
//     width: 1280,
//     height: 720
// });

// setTimeout(() => {
//     camera.start();
// }, 750);

greeting.addEventListener('animationend', function() {
    greeting.style.display = 'none';
});

wrapper.addEventListener('animationend', function() {
    wrapper.style.opacity = '1';
})