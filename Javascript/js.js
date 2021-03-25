//Variables
const cursorLeft = document.getElementById("cursorLeft");
const previousButtons = document.querySelectorAll('button.prev');
const nextButtons = document.querySelectorAll('button.next');
const detailedBox = document.getElementById('detailedBox');
const smallLine = document.getElementById('smallLine');

const leftDetailedBoxLoader = document.getElementsByClassName('lds-ring')[0];
const leftDetailedBoxContent = document.getElementById('leftDetailedBoxContent');
const leftDetailedBoxItemName = document.getElementById('leftDetailedBoxItemName');
const leftDetailedBoxItemPicture = document.getElementById('leftDetailedBoxItemPicture');
const leftDetailedBoxItemDescription = document.getElementById('leftDetailedBoxItemDescription');
const leftDetailedBoxItemTags = document.getElementById('leftDetailedBoxItemTags');
const leftDetailedBoxItemPrice = document.getElementById('leftDetailedBoxItemPrice');

const MAX_SCANNED_ITEMS = 50;

const spinner = document.getElementById("spinner");
const message = document.getElementById("message");
spinner.style.visibility = "hidden";
message.style.visibility = "hidden";





let cursorInactiveTimer;
//Initialize page
cursorLeft.style.display = 'none';
let isMoving = false;

let Carousel = {
    width: 200, // Images are forced into a width of this many pixels.
    numVisible: 3, // The number of images visible at once.
    duration: 750, // Animation duration in milliseconds.
    itemMargin: 100 //40 for laptop, 100 for home screen @stephan
};

let data = {};


let itemNames = ['Queens Ring', 'Kings Ring', 'Black Widow Ring', 'Hercules Ring', 'Brothers Alu Ring', 'The Ocean Crest', 'The Purity Wings Pin', 'The Purity Lily Ring', 'The Heaven Voice'];
let itemCodeNumber = 0;

