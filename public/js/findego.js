import CustomerService from "./commercetools/service/CustomerService.js";
import ProductService from "./commercetools/service/ProductService.js";

let cardStack = document.querySelector('div.card-stack');
let swipeRightButton = document.querySelector('div.right-action');
let swipeLeftButton = document.querySelector('div.left-action');
let zIndexCounter = 999;

window.onload = async function () {
    let productService = new ProductService();
    await productService.getAllOutfits().then(outfits => {
        for (let index = 0; index < outfits.length; index++) {
            const outfit = outfits[index];
            let cardElement = document.createElement('div')
            cardElement.classList.add('card');
            cardElement.style.zIndex = zIndexCounter;
            cardElement.style.backgroundImage = `url(${outfit.img})`
            cardStack.appendChild(cardElement)

            cardElement.addEventListener('animationend', function () {
                cardElement.parentElement.removeChild(cardElement);
            });
            zIndexCounter--;
        }
    });
}

swipeLeftButton.addEventListener('click', function () {
    document.querySelector('div.card-stack div.card').classList.add('swipe-left');
})
swipeRightButton.addEventListener('click', function () {
    document.querySelector('div.card-stack div.card').classList.add('swipe-right');
})
