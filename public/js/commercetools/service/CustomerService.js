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
                    name: result.firstName,
                    img: result.custom.fields.Image
                }
                filteredCustomers.push(filteredCustomer);
            });
            return filteredCustomers;
        })
    }
}