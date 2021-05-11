import CustomerService from "./commercetools/service/CustomerService.js";
import ProductService from "./commercetools/service/ProductService.js";


let customerService = new CustomerService();
let productService = new ProductService();
// customerService.getFavouritesOfCustomer("d8727a5a-a13b-4edb-823c-e989000112e1")
//     .then(async shoppingList => {
//         let productId = "a22ec04f-8afd-4622-b7d4-351c334159eb";
//         await customerService.addFavourite(shoppingList, productId)
//             .then(customerService.getFavouritesOfCustomer("d8727a5a-a13b-4edb-823c-e989000112e1")
//                 .then(async shoppingList => {
//                     await customerService.removeFavourite("d8727a5a-a13b-4edb-823c-e989000112e1", "a22ec04f-8afd-4622-b7d4-351c334159eb")
//                         .then(async () => {
//                                 await customerService.getFavouritesOfCustomer("d8727a5a-a13b-4edb-823c-e989000112e1")
//                                     .then(shoppingList => {
//                                     })
//                             }
//                         )
//
//
let iconHolders = document.querySelectorAll('.iconHolder');

iconHolders.forEach(iconHolder => {
    iconHolder.addEventListener('transitionend', function () {
        let oldIcon = iconHolder.querySelector('i');
        let newIcon = document.createElement('i');
        if (iconHolder.classList.contains('star')) {
            if (oldIcon.classList.contains('far')) {
                oldIcon.remove();
                newIcon.className = 'fas fa-star fa-3x yellow';
                iconHolder.appendChild(newIcon);
                addProductToCustomerFavourites();
            } else {
                oldIcon.remove();
                newIcon.className = 'far fa-star fa-3x';
                iconHolder.appendChild(newIcon);
                removeProductFromCustomerFavourites();
            }
        } else if (iconHolder.classList.contains('trash')) {
            if (oldIcon.classList.contains('far')) {
                document.getElementById('detailedBox').style.opacity = '0';
                document.getElementById('smallLine').style.opacity = '0';
                let selectedItem = document.querySelector('div.item.selected');
                let carouselOfSelectedItem = selectedItem.parentElement.parentElement.parentElement;
                if (carouselOfSelectedItem.className.includes('left')) {
                    setProductSuggestions(selectedItem);
                } else if (carouselOfSelectedItem.className.includes('right')) {
                    suggestedItems = suggestedItems.filter(function (value, index, arr) {
                        return value.key != selectedItem.id;
                    });
                    sessionStorage.setItem('suggestions', JSON.stringify(suggestedItems));
                }
                selectedItem.parentElement.removeChild(selectedItem);


            }
        }
        newIcon.classList.add('iconAni');
    })
})

function addProductToCustomerFavourites() {
    try {
        let customerId = sessionStorage.getItem('customerId');
        customerService.getFavouritesOfCustomer(customerId).then(shoppingList => {
            let selectedProduct = document.querySelector('div.item.selected');
            let productId = allAvailableItems.find(item => item.key == selectedProduct.id).productId;
            customerService.addFavourite(shoppingList, productId);
        });
    } catch (error) {
        console.log(error)
    }
}

function removeProductFromCustomerFavourites() {
    try {
        let customerId = sessionStorage.getItem('customerId');
        let selectedProduct = document.querySelector('div.item.selected');
        let productId = allAvailableItems.find(item => item.key == selectedProduct.id).productId;
        customerService.removeFavourite(customerId, productId);
    } catch (error) {
        console.log(error)
    }
}

function setProductSuggestions(selectedItem) {
    scannedItems = scannedItems.filter(function (value, index, arr) {
        return value.key != selectedItem.id;
    });
    sessionStorage.setItem('barcodes', JSON.stringify(scannedItems));
    if (scannedItems.length === 0) {
        sessionStorage.setItem("suggestions", JSON.stringify([]));
        return window.location.href = "/main";
    }

    let categories = [];
    for (let productIndex = 0; productIndex < scannedItems.length; productIndex++) {
        const item = scannedItems[productIndex];
        for (let categoryIndex = 0; categoryIndex < item.length; categoryIndex++) {
            const categorie = item[categoryIndex];
            categories.push(categorie);
        }
    }

    productService.getSuggestions(categories).then(products => {
        let suggestedItemsArray = [];
        products.forEach(product => {
            productService.getCategories(product.categories).then(r => {
                product.categoriesNames = r;
                suggestedItemsArray.push(product);
                new Promise((resolve, reject) => { resolve(sessionStorage.setItem("suggestions", JSON.stringify(suggestedItemsArray))) }).then(() => {
                    window.location.href = "/main";
                })
            });
        })
    })
}