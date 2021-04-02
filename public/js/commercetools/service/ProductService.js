// let ProductDao = require("../dao/ProductDAO");
import ProductDAO from '../dao/ProductDAO.js';
export default class ProductService {
    constructor() {
        this.productDao = new ProductDAO();
    }
    getProductById(id) {
        return this.productDao.getProductById(id).then((result) => {
            return {
                key: result.key,
                name: result.masterData.current.name["nl-NL"],
                description: result.masterData.current.metaDescription["nl-NL"],
                categories: result.masterData.current.categories,
                price: result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                img: result.masterData.current.masterVariant.images[0].url,
            };
        });
    }
    getProductByKey(key) {
        return this.productDao.getProductByKey(key).then((result) => {
            return {
                key: result.key,
                name: result.masterData.current.name["nl-NL"],
                description: result.masterData.current.metaDescription["nl-NL"],
                categories: result.masterData.current.categories,
                price: result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                img: result.masterData.current.masterVariant.images[0].url,
            };
        });
    }
    getProducts() {
        return this.productDao.getProducts().then(results => {
            let filteredProducts = [];
            let filteredProduct = null;
            results.forEach(result => {
                    filteredProduct =  {
                        key: result.key,
                        name: result.masterData.current.name["nl-NL"],
                        description: result.masterData.current.metaDescription["nl-NL"],
                        categories: result.masterData.current.categories,
                        price: result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                        img: result.masterData.current.masterVariant.images[0].url,
                    };

                    filteredProducts.push(filteredProduct);
            });
            return filteredProducts;
        });
    }

    async getCategories(categoryIds) {
        let categories = [];
        for (const categoryId of categoryIds) {
            let categoryName = await this.productDao.getCategoryNameById(categoryId.id);
            categories.push(categoryName);
        }
        return categories;
    }
}
// module.exports = ProductService;