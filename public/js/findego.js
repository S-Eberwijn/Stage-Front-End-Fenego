import ProductService from "./commercetools/service/ProductService.js";

// const videoElement = document.getElementById("input_video");
const cursor = document.getElementById("cursor");
const globalActionsElement = document.querySelector('div.global-actions');
const homeButtonElement = document.getElementById('home');
const swipeRightButton = document.querySelector(".global-actions .right-action");
const swipeLeftButton = document.querySelector(".global-actions .left-action");
let cardStack = document.querySelector('div.card-stack');

let heartIcon = document.createElement('i');
heartIcon.className = "fas fa-heart fa-5x";

let crossIcon = document.createElement('i');
crossIcon.className = "fas fa-times fa-6x";

let isCursorLocked = false;
// let cursorX, cursorY;

let productService = new ProductService();
const MAX_OUTFITS = 5;
let zIndexCounter = 999;
let stylesMap = new Map();
let chosenOutfits = [];
let isShowingWinner = false;

let resetCursorTimer = setInterval(resetCursor, 750);


window.onload = async function() {
    await productService.getAllOutfits().then(outfits => {
        let randomlyChosenOutfits = outfits.sort((a, b) => 0.5 - Math.random()).slice(0, MAX_OUTFITS);
        createCardElementWithOutfit(randomlyChosenOutfits);
    });
};

