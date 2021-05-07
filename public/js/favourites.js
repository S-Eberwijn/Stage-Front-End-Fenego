import CustomerService from "./commercetools/service/CustomerService.js";
let customerService = new CustomerService();

let iconHolders = document.querySelectorAll('.iconHolder');
console.log(iconHolders)

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
            }
        } else if (iconHolder.classList.contains('eye')) {
            if (oldIcon.classList.contains('fa-eye-slash')) {
                oldIcon.remove();
                newIcon.className = 'far fa-eye fa-3x';
                iconHolder.appendChild(newIcon);
            } else {
                oldIcon.remove();
                newIcon.className = 'far fa-eye-slash fa-3x';
                iconHolder.appendChild(newIcon);
            }
        } else if (iconHolder.classList.contains('trash')) {
            if (oldIcon.classList.contains('far')) {

            }
        }
        newIcon.classList.add('iconAni');
    })
})

function addProductToCustomerFavourites() {
    //TODO: Bug that people can select this in the background.
    //TODO: Make the customerId dynamic
    customerService.getFavouritesOfCustomer("d8727a5a-a13b-4edb-823c-e989000112e1").then(shoppingList => {
        let selectedProduct = document.querySelector('div.item.selected');
        let productId = allAvailableItems.find(item => item.key == selectedProduct.id).productId;
        console.log(shoppingList);
        customerService.addFavourite(shoppingList, productId);
    });
}




