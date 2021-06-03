import CustomerDAO from "../dao/CustomerDAO.js";
export default class CustomerService {
    constructor(ctApiHost, ctAuthHost) {
        this.customerDao = new CustomerDAO(ctApiHost, ctAuthHost);
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
                };
                filteredCustomers.push(filteredCustomer);
            });
            return filteredCustomers;
        })
    }

    getFavouritesOfCustomer(customerId) {
        return this.customerDao.getShoppingLists()
            .then(async shoppingLists => {
                let returnList = [];
                for (let i = 0; i < shoppingLists.length; i++) {

                    if (shoppingLists[i].customer['id'] === customerId
                    && shoppingLists[i].name.en === "favouritesList") {
                        returnList = shoppingLists[i];
                        break;
                    }
                }
                if (returnList.length === 0) {
                    returnList = await this.createShoppingListForCustomer(customerId, "favouritesList")
                }
                return returnList;
            })
    }


    async createShoppingListForCustomer(customerId, listType) {
        let returnList = this.customerDao.createShoppingListForCustomer(customerId, listType).then((r) => {return r});
        return await returnList;
    }

    async addItemToList(shoppingList, productId) {
        await this.customerDao.addItemToList(shoppingList, productId)
    }

    async removeFavourite(customerId, favouriteId) {
        await this.getFavouritesOfCustomer(customerId)
            .then(async shoppingList => {
                await this.customerDao.removeFavourite(shoppingList, favouriteId)
            });
    }

    getScannedItemsList(customerId) { //History of scanned items of customer
        return this.customerDao.getShoppingLists()
            .then(async shoppingLists => {
                let returnList = [];
                for (let i = 0; i < shoppingLists.length; i++) {
                    if (shoppingLists[i].customer['id'] === customerId
                        && shoppingLists[i].name.en === "scannedList") {
                        returnList = shoppingLists[i];
                        break;
                    }
                }
                if (returnList.length === 0) {
                    returnList = await this.createShoppingListForCustomer(customerId, "scannedList")
                }
                return returnList;
            })

    }
}