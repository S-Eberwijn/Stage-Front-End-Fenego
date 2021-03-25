let items = document.querySelectorAll('div.item');
let carousels = document.querySelectorAll('.carousel');
let previousButtons = document.querySelectorAll('svg.prev');
let nextButtons = document.querySelectorAll('svg.next');
let verticalSliders = document.querySelectorAll('.verticalSlider');
let cursorLeft = document.getElementById('cursorLeft');


let isMoving = false;

window.onload = function () {
    carousels.forEach(carousel => {
        carousel.style.width = `${verticalSliders[0].getBoundingClientRect().width}px`;

        var wrapper = document.createElement('div');
        wrapper.classList.add('carouselWrapper');
        wrapper.style.width = `${carousel.getBoundingClientRect().width}px`;
        wrapper.style.height = `${carousel.getBoundingClientRect().height}px`;
        carousel.parentNode.insertBefore(wrapper, carousel);
        wrapper.appendChild(carousel);


        for (let barcode in data) {
            //TODO: Betere error message, wanneer een barcode niet gevonden wordt.
            if (!data.hasOwnProperty(barcode)) { console.log("Houston, we have a problem!") }
            console.log(barcode + " -> " + data[barcode].name);
            //TODO: Load items, fill item divs, create extra item divs
        }
    });

    items.forEach(item => {
        //Border width of an item div, only lower than 9px.
        var borderW = getComputedStyle(item, null).getPropertyValue('border-left-width').substr(0, 1);
        //Margin correction so the overlapping margin from the boxes in the middle is taken care of.
        var marginCorrection = 0
        for (let index = 1; index < MAX_VISIBLE_ITEMS; index++) {
            marginCorrection += 0.5;
            //WHEN MAX VISIBLE ITEMS IS 1, SHOULD BE (ITEMS_MARGIN * 0)
            //WHEN MAX VISIBLE ITEMS IS 2, SHOULD BE (ITEMS_MARGIN * 0.5)
            //WHEN MAX VISIBLE ITEMS IS 3, SHOULD BE (ITEMS_MARGIN * 1)
            //WHEN MAX VISIBLE ITEMS IS 4, SHOULD BE (ITEMS_MARGIN * 1.5)
        }
        //Calculate the item div height, based on the height of the carousel, MAX_VISIBLE_ITEMS and ITEMS_MARGIN.
        item.style.height = `${((document.getElementsByClassName('carousel')[0].getBoundingClientRect().height - (ITEMS_MARGIN * marginCorrection)) / MAX_VISIBLE_ITEMS) - (2 * borderW) - (ITEMS_MARGIN / MAX_VISIBLE_ITEMS) + .5}px`;
        //Add the margin to the top and bottom of the item div.
        item.style.marginTop = `${ITEMS_MARGIN / 2}px`;
        item.style.marginBottom = `${ITEMS_MARGIN / 2}px`;
    });

}
//Adds an event listener to every previous-button for when a transition ends.
previousButtons.forEach(element => {
    element.addEventListener("transitionend", function () {
        if (!isMoving) {
            isMoving = true;
            var carousel = getCorrectCarousel(element);
            var rowHeight = getDistanceBetweenElements(carousel.querySelectorAll('div.item')[0], carousel.querySelectorAll('div.item')[1]);
            animate(carousel, -rowHeight, 0, function () {
                rotateForward(carousel);
                carousel.style.top = '0';
                isMoving = false;
            });
        }
    });
});

//Adds an event listener to every next-button for when a transition ends.
nextButtons.forEach(element => {
    element.addEventListener("transitionend", function () {
        if (!isMoving) {
            isMoving = true;
            var carousel = getCorrectCarousel(element);
            var rowHeight = getDistanceBetweenElements(carousel.querySelectorAll('div.item')[0], carousel.querySelectorAll('div.item')[1]);
            //TODO: While element is color red, set interval for scrolling through items.
            animate(carousel, 0, -rowHeight, function () {
                carousel.style.top = '0';
                rotateBackward(carousel);
                isMoving = false;
            });
        }
    })
});

function getCorrectCarousel(element) {
    if (element.parentElement.querySelector('.left')) {
        return element.parentElement.querySelector('.left');
    } else if (element.parentElement.querySelector('.right')) {
        return element.parentElement.querySelector('.right');
    }
}

function animate(carousel, begin, end, finalTask) {
    var change = end - begin,
        duration = CAROUSEL_ANIMATION_TIME,
        startTime = Date.now();
    carousel.style.top = begin + 'px';
    var animateInterval = window.setInterval(function () {
        var t = Date.now() - startTime;
        if (t >= duration) {
            window.clearInterval(animateInterval);
            finalTask();
            return;
        }
        t /= (duration / 2);
        var top = begin + (t < 1 ? change / 2 * Math.pow(t, 3) :
            change / 2 * (Math.pow(t - 2, 3) + 2));
        carousel.style.top = top + 'px';
    }, 1000 / 360);
}

function getDistanceBetweenElements(a, b) {
    const aPosition = getPositionAtCenter(a);
    const bPosition = getPositionAtCenter(b);

    return Math.sqrt(
        Math.pow(aPosition.x - bPosition.x, 2) +
        Math.pow(aPosition.y - bPosition.y, 2)
    );
}

function getPositionAtCenter(element) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
        x: left + width / 2,
        y: top + height / 2
    };
}

function rotateBackward(carousel) {
    var children = carousel.children,
        firstChild = children[0],
        lastChild = children[children.length - 1];
    carousel.insertBefore(firstChild, lastChild.nextSibling);
}

function rotateForward(carousel) {
    var children = carousel.children,
        firstChild = children[0],
        lastChild = children[children.length - 1];
    carousel.insertBefore(lastChild, firstChild);
}

