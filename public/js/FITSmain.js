let mainElement = document.getElementById("main");
let greeting = document.getElementById("greeting");
let spinnerElement = document.getElementById("spinner");

// //If we have scanned items, skip the greeting
// if (scannedItems) {
//     greeting.parentNode.removeChild(greeting);
//     spinnerElement.style.opacity = "1";
//     spinnerElement.classList.add('animate2');
//     greeterAnimationTime = 0;
// } else {
//     greeting.classList.add('fadeOut')
//     greeting.onanimationend = (e) => {
//         greeting.parentNode.removeChild(greeting);
//         spinnerElement.style.opacity = "1";
//         spinnerElement.classList.add('animate2');
//     };
// }


spinnerElement.onanimationend = (e) => {
    spinnerElement.parentNode.removeChild(spinnerElement);
    mainElement.classList.add('fadeIn');
    mainElement.style.opacity = "1";
};

mainElement.onanimationend = (e) => {
    mainElement.style.opacity = "1";
};

// CLOCK
function currentTime() {
    var date = new Date(); /* creating object of Date class */
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    hour = updateTime(hour);
    min = updateTime(min);
    sec = updateTime(sec);
    document.getElementById("clock").innerText = `${hour}:${min}`; /* adding time to the div */
    var t = setTimeout(function () { currentTime() }, 1000); /* setting timer */
}

function updateTime(k) {
    if (k < 10) {
        return "0" + k;
    } else {
        return k;
    }
}

currentTime(); /* calling currentTime() function to initiate the process */

//CAROUSELS

let items = document.querySelectorAll('div.item');
let carousels = document.querySelectorAll('.carousel');
let previousButtons = document.querySelectorAll('i.prev');
let nextButtons = document.querySelectorAll('i.next');
let verticalSliders = document.querySelectorAll('.verticalSlider');
let smallLine = document.getElementById('smallLine');
let detailedBox = document.getElementById('detailedBox');
let detailedBoxContent = document.getElementById('detailedBoxContent');
let detailedBoxContentLoader = document.getElementById('detailedBoxContentLoader');
let scanItemElement = document.getElementById('scan');
let iconHolders = document.querySelectorAll('.iconHolder');

let itemName = document.getElementById('itemName');
let itemImage = document.getElementById('itemImage');
let itemDescription = document.getElementById('itemDescription');
let itemTags = document.getElementById('itemTags');
let itemPrice = document.getElementById('itemPrice');

window.onload = function () {
    carousels.forEach(carousel => {
        carousel.style.width = `${verticalSliders[0].getBoundingClientRect().width}px`;


        var wrapper = document.createElement('div');
        wrapper.classList.add('carouselWrapper');
        wrapper.style.width = `${carousel.getBoundingClientRect().width}px`;
        wrapper.style.height = `${carousel.getBoundingClientRect().height}px`;
        carousel.parentNode.insertBefore(wrapper, carousel);
        wrapper.appendChild(carousel);

        if (carousel.classList.contains('left')) {
            //Create a holder div for the icon.
            var imageHolder = document.createElement('div');
            imageHolder.classList = "imageHolder";

            //Create a new plus icon element.
            var plusIconElement = document.createElement('i');
            plusIconElement.classList = 'fas fa-plus fa-5x plus';

            //Create a new p-tag element.
            var scanTextElement = document.createElement('p');
            scanTextElement.innerHTML = 'Scan Item';

            //Add the elements to the item divs.
            scanItemElement.appendChild(imageHolder);
            imageHolder.appendChild(plusIconElement);
            scanItemElement.appendChild(scanTextElement);

            if (scannedItems) {
                scannedItems.forEach(item => {
                    console.log(item);
                    scanItemElement.parentElement.insertBefore(insertItemInCarousel(item), scanItemElement)
                });
            }
        } else if (carousel.classList.contains('right')) {
            carousel.querySelectorAll('div.item').forEach(item => {
                item.parentElement.removeChild(item);
            });
            if (suggestedItems) {
                suggestedItems.forEach(item => {
                    carousel.appendChild(insertItemInCarousel(item));
                });
            }
        }
    });
    disableArrowButtons();
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


        item.addEventListener("animationend", function () {
            document.querySelectorAll('.item.selected').forEach(item => { item.classList.toggle('selected') });
            item.classList.toggle('selected');
            if (item.querySelector('p').innerHTML === 'Scan Item') {
                window.location.href = "/barcode";
            } else if (item.id.length >= 6) {
                detailedBoxContent.style.opacity = 0;
                loadItemIntoDetailedBox(scannedItems.find(obj => { return obj.key === item.id }) || suggestedItems.find(obj => { return obj.key === item.id }));
                detailedBoxContentLoader.classList.add('animate1');
                moveSmallLine(item);
                moveDetailedBox(item);
            }
        });
    });
};

detailedBoxContentLoader.addEventListener('animationend', function () {
    detailedBoxContent.style.opacity = 1;
    detailedBoxContentLoader.classList.remove('animate1');
});

