//TODO: Change "onmousemove" to when a hand is detected. (video.js)
document.addEventListener('mousemove', e => {
    //Set the cursor div on the position of the mouse.
    cursorLeft.setAttribute("style", `top: ${e.pageY}px; left: ${e.pageX}px; display: block;`);
    //Check for each item-box if the cursor is colliding.
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
});

function isColliding(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}