document.addEventListener('mousemove', e => {
    clearInterval(resetCursorTimer)
    if (isCursorLocked) return;

    cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px; display: block;`);

    resetCursorTimer = setInterval(resetCursor, 750);
});


function resetCursor() { cursor.style.display = `none` }

homeButtonElement.addEventListener('transitionend', function() {
    window.location.href = "/";
});
homeButtonElement.addEventListener('click', function() {
        window.location.href = "/";
    });
swipeLeftButton.addEventListener('animationend', function() {
    let cardToSwipe = document.querySelector('div.card-stack div.card');
    if (!cardToSwipe) return console.log('no cards left to swipe');
    cardToSwipe.classList.add('swipe-left');
    cardToSwipe.querySelector('.card-overlay').appendChild(crossIcon)
    cardToSwipe.querySelector('.card-overlay').classList.add('left');

    let selectedOutfit = chosenOutfits.find(outfit => outfit.outfitId === cardToSwipe.id);
    adjustScore(selectedOutfit, -1);

    resetCursor();
    isCursorLocked = true;
    setTimeout(() => { isCursorLocked = false }, 1000);
});
swipeRightButton.addEventListener('animationend', function() {
    let cardToSwipe = document.querySelector('div.card-stack div.card');
    if (!cardToSwipe) return console.log('no cards to swipe left');
    cardToSwipe.classList.add('swipe-right');
    cardToSwipe.querySelector('.card-overlay').appendChild(heartIcon)
    cardToSwipe.querySelector('.card-overlay').classList.add('right');

    let selectedOutfit = chosenOutfits.find(outfit => outfit.outfitId === cardToSwipe.id);
    adjustScore(selectedOutfit, 1);

    resetCursor();
    isCursorLocked = true;
    setTimeout(() => { isCursorLocked = false }, 1000);
});




swipeLeftButton.addEventListener('click', function() {
    let cardToSwipe = document.querySelector('div.card-stack div.card');
    if (!cardToSwipe) return console.log('no cards left to swipe');
    cardToSwipe.classList.add('swipe-left');
    cardToSwipe.querySelector('.card-overlay').appendChild(crossIcon)
    cardToSwipe.querySelector('.card-overlay').classList.add('left');

    let selectedOutfit = chosenOutfits.find(outfit => outfit.outfitId === cardToSwipe.id);
    adjustScore(selectedOutfit, -1);

    resetCursor();
    isCursorLocked = true;
    setTimeout(() => { isCursorLocked = false }, 1000);
});

swipeRightButton.addEventListener('click', function() {
    let cardToSwipe = document.querySelector('div.card-stack div.card');
    if (!cardToSwipe) return console.log('no cards to swipe left');
    cardToSwipe.classList.add('swipe-right');
    cardToSwipe.querySelector('.card-overlay').appendChild(heartIcon)
    cardToSwipe.querySelector('.card-overlay').classList.add('right');

    let selectedOutfit = chosenOutfits.find(outfit => outfit.outfitId === cardToSwipe.id);
    adjustScore(selectedOutfit, 1);

    resetCursor();
    isCursorLocked = true;
    setTimeout(() => { isCursorLocked = false }, 1000);

});

function adjustScore(selectedOutfit, scoreAdjustment) {
    selectedOutfit.categories.value.forEach(style => {
        if (stylesMap.get(style['en-US']) === undefined) {
            stylesMap.set(style['en-US'], scoreAdjustment);
        } else {
            stylesMap.set(style['en-US'], stylesMap.get(style['en-US']) + scoreAdjustment);
        }
    });
}

function getWinningOutfit() {
    const highToLow = Array.from(new Map([...stylesMap.entries()].sort((a, b) => b[1] - a[1])));

    let popularStyle = highToLow[0][0];
    let secondStyle = highToLow[1][0];
    let thirdStyle = highToLow[2][0];

    let popularList = chosenOutfits.filter(outfit => filterOneStyle(outfit, popularStyle));
    let twoStyleList = chosenOutfits.filter(outfit => filterTwoStyles(outfit, popularStyle, secondStyle));
    let thirdStyleList = chosenOutfits.filter(outfit => filterThreeStyles(outfit, popularStyle, secondStyle, thirdStyle));

    if (thirdStyleList.length === 0) {
        if (twoStyleList.length === 0) {
            return Array(popularList[Math.floor(Math.random() * popularList.length)]);

        } else {
            return Array(twoStyleList[Math.floor(Math.random() * twoStyleList.length)]);

        }
    } else {
        return Array(thirdStyleList[Math.floor(Math.random() * thirdStyleList.length)]);
    }
}

function filterOneStyle(outfit, popularStyle) {
    let bool = false;
    outfit.categories.value.forEach(style => {
        if (style['en-US'] === popularStyle) {
            bool = true;
        }
    });
    return bool;
}

function filterTwoStyles(outfit, popularStyle, secondStyle) {
    let styles = outfit.categories.value;
    let score = 0;
    for (let i = 0; i < styles.length; i++) {
        if (styles[i]['en-US'] === popularStyle ||
            styles[i]['en-US'] === secondStyle) {
            score++;
        }
    }
    return score === 2;
}

function filterThreeStyles(outfit, popularStyle, secondStyle, thirdStyle) {
    let styles = outfit.categories.value;
    let score = 0;
    for (let i = 0; i < styles.length; i++) {
        if (styles[i]['en-US'] === popularStyle ||
            styles[i]['en-US'] === secondStyle ||
            styles[i]['en-US'] === thirdStyle) {
            score++;
        }
    }
    return score === 3;
}

function createCardElementWithOutfit(outfits) {
    for (let index = 0; index < outfits.length; index++) {
        const outfit = outfits[index];
        let cardElement = document.createElement('div')
        cardElement.classList.add('card');
        cardElement.id = outfit.outfitId;
        cardElement.style.zIndex = zIndexCounter;
        cardElement.style.backgroundImage = `url(${outfit.img})`;

        let cardOverlayElement = document.createElement('div');
        cardOverlayElement.classList.add('card-overlay');

        let cardInformationElement = document.createElement('div');
        cardInformationElement.classList.add('card-information');

        let cardOutfitNameElement = document.createElement('p');
        cardOutfitNameElement.classList.add('outfitName');
        cardOutfitNameElement.innerHTML = outfit.name;

        let cardOutfitDescriptionElement = document.createElement('p');
        cardOutfitDescriptionElement.classList.add('outfitDescription');
        cardOutfitDescriptionElement.innerHTML = outfit.description;

        let cardOutfitPriceElement = document.createElement('p');
        cardOutfitPriceElement.classList.add('outfitPrice');
        cardOutfitPriceElement.innerHTML = outfit.price.replace('.', ',');

        if (isShowingWinner) {
            cardElement.classList.add('winner');


            cardStack.appendChild(cardElement);
            cardElement.appendChild(cardOverlayElement);
            cardElement.appendChild(cardInformationElement);
            cardInformationElement.appendChild(cardOutfitNameElement);
            cardInformationElement.appendChild(cardOutfitDescriptionElement);
            cardInformationElement.appendChild(cardOutfitPriceElement);
            setTimeout(function() {
                cardElement.classList.add('fadeIn');

            }, 250)
            setTimeout(function() {
                cardElement.classList.add('slideRight');
                let topPercentage = 5;
                let startTimeTransition = 250;

                outfit.references.forEach(item => {
                    productService.getProductById(item.id).then(product => {
                        let itemContainer = document.createElement('div');
                        itemContainer.classList.add('item-container');
                        itemContainer.style.top = `${topPercentage}%`;


                        let itemImage = document.createElement('img');
                        itemImage.src = product.img;

                        let itemName = document.createElement('p');
                        itemName.classList.add('itemName')
                        itemName.innerHTML = product.name;

                        let itemPrice = document.createElement('p');
                        itemPrice.classList.add('itemPrice')
                        itemPrice.innerHTML = product.price;

                        cardStack.appendChild(itemContainer);
                        itemContainer.appendChild(itemImage);
                        itemContainer.appendChild(itemName);
                        itemContainer.appendChild(itemPrice);

                        setTimeout(function() {
                            itemContainer.classList.add('slideLeft');
                        }, startTimeTransition)

                        topPercentage += 20;
                        startTimeTransition += 250;
                    })
                })

            }, 1000)
        } else {
            cardStack.appendChild(cardElement);
            cardElement.appendChild(cardOverlayElement);
            cardElement.appendChild(cardInformationElement);
            cardInformationElement.appendChild(cardOutfitNameElement);
            cardInformationElement.appendChild(cardOutfitDescriptionElement);
            cardInformationElement.appendChild(cardOutfitPriceElement);
        }

        cardElement.addEventListener('animationend', function() {

            cardElement.parentElement.removeChild(cardElement);
            if (cardStack.children.length === 0) {
                isShowingWinner = true;
                globalActionsElement.remove();
                createCardElementWithOutfit(getWinningOutfit())
            }

        });
        zIndexCounter--;
    }
    chosenOutfits = outfits;
}