//Adds an event listener to every previous-button for when a transition ends.
previousButtons.forEach(element => {
    element.addEventListener("transitionend", function () {
        hideSmallLineAndDetailedBox();
        deselectAllSelectedItems();
        if (!carouselIsMoving) {
            carouselIsMoving = true;
            var carousel = getCorrectCarousel(element);
            var rowHeight = getDistanceBetweenElements(carousel.querySelectorAll('div.item')[0], carousel.querySelectorAll('div.item')[1]);
            rotateForward(carousel);
            animate(carousel, -rowHeight, 0, function () {
                carousel.style.top = '0';
                carouselIsMoving = false;
            });
            var rotateCarousel = setInterval(function () {
                if ((rgb2hex(window.getComputedStyle(element, null).getPropertyValue('color')) === '#e32636')) {
                    rotateForward(carousel);
                    animate(carousel, -rowHeight, 0, function () {
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
    element.addEventListener("transitionend", function () {
        hideSmallLineAndDetailedBox();
        deselectAllSelectedItems();
        if (!carouselIsMoving) {
            carouselIsMoving = true;
            var carousel = getCorrectCarousel(element);
            var rowHeight = getDistanceBetweenElements(carousel.querySelectorAll('div.item')[0], carousel.querySelectorAll('div.item')[1]);
            //TODO: While element is color red, set interval for scrolling through items.
            animate(carousel, 0, -rowHeight, function () {
                carousel.style.top = '0';
                rotateBackward(carousel);
                carouselIsMoving = false;
            });
            var rotateCarousel = setInterval(function () {
                if ((rgb2hex(window.getComputedStyle(element, null).getPropertyValue('color')) === '#e32636')) {
                    animate(carousel, 0, -rowHeight, function () {
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

iconHolders.forEach(iconHolder => {
    iconHolder.addEventListener('transitionend', function () {
        let oldIcon = iconHolder.querySelector('i');
        let newIcon = document.createElement('i');
        if (iconHolder.classList.contains('star')) {
            if (oldIcon.classList.contains('far')) {
                oldIcon.remove();
                newIcon.className = 'fas fa-star fa-3x yellow';
                iconHolder.appendChild(newIcon);
            } else {
                oldIcon.remove();
                newIcon.className = 'far fa-star fa-3x';
                iconHolder.appendChild(newIcon);
            }
        } else if (iconHolder.classList.contains('eye')) {
            if (oldIcon.classList.contains('fa-eye-slash')) {
                oldIcon.remove();
                newIcon.className = 'far fa-eye fa-3x';
                iconHolder.appendChild(newIcon);
            } else {
                oldIcon.remove();
                newIcon.className = 'far fa-eye-slash fa-3x';
                iconHolder.appendChild(newIcon);
            }
        } else if (iconHolder.classList.contains('trash')) {
            if (oldIcon.classList.contains('far')) {

            }
        }
        newIcon.classList.add('iconAni');
        console.log('testing');
    })
})

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

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

function disableArrowButtons() {
    carousels.forEach(carousel => {
        if (carousel.querySelectorAll('div.item').length <= MAX_VISIBLE_ITEMS) {
            carousel.parentElement.parentElement.querySelectorAll('i.arrow').forEach(button => {
                button.classList.add('disabled');
            });
        }
    });
}

function moveSmallLine(item) {
    hideSmallLine();
    smallLine.style.top = `${getPositionAtCenter(item).y}px`;
    if (item.parentElement.classList.contains('left')) {
        smallLine.style.left = `${item.getBoundingClientRect().right}px`;
        iconHolders.forEach(iconHolder => {
            iconHolder.classList.remove('left');
            iconHolder.classList.add('right');
        })
    } else if (item.parentElement.classList.contains('right')) {
        smallLine.style.left = `${item.getBoundingClientRect().left - smallLine.getBoundingClientRect().width}px`;
        iconHolders.forEach(iconHolder => {
            iconHolder.classList.remove('right');
            iconHolder.classList.add('left');
        })
    }
    showSmallLine();
}

function hideSmallLine() {
    smallLine.style.opacity = 0;
}

function showSmallLine() {
    smallLine.style.visibility = 'visible';
    smallLine.style.opacity = 1;
}

function moveDetailedBox(item) {
    hideDetailedBox();
    detailedBox.style.height = `${item.parentElement.getBoundingClientRect().height}px`;
    detailedBox.style.top = `${item.parentElement.getBoundingClientRect().top}px`;
    if (item.parentElement.classList.contains('left')) {
        detailedBox.style.left = `${item.getBoundingClientRect().right + smallLine.getBoundingClientRect().width}px`;
    } else if (item.parentElement.classList.contains('right')) {
        detailedBox.style.left = `${item.getBoundingClientRect().left - smallLine.getBoundingClientRect().width - detailedBox.getBoundingClientRect().width}px`;
    }
    showDetailedBox();
}

function hideDetailedBox() {
    detailedBox.style.opacity = 0;
}

function showDetailedBox() {
    detailedBox.style.visibility = 'visible';
    detailedBox.style.opacity = 1;
}

function loadItemIntoDetailedBox(item) {
    if (!item) return console.log('Did not find an item with that barcode!');
    itemName.innerHTML = item.name;
    itemImage.src = item.img;
    itemDescription.innerHTML = item.description;
    itemTags.innerHTML = item.categories.join(', ');
    itemPrice.innerHTML = item.price;
}

function hideSmallLineAndDetailedBox() {
    hideSmallLine();
    hideDetailedBox();
}

function deselectAllSelectedItems() {
    document.querySelectorAll('.item.selected').forEach(item => { item.classList.toggle('selected') });
}

function insertItemInCarousel(item) {
    var itemElement = document.createElement('div');
    itemElement.className = 'item';
    itemElement.id = item.key; //TODO: add key to item
    var imageHolderElement = document.createElement('div');
    imageHolderElement.className = 'imageHolder';
    //Add the image holder div to the item.
    itemElement.appendChild(imageHolderElement);

    var imgElement = document.createElement('img');
    imgElement.src = item.img;
    //Add the image to the image holder in the item div.
    imageHolderElement.appendChild(imgElement);

    //Create the item name "p"-tag.
    var itemNameTag = document.createElement('p');
    if (item['name'].length > 12) {
        itemNameTag.innerHTML = item['name'].substring(0, 9) + "...";
    } else {
        itemNameTag.innerHTML = item['name'];
    }
    //Add the name-tag to the item div.
    itemElement.appendChild(itemNameTag);

    return itemElement;
}

