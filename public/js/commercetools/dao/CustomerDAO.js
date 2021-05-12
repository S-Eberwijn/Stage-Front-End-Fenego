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
            projectkey: "stage-pxl-20",
            disableRefreshToken: false,
            credentials: {
                clientId: "tesYg1HdkwOXngl3oCECKlAE",
                clientSecret: "8Lo4p0N9mW7xIDE7a4c8WUBvT2BibS1d"
            },
            scopes: ['manage_project:stage-pxl-20']
        })
        this.bearerToken = this.getBearerToken().then(data => {
            this.bearerToken = data.access_token;
        })
        this.requestBuilder = CommercetoolsApiRequestBuilder.createRequestBuilder({
            projectKey: 'stage-pxl-20',
            features: [CommercetoolsApiRequestBuilder.features.queryLocation]
        });
        this.customerService = this.requestBuilder.customers;
        this.shoppinglistService = this.requestBuilder.shoppingLists;
console.log(this.customerService.build())
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
            .then(result => {
                returnResults = result.body.results;
                return returnResults;
            }
            )
            .catch(error => console.log(error));
    }
    async getShoppingLists() {
        //AKA ShoppingList

        let request = this.getBearerToken().then((data) => {
            this.bearerToken = data.access_token;
            return request = {
                uri: this.shoppinglistService.build(),
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                }
            }
        });
        let returnResults = null;
        return this.client.execute(await request)
            .then(result => {
                returnResults = result.body.results;
                return returnResults;
            })
            .catch(error => console.log(error));
    }

    async addItemToList(shoppingList, productId) {
        let returnBody = {
            version: shoppingList.version,
            actions: [{
                action: "addLineItem",
                productId: productId
            }]
        };
        let request = this.getBearerToken().then((dataà) => {
            this.bearerToken = data.access_token;
            return request = {
                uri: this.shoppinglistService.build() + "/" + shoppingList.id,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                    'Content-Type': 'application/json'
                }
            };
        });
        request.body = JSON.stringify(returnBody);
        await this.client.execute(await request)
    }

    async removeFavourite(shoppingList, favouriteId){
        let lineItemId;
        for (let i = 0; i < shoppingList.lineItems.length; i++){
            if (shoppingList.lineItems[i].productId === favouriteId) {
                lineItemId = shoppingList.lineItems[i].id;
                break;
            }
        }
        let bodyData = {
            version: shoppingList.version,
            actions: [{
                action: "removeLineItem",
                lineItemId: lineItemId
            }]
        };
        let request = {
            uri: this.shoppinglistService.build() + "/" + shoppingList.id,
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json'
            }
        };
        request.body = bodyData;
        await this.client.execute(request)
    }
    async createShoppingListForCustomer(customerId, listType) {
        console.log("yesyes?")
        let newList;
        await this.createShoppingList(listType).then((r) => {newList = r.body;})
        let bodyData = {
            version: newList.version,
            actions: [{
                action: "setCustomer",
                customer: {
                    typeId: "customer",
                    id: customerId
                }
            }]
        };
        console.log(customerId);
        console.log(bodyData);
        let request = this.getBearerToken().then(data => {
            this.bearerToken = data.access_token;
            return request = {
                uri: this.shoppinglistService.build() + "/" + newList.id,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                    'Content-Type': 'application/json'
                },
                body: bodyData
            };
        });

        let returnResults = null;
        return await this.client.execute(await request)
            .then(result => {
                returnResults = result.body;
                return returnResults;
            })
            .catch(error => console.log(error));
    }

    async createShoppingList(listType) {
        //listname should be "favouritesList" or "scannedList"
        let request = this.getBearerToken().then(data => {
            this.bearerToken = data.access_token;
            return request = {
                uri: this.shoppinglistService.build(),
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.bearerToken}`,
                    'Content-Type': 'application/json'
                },
                body: {
                    name: {
                        en: listType
                    }
                }
            };
        });
        return await this.client.execute(await request)
    }

}