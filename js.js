//Variables
const cursor = document.getElementById("cursor");
const previousButtons = document.querySelectorAll('button.prev');
const nextButtons = document.querySelectorAll('button.next');
const items = document.querySelectorAll('div.item');
const detailedBox = document.getElementById('detailedBox');
const smallLine = document.getElementById('smallLine');

let cursorInactiveTimer;


//Initialize page
cursor.style.display = 'none';
let isMoving = false;

let Carousel = {
    width: 200, // Images are forced into a width of this many pixels.
    numVisible: 3, // The number of images visible at once.
    duration: 750, // Animation duration in milliseconds.
    itemMargin: 40
};

let itemNames = ['Queens Ring', 'Kings Ring', 'Black Widow Ring', 'Hercules Ring', 'Brothers Alu Ring'];
let itemCodeNumber = 0;

//Runs when the window is loaded.
window.onload = function() {
    //Make the carousel as it should be, with items in it.
    var carousel = Carousel.carousel = document.getElementById('carousel'),
        items = carousel.querySelectorAll('div.item'),
        numItems = items.length,
        //itemHeight = 150,
        //padding = Carousel.padding,
        //rowHeight = Carousel.rowHeight = itemHeight + 2 * padding;
        //rowHeight = Carousel.rowHeight = 2 * itemHeight + 2 * padding;
        itemWidth = Carousel.width;
    carousel.style.width = itemWidth + 'px';

    //Goes over every item in the items array.
    for (var i = 0; i < numItems; ++i) {
        let itemData = createNewItemMockData();
        var item = items[i],
            imageHolder = document.createElement('div');

        //Give the item an 'id' and 'margin'.
        item.id = itemData.itemCode;
        item.style.marginTop = Carousel.itemMargin / 2 + "px";
        item.style.marginBottom = Carousel.itemMargin / 2 + "px";

        //Add the image holder div
        imageHolder.className = 'imgHolder';
        item.appendChild(imageHolder);

        //Add item image
        var img = document.createElement('img');
        for (let index = 0; index < 3; index++) {
            img.src = `./Images/ring${i % 3}.png`;
        }

        imageHolder.appendChild(img);

        //Add the item name "p"-tag
        let itemNameTag = document.createElement('p');
        console.log(itemData.itemName.length)
        if (itemData.itemName.length > 12) {
            itemNameTag.innerHTML = itemData.itemName.substring(0, 10) + "...";
        } else {
            itemNameTag.innerHTML = itemData.itemName;
        }
        item.appendChild(itemNameTag);
    }

    carousel.style.alignItems = 'center';


    //TODO: Might throw NullPointerException
    Carousel.rowHeight = getDistanceBetweenElements(
        document.querySelectorAll("div.item")[0],
        document.querySelectorAll("div.item")[1]
    );
    carousel.style.height = Carousel.numVisible * Carousel.rowHeight + 'px';
    carousel.style.visibility = 'visible';
    carousel.style.overflow = 'hidden';

    let wrapper = Carousel.wrapper = document.createElement('div');
    wrapper.id = 'carouselWrapper';
    wrapper.style.width = carousel.style.width;
    wrapper.style.height = carousel.offsetHeight + 'px';
    wrapper.style.marginBottom = Carousel.itemMargin / 2 + "px";
    carousel.parentNode.insertBefore(wrapper, carousel);
    wrapper.appendChild(carousel);

    let firstItem = document.querySelectorAll("div.item")[0].getBoundingClientRect();

    detailedBox.style.top = firstItem.top + 'px';

    //60 is the width of the 'smallLine'.
    detailedBox.style.left = (firstItem.right + 60) + 'px';
    //detailedBox.style.marginTop = Carousel.itemMargin / (Carousel.numVisible * 3) + 'px';
    detailedBox.style.height = (Carousel.numVisible * Carousel.rowHeight) - 24.5 + 'px';
    detailedBox.style.opacity = 0;
    detailedBox.style.transition = '1000ms';
};

function createNewItemMockData() {
    let ItemMockData = {
        itemName: itemNames[Math.floor(Math.random() * Math.floor(itemNames.length))],
        itemCode: createItemCodeString(),
        itemTags: ['Ring'],
    }
    itemCodeNumber++;
    return ItemMockData;
}

