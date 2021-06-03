export default class CustomerDAO {
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
        });
        this.bearerToken = this.getBearerToken().then(data => {
            this.bearerToken = data.access_token;
        });
        this.requestBuilder = CommercetoolsApiRequestBuilder.createRequestBuilder({
            projectKey: PROJ_KEY,
            features: [CommercetoolsApiRequestBuilder.features.queryLocation]
        });
        this.customerService = this.requestBuilder.customers;
        this.shoppinglistService = this.requestBuilder.shoppingLists;
    }
    async getBearerToken() {
        let request = CommercetoolsSdkAuth.default._buildRequest(this.authClient.config, this.authClient.BASE_AUTH_FLOW_URI);
        let processedRequest = this.authClient._process(request);

        return await processedRequest;
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
        let request = {
            uri: this.shoppinglistService.build() + "/" + shoppingList.id,
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.bearerToken}`,
                'Content-Type': 'application/json'
            }
        }; 
        request.body = JSON.stringify(returnBody);
        await this.client.execute(request)
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
        //listType should be "favouritesList" or "scannedList"
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