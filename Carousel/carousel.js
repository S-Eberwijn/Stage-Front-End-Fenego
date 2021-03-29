let items = document.querySelectorAll('div.item');
let carousels = document.querySelectorAll('.carousel');
let previousButtons = document.querySelectorAll('i.prev');
let nextButtons = document.querySelectorAll('i.next');
let verticalSliders = document.querySelectorAll('.verticalSlider');
let cursorLeft = document.getElementById('cursorLeft');



window.onload = function() {
        carousels.forEach(carousel => {
            carousel.style.width = `${verticalSliders[0].getBoundingClientRect().width}px`;


            var wrapper = document.createElement('div');
            wrapper.classList.add('carouselWrapper');
            wrapper.style.width = `${carousel.getBoundingClientRect().width}px`;
            wrapper.style.height = `${carousel.getBoundingClientRect().height}px`;
            carousel.parentNode.insertBefore(wrapper, carousel);
            wrapper.appendChild(carousel);

            if (carousel.classList.contains('left')) {
                carousel.querySelectorAll('div.item').forEach(item => {
                    //Create a holder div for the icon.
                    var imageHolder = document.createElement('div');
                    imageHolder.classList = "imageHolder";

                    //Create a new plus icon element.
                    var plusIconElement = document.createElement('i');
                    plusIconElement.classList = 'fas fa-plus fa-5x';

                    //Create a new p-tag element.
                    var scanTextElement = document.createElement('p');
                    scanTextElement.innerHTML = 'Scan Item';

                    //Add the elements to the item divs.
                    item.appendChild(imageHolder);
                    imageHolder.appendChild(plusIconElement);
                    item.appendChild(scanTextElement);
                });
            } else if (carousel.classList.contains('right')) {
                carousel.querySelectorAll('div.item').forEach(item => {
                    item.parentElement.removeChild(item);
                })
                for (let barcode in data) {
                    //TODO: Better error message, when a barcode could not be found.
                    if (!data.hasOwnProperty(barcode)) { console.log("Houston, we have a problem!") }
                    console.log(barcode + " -> " + data[barcode].name);
                    // //TODO: Load items, fill item divs, create extra item divs
                    var itemElement = document.createElement('div');
                    itemElement.className = 'item';
                    itemElement.id = barcode;
                    carousel.appendChild(itemElement);

                    var imageHolderElement = document.createElement('div');
                    imageHolderElement.className = 'imageHolder';
                    //Add the image holder div to the item.
                    itemElement.appendChild(imageHolderElement);

                    var imgElement = document.createElement('img');
                    imgElement.src = data[barcode].img;
                    //Add the image to the image holder in the item div.
                    imageHolderElement.appendChild(imgElement);

                    //Create the item name "p"-tag.
                    var itemNameTag = document.createElement('p');
                    if (data[barcode].name.length > 12) {
                        itemNameTag.innerHTML = data[barcode].name.substring(0, 9) + "...";
                    } else {
                        itemNameTag.innerHTML = data[barcode].name;
                    }
                    //Add the name-tag to the item div.
                    itemElement.appendChild(itemNameTag);
                }
            }
            disableArrowButtons(carousel);
        });
        items = document.querySelectorAll('div.item');
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


            item.addEventListener("animationend", function() {
                moveSmallLine(item);
            });
        });

    }
    //Adds an event listener to every previous-button for when a transition ends.
previousButtons.forEach(element => {
    element.addEventListener("transitionend", function() {
        if (!carouselIsMoving) {
            carouselIsMoving = true;
            var carousel = getCorrectCarousel(element);
            var rowHeight = getDistanceBetweenElements(carousel.querySelectorAll('div.item')[0], carousel.querySelectorAll('div.item')[1]);
            rotateForward(carousel);
            animate(carousel, -rowHeight, 0, function() {
                carousel.style.top = '0';
                carouselIsMoving = false;
            });
            var rotateCarousel = setInterval(function() {
                if ((rgb2hex(window.getComputedStyle(element, null).getPropertyValue('color')) === '#e32636')) {
                    rotateForward(carousel);
                    animate(carousel, -rowHeight, 0, function() {
                        carousel.style.top = '0';
                        carouselIsMoving = false;
                    });
                } else {
                    clearInterval(rotateCarousel);
                }
            }, CAROUSEL_ANIMATION_TIME * 1.2);
        }
    });
});

//Adds an event listener to every next-button for when a transition ends.
nextButtons.forEach(element => {
    element.addEventListener("transitionend", function() {
        if (!carouselIsMoving) {
            carouselIsMoving = true;
            var carousel = getCorrectCarousel(element);
            var rowHeight = getDistanceBetweenElements(carousel.querySelectorAll('div.item')[0], carousel.querySelectorAll('div.item')[1]);
            //TODO: While element is color red, set interval for scrolling through items.
            animate(carousel, 0, -rowHeight, function() {
                carousel.style.top = '0';
                rotateBackward(carousel);
                carouselIsMoving = false;
            });
            var rotateCarousel = setInterval(function() {
                if ((rgb2hex(window.getComputedStyle(element, null).getPropertyValue('color')) === '#e32636')) {
                    animate(carousel, 0, -rowHeight, function() {
                        carousel.style.top = '0';
                        rotateBackward(carousel);
                        carouselIsMoving = false;
                    });
                } else {
                    clearInterval(rotateCarousel);
                }
            }, CAROUSEL_ANIMATION_TIME * 1.2);


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
    var animateInterval = window.setInterval(function() {
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

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function disableArrowButtons(carousel) {
    if (carousel.querySelectorAll('div.item').length < MAX_VISIBLE_ITEMS) {
        carousel.parentElement.parentElement.querySelectorAll('i.arrow').forEach(button => {
            button.classList.add('disabled');
        });
    }
}


function moveSmallLine(item) {
    var smallLine = undefined;
    if (item.parentElement.classList.contains('left')) {
        smallLine = item.parentElement.parentElement.parentElement.querySelector('.smallLine');
        console.log(`${getPositionAtCenter(item).y}px`)
        smallLine.style.top = `${getPositionAtCenter(item).y/(1 + 1/MAX_VISIBLE_ITEMS)}px`;
        smallLine.style.left = `${item.getBoundingClientRect().right}px`;

        console.log(item)

        //alert('left');

    } else if (item.parentElement.classList.contains('right')) {
        smallLine = item.parentElement.parentElement.parentElement.querySelector('.smallLine');
        console.log(smallLine)
            //alert('right');
    }

}