function createItemCodeString() {
    let codeString = itemCodeNumber.toString();
    for (let index = 0; codeString.length < 12; index++) {
        codeString = `0${codeString}`;
    }
    return codeString;
}
//Adds an event listener to every previous-button for when a transition ends.
previousButtons.forEach(element => {
    element.addEventListener("transitionend", function() {
        if (!isMoving) {
            isMoving = true;
            rotateForward();
            animate(-Carousel.rowHeight, 0, function() {
                carousel.style.top = '0';
                isMoving = false;
            });
        }
    });
});

//Adds an event listener to every next-button for when a transition ends.
nextButtons.forEach(element => {
    element.addEventListener("transitionend", function() {
        if (!isMoving) {
            isMoving = true;
            animate(0, -Carousel.rowHeight, function() {
                rotateBackward();
                carousel.style.top = '0';
                isMoving = false;
            });
        }
    })
});

//Adds an event listener to every item-box for when an animation ends.
items.forEach(element => {
    element.addEventListener("animationend", function() {
        var selectedItemCoords = getCoords(element);

        //TODO: hide small line, move small line, show small line
        hideSmallLine();
        moveSmallLine(selectedItemCoords);
        showSmallLine();
        showDetailedBox();

    }, false);
});

//Gets the coordinates of an element.
function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

//Moves the "small-line" to the middle right of the selected item-box.
function moveSmallLine(itemCoords) {
    smallLine.style.top = (itemCoords.top + itemCoords.bottom) / 2 + 'px';
    smallLine.style.left = itemCoords.right + 'px';
    smallLine.style.display = 'block';
    smallLine.style.transition = '1000ms';
}

//Shows small-line
function showSmallLine() {
    smallLine.style.opacity = 1;
}

//Moves the "detailed-box". TODO:make this an initialization thing.
function showDetailedBox() {
    //TODO: Currently only for left side.
    detailedBox.style.display = 'block';
    detailedBox.style.opacity = 1;
}

//Whenever the user clicks on the body of the page, it hides the detailed box and small-line.
//TODO: make this a hover thing
window.document.body.addEventListener('click', function() {
    hideDetailedBox();
    hideSmallLine();
});

//Hides the "detailed-box".
function hideDetailedBox() {
    //detailedBox.style.display = 'none';
    detailedBox.style.opacity = 0;
}

//Hides the "small-line".
function hideSmallLine() {
    //smallLine.style.display = 'none';
    smallLine.style.opacity = 0;
}

// ++=-CURSOR-=++

//Turn on/off the cursor when active/inactive
document.onmousemove = function() {
    clearTimeout(cursorInactiveTimer);
    cursorInactiveTimer = setTimeout(function() { cursor.style.display = 'none'; }, 5000);
}

//Move the cursor
document.addEventListener('mousemove', e => {
    //Set the cursor div on the position of the mouse.
    cursor.setAttribute("style", `top: ${e.pageY - 15}px; left: ${e.pageX - 15}px`);
    //Check for each item-box if the cursor is colliding.
    document.querySelectorAll('div.item').forEach(item => {
        if (isColliding(cursor.getBoundingClientRect(), item.getBoundingClientRect())) {
            console.log()
            for (let index = 0; index < Carousel.numVisible; index++) {
                if (item.parentElement.children[index] === item) {
                    item.classList.add('selectingItem');
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
});

//Checks if element "a" is colliding with element "b".
function isColliding(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

function animate(begin, end, finalTask) {
    hideSmallLine();
    hideDetailedBox();
    let carousel = Carousel.carousel,
        change = end - begin,
        duration = Carousel.duration,
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
    }, 1000 / 240);
}

function rotateForward() {
    var carousel = Carousel.carousel,
        children = carousel.children,
        firstChild = children[0],
        lastChild = children[children.length - 1];
    carousel.insertBefore(lastChild, firstChild);
}

function rotateBackward() {
    var carousel = Carousel.carousel,
        children = carousel.children,
        firstChild = children[0],
        lastChild = children[children.length - 1];
    carousel.insertBefore(firstChild, lastChild.nextSibling);
}

function getPositionAtCenter(element) {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
        x: left + width / 2,
        y: top + height / 2
    };
}

function getDistanceBetweenElements(a, b) {
    const aPosition = getPositionAtCenter(a);
    const bPosition = getPositionAtCenter(b);

    return Math.sqrt(
        Math.pow(aPosition.x - bPosition.x, 2) +
        Math.pow(aPosition.y - bPosition.y, 2)
    );
}