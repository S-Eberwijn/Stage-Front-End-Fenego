import CustomerService from "./commercetools/service/CustomerService.js";
import ProductService from "./commercetools/service/ProductService.js";

let cardStack = document.querySelector('div.card-stack');
let zIndexCounter = 999;





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

            cardElement.addEventListener('animationend', function () {
                cardElement.parentElement.removeChild(cardElement);
            });
            zIndexCounter--;
        }
    });
}

