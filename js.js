//Variables
const cursor = document.getElementById("cursor");

const detailedBox = document.getElementById('detailedBox');
const smallLine = document.getElementById('smallLine');

const previousButtons = document.querySelectorAll('button.prev');
const nextButtons = document.querySelectorAll('button.next');

const items = document.querySelectorAll('div.item');
let isMoving = false;

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



items.forEach(element => {
    element.addEventListener("animationend", function() {
        var selectedItemCoords = getCoords(element);
        let smallLine = moveSmallLine(selectedItemCoords).getBoundingClientRect();

        moveDetailedBox(document.querySelectorAll('div.item')[0].getBoundingClientRect(), smallLine.width);

    }, false);
});


function getCoords(elem) {
    let box = elem.getBoundingClientRect();
    return {
        top: box.top + window.pageYOffset,
        right: box.right + window.pageXOffset,
        bottom: box.bottom + window.pageYOffset,
        left: box.left + window.pageXOffset
    };
}

function moveSmallLine(itemCoords) {
    smallLine.style.top = (itemCoords.top + itemCoords.bottom) / 2 + 'px';
    smallLine.style.left = itemCoords.right + 'px';
    smallLine.style.display = 'block';
    smallLine.style.transition = '1000ms';
    smallLine.style.opacity = 1;
    return smallLine;
}

function moveDetailedBox(firstItemCoords, smallLineWidth) {
    //TODO: Currently only for left side.
    detailedBox.style.top = firstItemCoords.top + 'px';
    detailedBox.style.left = (firstItemCoords.right + smallLineWidth) + 'px';
    detailedBox.style.height = (3 * firstItemCoords.height + 2 * 50 - 5) + 'px';
    detailedBox.style.display = 'block';

    detailedBox.style.opacity = 1;
}

window.document.body.addEventListener('click', function() {
    hideDetailedBox();
});

function hideDetailedBox() {
    //detailedBox.style.display = 'none';
    //smallLine.style.display = 'none';

    detailedBox.style.opacity = 0;
    smallLine.style.opacity = 0;
}

// ++=-CURSOR-=++


//Initialize page
cursor.style.display = 'none';


//Turn on/off the cursor when active/inactive
let timeout;
document.onmousemove = function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() { cursor.style.display = 'none'; }, 5000);
}

//Move the cursor
document.addEventListener('mousemove', e => {
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

function isColliding(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}


// ++=-CAROUSEL-=++

var Carousel = {
    width: 200, // Images are forced into a width of this many pixels.
    numVisible: 3, // The number of images visible at once.
    duration: 750, // Animation duration in milliseconds.
    padding: 200, // Vertical padding around each image, in pixels.
    itemMargin: 99
};

window.onload = function() {
    var carousel = Carousel.carousel = document.getElementById('carousel'),
        items = carousel.querySelectorAll('div.item'),
        numItems = items.length,
        itemWidth = 150,
        itemHeight = 150,
        padding = Carousel.padding,
        //rowHeight = Carousel.rowHeight = itemHeight + 2 * padding;
        rowHeight = Carousel.rowHeight = 2 * itemHeight + 2 * padding;
    carousel.style.width = itemWidth + 'px';

    for (var i = 0; i < numItems; ++i) {
        var item = items[i],
            imageHolder = document.createElement('div');

        item.id = i;
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
        let itemName = document.createElement('p');
        itemName.innerHTML = "Silver Ring " + i;
        item.appendChild(itemName);
    }



    carousel.style.width = 200 + 'px';
    carousel.style.alignItems = 'center';


    //TODO: Might throw NullPointerException
    Carousel.rowHeight = getDistanceBetweenElements(
        document.querySelectorAll("div.item")[0],
        document.querySelectorAll("div.item")[1]
    );
    carousel.style.height = Carousel.numVisible * Carousel.rowHeight + 'px';
    carousel.style.visibility = 'visible';
    carousel.style.overflow = 'hidden';




    var wrapper = Carousel.wrapper = document.createElement('div');
    wrapper.id = 'carouselWrapper';
    wrapper.style.width = carousel.style.width;
    wrapper.style.height = carousel.offsetHeight + 'px';
    wrapper.style.marginBottom = Carousel.itemMargin / 2 + "px";
    carousel.parentNode.insertBefore(wrapper, carousel);
    wrapper.appendChild(carousel);



};

function animate(begin, end, finalTask) {
    hideDetailedBox();
    var wrapper = Carousel.wrapper,
        carousel = Carousel.carousel,
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