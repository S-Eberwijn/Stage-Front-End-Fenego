const videoElement = document.getElementById("input_video");
const cursorRightElement = document.getElementById("cursorRight");
const spinner = document.getElementById("spinner");
const buttons = document.querySelectorAll('.arrow');
const cursor = document.getElementById("cursorLeft");

let sections = document.querySelectorAll('div.tutorialWrapper section');
let tutorialWrapper = document.querySelector('div.tutorialWrapper');
let tutorialButton = document.querySelector('#tutorialButton');
let tutorialCursor = document.querySelector('div.tutorialItemBox div.tutorialCursor');
let tutorialItemBox = document.querySelector('div.tutorialItemBox');

let cursorY, cursorX;


function setDelayOnEachElement(sections) {
    for (let index = 0; index < sections.length; index++) {
        const section = sections[index];
        section.style.animationDelay = `${index * 1.2}s`;
        if (index == 2) setTimeout(function() { document.querySelector('div.tutorialItemBox div.tutorialCursor').classList.add('move') }, index * 1.2 * 1000);
        section.classList.add('fadeIn');
    }
}

function isHidden(el) {
    return (el.offsetParent === null)
}

let animationCheck = setInterval(function() {
    if (isHidden(document.querySelector('div.tutorialWrapper'))) return clearInterval(animationCheck);
    if (!isColliding(tutorialCursor.getBoundingClientRect(), tutorialItemBox.getBoundingClientRect())) return tutorialItemBox.classList.remove('selecting');
    tutorialItemBox.classList.add('selecting');
}, 750);

sections.forEach(section => {
    section.addEventListener('animationend', function() {
        section.style.opacity = 1;
    })
});

tutorialButton.addEventListener('transitionend', function() {
    tutorialWrapper.style.display = 'none';
})

function onResults(results) {
    if (isFirstTime) {
        spinnerElement.parentNode.removeChild(spinnerElement);
        setDelayOnEachElement(sections)
        tutorialButton.style.opacity = 1;

        mainElement.classList.add('fadeIn');
        mainElement.style.opacity = 1;
        isFirstTime = sessionStorage.setItem('isFirstTime', false);
    } else if (scannedItems) {
        tutorialWrapper.style.display = 'none';
    }
    //TODO: FIX THIS


    if (results.multiHandLandmarks !== undefined) {
        if (results.multiHandLandmarks[0] !== undefined) {
            cursor.style.display = "block";
            cursorX = results.multiHandLandmarks[0][12].x * 150;
            cursorY = results.multiHandLandmarks[0][12].y * 150;
            cursorX = 100 - cursorX;
            cursor.style.left = cursorX + "%";
            cursor.style.top = cursorY + "%";

            items.forEach(item => {
                if (isColliding(cursor.getBoundingClientRect(), item.getBoundingClientRect())) {
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
            if (window.getComputedStyle(detailedBox).getPropertyValue("opacity") != "0") {
                iconHolders.forEach(iconHolder => {
                    isCollidingButton(cursor, iconHolder);
                })
            }
            buttons.forEach(button => {
                isCollidingButton(cursor, button);
            });
            isCollidingButton(cursor, tutorialButton);
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
    onFrame: async() => {
        await hands.send({ image: videoElement });
    },
    width: 1280,
    height: 720
});

setTimeout(() => {
    camera.start();
}, 750);

function isHidden(el) {
    return (el.offsetParent === null)
}