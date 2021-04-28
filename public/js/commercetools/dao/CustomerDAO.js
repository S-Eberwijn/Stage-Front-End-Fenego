export default class CustomerDAO {
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
        this.requestBuilder = CommercetoolsApiRequestBuilder.createRequestBuilder({
            projectKey: 'pr-stagepxl',
            features: [CommercetoolsApiRequestBuilder.features.queryLocation]
        });
        this.customerService = this.requestBuilder.customers;
    }
    async getBearerToken() {
        let request = CommercetoolsSdkAuth.default._buildRequest(this.authClient.config, this.authClient.BASE_AUTH_FLOW_URI);
        let processedRequest = this.authClient._process(request);
        return await processedRequest;
    }
    getCustomerById(customerId) {

    }
    async getCustomers() {
        let request = this.getBearerToken().then(data => {
            this.bearerToken = data.access_token;
            return request = {
                uri: this.customerService.build(),
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                },
            };
        });

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
}