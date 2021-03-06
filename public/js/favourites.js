import CustomerService from "./commercetools/service/CustomerService.js";
import ProductService from "./commercetools/service/ProductService.js";


let customerService = new CustomerService();
let productService = new ProductService();
let iconHolders = document.querySelectorAll('.iconHolder');

iconHolders.forEach(iconHolder => {
    iconHolder.addEventListener('transitionend', function() {
        if (window.getComputedStyle(detailedBox).getPropertyValue("opacity").includes('0')) return;

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
                    suggestedItems = suggestedItems.filter(function(value, index, arr) {
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
            let product = allAvailableItems.find(item => item.key == selectedProduct.id);
            customerService.addItemToList(shoppingList, product.productId);
            product.isFavourite = true;
            sessionStorage.setItem('barcodes', JSON.stringify(scannedItems));
            sessionStorage.setItem('suggestions', JSON.stringify(suggestedItems));
        });
    } catch (error) {
        console.log(error)
    }
}



function removeProductFromCustomerFavourites() {
    try {
        let customerId = sessionStorage.getItem('customerId');
        let selectedProduct = document.querySelector('div.item.selected');
        let product = allAvailableItems.find(item => item.key == selectedProduct.id);
        customerService.removeFavourite(customerId, product.productId);
        product.isFavourite = false;
        sessionStorage.setItem('barcodes', JSON.stringify(scannedItems));
        sessionStorage.setItem('suggestions', JSON.stringify(suggestedItems));
    } catch (error) {
        console.log(error)
    }
}

function setProductSuggestions(selectedItem) {
    scannedItems = scannedItems.filter(function(value, index, arr) {
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