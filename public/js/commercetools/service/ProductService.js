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
                price: "€" + result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
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
                price: "€" + result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                img: result.masterData.current.masterVariant.images[0].url,
            };
        });
    }
    getAllProducts() {
        return this.productDao.getProducts().then(results => {
            let filteredProducts = [];
            let filteredProduct = null;
            results.forEach(result => {
                    filteredProduct =  {
                        key: result.key,
                        name: result.masterData.current.name["nl-NL"],
                        description: result.masterData.current.metaDescription["nl-NL"],
                        categories: result.masterData.current.categories,
                        price: "€" + result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                        img: result.masterData.current.masterVariant.images[0].url,
                    };
                    filteredProducts.push(filteredProduct);
            });
            return filteredProducts;
        });
    }
    async getSuggestions(categoryIds) {
        let products = await this.getAllProducts();
        let filteredProducts = products.filter((pr) => {
            let prCategories = [];
            for(let cat of pr.categories) {
                prCategories.push(cat.id);
            }
            for (const categoryId of categoryIds) {
                if (prCategories.includes(categoryId.id)) {
                    return false;
                }
            }
            return true;
        });
        return filteredProducts.slice(0, 20);
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