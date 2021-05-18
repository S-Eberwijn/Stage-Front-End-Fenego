import ProductService from "./commercetools/service/ProductService.js";

let cardStack = document.querySelector('div.card-stack');
let zIndexCounter = 999;
let stylesMap = new Map();
let outfitsList = [];

const swipeRightButton = document.querySelector(".global-actions .right-action");
const swipeLeftButton = document.querySelector(".global-actions .left-action");




window.onload = async function () {
    let productService = new ProductService();
    await productService.getAllOutfits().then(outfits => {
        for (let index = 0; index < outfits.length; index++) {
            const outfit = outfits[index];
            let cardElement = document.createElement('div')
            cardElement.classList.add('card');
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

            cardStack.appendChild(cardElement);
            cardElement.appendChild(cardOverlayElement);
            cardElement.appendChild(cardInformationElement);
            cardInformationElement.appendChild(cardOutfitNameElement);
            cardInformationElement.appendChild(cardOutfitDescriptionElement);
            cardInformationElement.appendChild(cardOutfitPriceElement);

            outfitsList.push(outfit);

            cardElement.addEventListener('animationend', function () {
                cardElement.parentElement.removeChild(cardElement);
            });
            zIndexCounter--;
        }
    });
}

swipeLeftButton.addEventListener('click', function () {
    let swipedElement = document.querySelector('div.card-stack div.card');
    let selectedOutfit = outfitsList.find(outfit => outfit.outfitId === swipedElement.id);
    adjustScore(selectedOutfit, -1);
    swipedElement.classList.add('swipe-left');

});

swipeRightButton.addEventListener('click', function () {
    let swipedElement = document.querySelector('div.card-stack div.card');
    if(swipedElement !== null) {
        let selectedOutfit = outfitsList.find(outfit => outfit.outfitId === swipedElement.id);
        adjustScore(selectedOutfit, 1);
        swipedElement.classList.add('swipe-right');
    } else {
        getWinningOutfit()
    }

});

function adjustScore(selectedOutfit, scoreAdjustment) {
    selectedOutfit.categories.value.forEach(style => {
        if(stylesMap.get(style['en-US']) === undefined) {
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
    console.log(highToLow);
    console.log(popularStyle);
    console.log(secondStyle);
    let popularList = outfitsList.filter(outfit => filterOneStyle(outfit, popularStyle));
    let twoStyleList = outfitsList.filter(outfit => filterTwoStyles(outfit, popularStyle, secondStyle));
    let thirdStyleList = outfitsList.filter(outfit => filterThreeStyles(outfit, popularStyle, secondStyle, thirdStyle));
    console.log(popularList);
    console.log(twoStyleList);
    console.log(thirdStyleList);
    return twoStyleList;


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
        if (styles[i]['en-US'] === popularStyle
        || styles[i]['en-US'] === secondStyle) {
            score++;
        }
    }

    return score === 2;
}

function filterThreeStyles(outfit, popularStyle, secondStyle, thirdStyle) {
    let styles = outfit.categories.value;
    let score = 0;
    for (let i = 0; i < styles.length; i++) {
        if (styles[i]['en-US'] === popularStyle
        || styles[i]['en-US'] === secondStyle
        || styles[i]['en-US'] === thirdStyle) {
            score++;
        }
    }

    return score === 3;
}
