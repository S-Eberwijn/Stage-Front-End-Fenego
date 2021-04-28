export default class ProductDAO {
    constructor() {
        this.client = CommercetoolsSdkClient.createClient({
            middlewares: [
                CommercetoolsSdkMiddlewareHttp.createHttpMiddleware({
                    host: "https://api.europe-west1.gcp.commercetools.com"
                }),
            ],
        });
        this.authClient = new CommercetoolsSdkAuth.default({
            host: "https://auth.europe-west1.gcp.commercetools.com",
            projectkey: "pr-stagepxl",
            disableRefreshToken: false,
            credentials: {
                clientId: "9zgMpbKb5h5B_YhzhUvWgZt2",
                clientSecret: "tsRLTzeSc293vxR9ZMs6tHEd6JeCaHfG"
            },
            scopes: ['manage_project:pr-stagepxl']

        })
        this.bearerToken = "";
        this.getBearerToken().then(data => {
            this.bearerToken = data.access_token;
        });

        this.requestBuilder = CommercetoolsApiRequestBuilder.createRequestBuilder({
            projectKey: 'pr-stagepxl',
            features: [CommercetoolsApiRequestBuilder.features.queryLocation]
        });
        this.productsService = this.requestBuilder.products;
        this.categoryService = this.requestBuilder.categories;
    }
    async getBearerToken() {
        let request = CommercetoolsSdkAuth.default._buildRequest(this.authClient.config, this.authClient.BASE_AUTH_FLOW_URI);
        let processedRequest = this.authClient._process(request);
        return await processedRequest;
    }
    getProductById(productId) {
        const request = {
            uri: this.productsService.build() + "/" + productId, //max 500
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.bearerToken}`,
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
        console.log(this.bearerToken);
        const request = {
            uri: this.productsService.byKey(key).build(), //max 500
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.bearerToken}`,
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
                Authorization: `Bearer ${this.bearerToken}`,
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
                Authorization: `Bearer ${this.bearerToken}`,
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
