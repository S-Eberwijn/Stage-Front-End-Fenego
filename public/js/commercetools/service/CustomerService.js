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
            .then(async shoppingLists => {
                let returnList = [];
                for (let i = 0; i < shoppingLists.length; i++) {
                    if (shoppingLists[i].customer['id'] === customerId) {
                        returnList = shoppingLists[i];
                        break;
                    }
                }
                if (returnList.length === 0) {
                    returnList = await this.createShoppingListForCustomer()
                }
                return returnList;
            })
    }

    async createShoppingListForCustomer(customerId) {
        let returnList = this.customerDao.createShoppingListForCustomer(customerId).then((r) => {return r});
        return returnList;
    }

    async addFavourite(shoppingList, productId) {
        await this.customerDao.addFavourite(shoppingList, productId)
    }

    async removeFavourite(customerId, favouriteId) {
        await this.getFavouritesOfCustomer(customerId)
            .then(async shoppingList => {
                await this.customerDao.removeFavourite(shoppingList, favouriteId)
            });
    }
}