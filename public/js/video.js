const videoElement = document.getElementById("input_video");
const cursorRightElement = document.getElementById("cursorRight");
const spinner = document.getElementById("spinner");
const buttons = document.querySelectorAll('.arrow');
const cursor = document.getElementById("cursorLeft");
const helpButton = document.getElementById('help');
const homeButtonElement = document.getElementById('home');


let sections = document.querySelectorAll('div.tutorialWrapper section');
let tutorialWrapper = document.querySelector('div.tutorialWrapper');
let tutorialButton = document.querySelector('#tutorialButton');
let tutorialCursor = document.querySelector('div.tutorialItemBox div.tutorialCursor');
let tutorialItemBox = document.querySelector('div.tutorialItemBox');

let cursorY, cursorX;

document.addEventListener('mousemove', e => {
    clearInterval(idleTimer);

    cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px; display: block;`);

    idleTimer = setInterval(redirectToStandby, 120000);
});

window.addEventListener("DOMContentLoaded", function() {
    sections.forEach(section => {
        section.addEventListener('animationend', function() {
            section.style.opacity = 1;
        })
    });
    if (isFirstTime.includes('true')) {
        setDelayOnEachElement(sections)
        tutorialButton.style.opacity = 1;
        helpButton.classList.add('selected')
        tutorialWrapper.style.display = 'flex';

        isFirstTime = 'false'
        sessionStorage.setItem('isFirstTime', isFirstTime)
    } else {
        tutorialWrapper.style.display = 'none';
    }
})

function setDelayOnEachElement(sections) {
    for (let index = 0; index < sections.length; index++) {
        const section = sections[index];
        section.style.animationDelay = `${index * 1.2}s`;
        if (index == 2) setTimeout(function() { document.querySelector('div.tutorialItemBox div.tutorialCursor').classList.add('move') }, index * 1.2 * 1000);
        section.classList.add('fadeIn');
    }
}

let animationCheck = setInterval(function() {
    if (isHidden(document.querySelector('div.tutorialWrapper'))) return clearInterval(animationCheck);
    if (!isColliding(tutorialCursor.getBoundingClientRect(), tutorialItemBox.getBoundingClientRect())) return tutorialItemBox.classList.remove('selecting');
    tutorialItemBox.classList.add('selecting');
}, 750);


tutorialButton.addEventListener('transitionend', function() {
    tutorialWrapper.style.display = 'none';
    helpButton.classList.remove('selected')
    sections.forEach(section => {
        section.style.opacity = 0
    })
});
helpButton.addEventListener('transitionend', function() {
    hideSmallLineAndDetailedBox();
    deselectAllSelectedItems();
    tutorialWrapper.style.display = 'flex';
    sections.forEach(section => {
        section.style.opacity = 1
    });
    tutorialButton.style.opacity = 1;
});
homeButtonElement.addEventListener('transitionend', function() {
    window.location.href = "/";
});

//TODO: IMPORTANT BUG, FIX
//             if (window.getComputedStyle(detailedBox).getPropertyValue("opacity") != "0") {
//                 iconHolders.forEach(iconHolder => {
//                     isCollidingButton(cursor, iconHolder);
//                 })
//             }
//             buttons.forEach(button => {
//                 isCollidingButton(cursor, button);
//             });
//             isCollidingButton(cursor, tutorialButton);
//             isCollidingButton(cursor, helpButton);
//             isCollidingButton(cursor, homeButtonElement);
//             idleTimer = setInterval(redirectToStandby, 120000);

//         }
//     }
// }

function isColliding(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

function isHidden(el) {
    return (el.offsetParent === null)
}