function createItemData() {
    for (let i = 0; i < MAX_SCANNED_ITEMS; i++) {
        let barcode = createItemCodeString();
        data[`${barcode}`] = {};
        data[`${barcode}`]["name"] = `${itemNames[Math.floor(Math.random() * Math.floor(itemNames.length))]}`;
        //TODO: make the image selection dynamic, as in get length of the Images folder.
        data[`${barcode}`]["img"] = `./Images/Rings/ring${Math.floor(Math.random() * 6)}.png`;
        data[`${barcode}`]["description"] = `${i} - ${getLoremIpsum()}`;
        data[`${barcode}`]["tags"] = ["Ring", "Steel", "Small"];
        data[`${barcode}`]["price"] = `€${Math.floor(Math.random() * 100) + 20},${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
    }
};

function getLoremIpsum() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales egestas odio a venenatis. Duis lobortis imperdiet dolor. Suspendisse et porta metus. Phasellus facilisis felis id nisl auctor, nec laoreet enim tempor. Cras dictum dui eget mollis accumsan. Nunc diam mauris, interdum nonsapien nec, mattis pellentesque purus. Donec molestie posuere eleifend.";
}

function createItemCodeString() {
    let codeString = itemCodeNumber.toString();
    for (let index = 0; codeString.length < 12; index++) {
        codeString = `0${codeString}`;
    }
    itemCodeNumber++;
    return codeString;
}


//Runs when the window is loaded.
window.onload = function () {
    let carousel = Carousel.carousel = document.getElementById('carousel'),
        itemWidth = Carousel.width;
    createItemData();
    for (let barcode in data) {
        //TODO: Betere error message, wanneer een barcode niet gevonden wordt.
        if (!data.hasOwnProperty(barcode)) { return console.log("Houston, we have a problem!") }
        console.log(barcode + " -> " + data[barcode].img);

        //Create the item and give it an 'id' and 'margin'.
        let item = document.createElement('div');
        item.id = barcode;
        item.className = 'item';
        item.style.marginTop = Carousel.itemMargin / 2 + "px";
        item.style.marginBottom = Carousel.itemMargin / 2 + "px";
        //Add the item to the carousel.
        carousel.appendChild(item);

        //Create the image holder for the item box.
        let imageHolder = document.createElement('div');
        imageHolder.className = 'imgHolder';
        //Add the image holder div to the item.
        item.appendChild(imageHolder);

        //Create item image.
        var img = document.createElement('img');
        img.src = data[barcode].img;
        //Add the image to the image holder in the item div.
        imageHolder.appendChild(img);

        //Create the item name "p"-tag.
        let itemNameTag = document.createElement('p');
        if (data[barcode].name.length > 12) {
            itemNameTag.innerHTML = data[barcode].name.substring(0, 9) + "...";
        } else {
            itemNameTag.innerHTML = data[barcode].name;
        }
        //Add the name-tag to the item div.
        item.appendChild(itemNameTag);


        //Adds an event listener to every item-box for when an animation ends.
        item.addEventListener("animationend", function () {
            var selectedItemCoords = getCoords(item);

            //TODO: Put stuff in the detailed box here
            //console.log(data[item.id].name);
            document.querySelectorAll("div.selected").forEach(element => {
                element.classList.toggle('selected');
            });
            item.classList.toggle('selected');
            //TODO: hide small line, move small line, show small line
            moveSmallLine(selectedItemCoords);
            leftDetailedBoxContent.style.display = 'none';
            showDetailedBox();
            leftDetailedBoxLoader.classList.add('animate');
            leftDetailedBoxLoader.addEventListener("animationend", function () {
                setItemInDetailedBox(item.id);
                leftDetailedBoxContent.style.display = 'block';
                leftDetailedBoxLoader.classList.remove('animate');
            }, false);
        }, false);

    }
    carousel.style.width = itemWidth + 'px';

    //TODO: Might throw NullPointerException when there are no items
    Carousel.rowHeight = getDistanceBetweenElements(
        document.querySelectorAll("div.item")[0],
        document.querySelectorAll("div.item")[1]
    );
    carousel.style.height = Carousel.numVisible * Carousel.rowHeight + 'px';
    carousel.style.visibility = 'visible';

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
    detailedBox.style.transition = '500ms';
    //557.5px   40px margin
    //647.5px   100px margin

    //Skip the transition bug when the screen loads
    smallLine.style.display = 'block';
};

//Adds an event listener to every previous-button for when a transition ends.
previousButtons.forEach(element => {
    element.addEventListener("transitionend", function () {
        if (!isMoving) {
            isMoving = true;
            rotateForward();
            animate(-Carousel.rowHeight, 0, function () {
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
            animate(0, -Carousel.rowHeight, function () {
                rotateBackward();
                carousel.style.top = '0';
                isMoving = false;
            });
        }
    })
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
    hideSmallLine();
    smallLine.style.top = (itemCoords.top + itemCoords.bottom) / 2 + 'px';
    smallLine.style.left = itemCoords.right + 'px';
    showSmallLine();
}

//Shows small-line
function showSmallLine() {
    smallLine.style.visibility = 'visible';
    smallLine.style.opacity = 1;
}

function showDetailedBox() {
    //TODO: Currently only for left side.
    detailedBox.style.visibility = 'visible';
    detailedBox.style.opacity = 1;
}

//Whenever the user clicks on the body of the page, it hides the detailed box and small-line.
//TODO: make this a hover thing
window.document.body.addEventListener('click', function () {
    hideDetailedBox();
    hideSmallLine();
    document.querySelectorAll("div.selected").forEach(element => {
        element.classList.toggle('selected');
    });
});

//Hides the "detailed-box".
function hideDetailedBox() {
    detailedBox.style.opacity = 0;
}

//Hides the "small-line".
function hideSmallLine() {
    smallLine.style.opacity = 0;
    //smallLine.style.visibility = 'hidden';
}

// ++=-CURSOR-=++

//Turn on/off the cursor when active/inactive
// document.onmousemove = function () {
//     clearTimeout(cursorInactiveTimer);
//     cursorInactiveTimer = setTimeout(function () { cursor.style.display = 'none'; }, 8000);
// }

//Move the cursor
// document.addEventListener('mousemove', e => {
//     //Set the cursor div on the position of the mouse.
//     cursor.setAttribute("style", `top: ${e.pageY - 15}px; left: ${e.pageX - 15}px`);
//     //Check for each item-box if the cursor is colliding.
//     document.querySelectorAll('div.item').forEach(item => {
//         if (isColliding(cursor.getBoundingClientRect(), item.getBoundingClientRect())) {
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
//         if (isColliding(cursor.getBoundingClientRect(), button.getBoundingClientRect())) {
//             button.classList.add('arrow-down');
//         } else {
//             if (button.classList.contains('arrow-down')) {
//                 button.classList.remove('arrow-down');
//             }
//         }
//     });
//     //Check for each previous-button if the cursor is colliding.
//     previousButtons.forEach(button => {
//         if (isColliding(cursor.getBoundingClientRect(), button.getBoundingClientRect())) {
//             button.classList.add('arrow-up');
//         } else {
//             if (button.classList.contains('arrow-up')) {
//                 button.classList.remove('arrow-up');
//             }
//         }
//     });
// });

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
    document.querySelectorAll("div.selected").forEach(element => {
        element.classList.toggle('selected');
    });
    let carousel = Carousel.carousel,
        change = end - begin,
        duration = Carousel.duration,
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

function setItemInDetailedBox(barcode) {
    leftDetailedBoxItemName.innerHTML = data[barcode].name;
    leftDetailedBoxItemPicture.src = data[barcode].img;
    leftDetailedBoxItemDescription.innerHTML = data[barcode].description;
    leftDetailedBoxItemTags.innerHTML = data[barcode].tags.join(', ');
    leftDetailedBoxItemPrice.innerHTML = data[barcode].price;
}

function toggleLoader() {
    leftDetailedBoxLoader.classList.toggle('animate');
}





