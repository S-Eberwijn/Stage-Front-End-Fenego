import CustomerService from "./commercetools/service/CustomerService.js";
let customerService = new CustomerService();

customerService.getFavouritesOfCustomer("d8727a5a-a13b-4edb-823c-e989000112e1").then(shoppingList => {
    let productId = "a22ec04f-8afd-4622-b7d4-351c334159eb";
    console.log(shoppingList)
    customerService.addFavourite(shoppingList, productId)
});


