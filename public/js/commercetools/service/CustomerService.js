import CustomerDAO from "../dao/CustomerDAO.js";
export default class CustomerService {
    constructor() {
        this.customerDao = new CustomerDAO();
    }
    getAllCustomers() {
        return this.customerDao.getCustomers().then(results => {
            let filteredCustomers = [];
            let filteredCustomer = null;
            results.forEach(result => {
                    filteredCustomer = {
                    customerId: result['id'],
                    name: result.firstName,
                    img: result.custom.fields.Image
                }
                filteredCustomers.push(filteredCustomer);
            });
            return filteredCustomers;
        })
    }

    getFavouritesOfCustomer(customerId) {
        return this.customerDao.getFavourites()
            .then(shoppingLists => {
                let returnList;
                for (let i = 0; i < shoppingLists.length; i++) {
                   if(shoppingLists[i].customer['id'] === customerId) {
                       returnList = shoppingLists[i];
                       break;
                   } else {
                       returnList = "No shoppinglist found for customer";
                   }
                }
                return returnList;
            })
    }

    addFavourite(shoppingList, productId) {
        this.customerDao.addFavourite(shoppingList, productId)
            .then((result) => {
                console.log("done :)")
            })
    }
}