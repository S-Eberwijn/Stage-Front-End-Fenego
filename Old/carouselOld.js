var Carousel = {
    width: 200,     // Images are forced into a width of this many pixels.
    numVisible: 3,  // The number of images visible at once.
    duration: 750,  // Animation duration in milliseconds.
    padding: 200,      // Vertical padding around each image, in pixels.
    itemMargin: 99
};

window.onload = function () {
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

        //Create the image holder div
        imageHolder.className = 'imgHolder';
        item.appendChild(imageHolder);

        //Append Image
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


    var prevButton = document.getElementById('prev'),
        nextButton = document.getElementById('next');


    let isMoving = false;
    prevButton.onclick = function () {
        if (!isMoving) {
            isMoving = true;
            rotateForward();
            animate(-Carousel.rowHeight, 0, function () {
                carousel.style.top = '0';
                isMoving = false;
            });
        }
    };


    nextButton.onclick = function () {
        if (!isMoving) {
            isMoving = true;
            animate(0, -Carousel.rowHeight, function () {
                rotateBackward();
                carousel.style.top = '0';
                isMoving = false;
            });
        }
    };
};

function animate(begin, end, finalTask) {
    var wrapper = Carousel.wrapper,
        carousel = Carousel.carousel,
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

