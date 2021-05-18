import ProductDAO from '../dao/ProductDAO.js';
import CustomerService from "./CustomerService.js";
export default class ProductService {
    constructor() {
        this.productDao = new ProductDAO();
        this.customerService = new CustomerService();
        this.outfitType = "e967f09f-1d8a-4743-8199-b72fa53afb91";
        this.productType = "d913f2e1-dc20-40ad-9287-44165aecb833";
    }
    getProductById(id) {
        return this.productDao.getProductById(id).then((result) => {
            return {
                key: result.key,
                productId: result['id'],
                name: result.masterData.current.name["nl-NL"],
                description: result.masterData.current.metaDescription["nl-NL"],
                categories: result.masterData.current.categories,
                price: "€" + result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                img: result.masterData.current.masterVariant.images[0].url,
            };
        });
    }
    async getProductByKey(key) {
        return this.productDao.getProductByKey(key).then(async (result) => {
            let favouriteBool = await this.isFavourite(result['id']);
            return {
                key: result.key,
                productId: result['id'],
                name: result.masterData.current.name["nl-NL"],
                description: result.masterData.current.metaDescription["nl-NL"],
                categories: result.masterData.current.categories,
                price: "€" + result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                img: result.masterData.current.masterVariant.images[0].url,
                isFavourite: favouriteBool
            };
        });
    }
    getAllProducts() {
        return this.productDao.getProducts().then(async results => {
            let filteredProducts = [];
            let filteredProduct = null;
            for (const result of results) {
                if (result.productType.id === this.productType) {
                    let favouriteBool = await this.isFavourite(result['id']);
                    filteredProduct = {
                        key: result.key,
                        productId: result['id'],
                        name: result.masterData.current.name["nl-NL"],
                        description: result.masterData.current.metaDescription["nl-NL"],
                        categories: result.masterData.current.categories,
                        price: "€" + result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                        img: result.masterData.current.masterVariant.images[0].url,
                        isFavourite: favouriteBool
                    };
                    filteredProducts.push(filteredProduct);
                }

            }
            return filteredProducts;
        });
    }

    getAllOutfits() {
        return this.productDao.getProducts().then(async results => {
            let filteredProducts = [];
            let filteredOutfit = null;
            for (const result of results) {

                if (result.productType.id === this.outfitType) {
                    console.log(result);
                    let categories, model, season, references;
                    result.masterData.current.masterVariant.attributes.forEach(attribute => {
                        switch (attribute.name) {
                            case "style":
                                categories = attribute;
                                break;
                            case "model":
                                model = attribute;
                                break;
                            case "season":
                                season = attribute;
                                break;
                            case "references":
                                references = attribute.value;
                                break;
                        }
                    });
                    filteredOutfit = {
                        outfitId: result['id'],
                        price: "€" + result.masterData.current.masterVariant.prices[0].value.centAmount / 100,
                        name: result.masterData.current.name["nl-NL"],
                        description: result.masterData.current.metaDescription["nl-NL"],
                        categories: categories,
                        model: model,
                        seasons: season,
                        references: references,
                        img: result.masterData.current.masterVariant.images[0].url
                    };
                    filteredProducts.push(filteredOutfit);
                }
            }
            return filteredProducts;
        });
    }


    async getSuggestions(categoryIds) {
        let products = await this.getAllProducts();
        let filteredProducts = products.filter((pr) => {
            let prCategories = [];
            for (let cat of pr.categories) {
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

    async isFavourite(productId) {
        let customerId = sessionStorage.getItem('customerId');
        return await this.customerService.getFavouritesOfCustomer(customerId).then(favourites => {
            favourites.lineItems.forEach(favourite => {
                if (favourite.productId === productId) {
                    return true;
                }
            });
            return false;
        })

    }


}