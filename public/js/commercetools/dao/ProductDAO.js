export default class ProductDAO {
    constructor() {
        this.client = CommercetoolsSdkClient.createClient({
            middlewares: [
                CommercetoolsSdkMiddlewareHttp.createHttpMiddleware({
                    host: "https://api.europe-west1.gcp.commercetools.com"
                }),
            ],
        });

        this.requestBuilder = CommercetoolsApiRequestBuilder.createRequestBuilder({
            projectKey: 'pr-stagepxl',
            features: [CommercetoolsApiRequestBuilder.features.queryLocation]
        });
        this.productsService = this.requestBuilder.products;
        this.categoryService = this.requestBuilder.categories;
        console.log(this.categoryService.build());
    }
    getProductById(id) {
        const request = {
            uri: this.productsService.build() + "/" + id, //max 500
            method: 'GET',
            headers: {
                Authorization: 'Bearer SaGtOIXlnusgaqhHXSNDTteUel1hZLax',
            },
        };
        return this.client.execute(request)
            .then(
                result => {
                    return result.body;
                }
            )
            .catch(error => console.log(error));
    }
    getProductByKey(key) {
        const request = {
            uri: this.productsService.byKey(key).build(), //max 500
            method: 'GET',
            headers: {
                Authorization: 'Bearer SaGtOIXlnusgaqhHXSNDTteUel1hZLax',
            },
        };
        return this.client.execute(request)
            .then(
                result => {
                    return result.body;
                }
            )
            .catch(error => console.log(error));
    }

    getProducts() {
        const request = {
            uri: this.productsService.build() + "?limit=400", //max 500
            method: 'GET',
            headers: {
                Authorization: 'Bearer SaGtOIXlnusgaqhHXSNDTteUel1hZLax',
            },
        };
        let returnResults = null;
        return this.client.execute(request)
            .then(
                result => {
                    returnResults = result.body.results;
                    return returnResults;
                }
            )
            .catch(error => console.log(error));
    }

    async getCategoryNameById(id) {
        const request = {
            uri: this.categoryService.build() + "/" + id,
            method: 'GET',
            headers: {
                Authorization: 'Bearer SaGtOIXlnusgaqhHXSNDTteUel1hZLax',
            },
        };
        let categoryName = this.client.execute(request)
            .then(
                result => {
                    return result.body.name["nl-NL"]
                }
            )
            .catch(error => console.log(error));
        return await categoryName;
    }
}

// module.exports = ProductDAO;
