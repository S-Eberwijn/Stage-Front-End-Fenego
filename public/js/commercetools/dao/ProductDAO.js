export default class ProductDAO {
    constructor() {
        this.client = CommercetoolsSdkClient.createClient({
            middlewares: [
                CommercetoolsSdkMiddlewareHttp.createHttpMiddleware({
                    host: CT_API_HOST
                }),
            ],
        });
        this.authClient = new CommercetoolsSdkAuth.default({
            host: CT_AUTH_HOST,
            projectkey: PROJ_KEY,
            disableRefreshToken: false,
            credentials: {
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET
            },
            scopes: [`manage_project:${PROJ_KEY}`]

        })
        this.bearerToken = "";
        this.getBearerToken().then(data => {
            this.bearerToken = data.access_token;
        });

        this.requestBuilder = CommercetoolsApiRequestBuilder.createRequestBuilder({
            projectKey: PROJ_KEY,
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
    getProductById(id) {
        const request = {
            uri: this.productsService.build() + "/" + id, //max 500
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

    async getProducts() {
        let request = this.getBearerToken().then((data) => {
            this.bearerToken = data.access_token;
            return request = {
                uri: this.productsService.build() + "?limit=400", //max 500
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                }
            };
        })
        let returnResults = null;
        return this.client.execute(await request)
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
