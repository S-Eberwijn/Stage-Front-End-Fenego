import CustomerService from "./commercetools/service/CustomerService.js";
import ProductService from "./commercetools/service/ProductService.js";


let customerService = new CustomerService();

let styleElem = document.head.appendChild(document.createElement("style"));
const logger = document.querySelector('.logger');
let cursor = document.getElementById('cursor');
let logMessages = [];

document.addEventListener('mousemove', e => {
    clearInterval(idleTimer);

    cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px; display: block;`);

    idleTimer = setInterval(redirectToStandby, 120000);
});

document.getElementById('backButton').addEventListener('transitionend', function () {
    window.location.href = '/main';
})

Quagga.init({}, function (err) {
    if (err) {
        console.log(err);
    }
    Quagga.start();
    addToLogger('Starting scanner...');
    //Start the timer by adding the animation to the class.
    styleElem.innerHTML = `.l-half::before {
        -webkit-transform-origin: center right;
        -webkit-animation-name: l-rotate;}
        ` + `.r-half::before {
        -webkit-transform-origin: center left;
        -webkit-animation-name: r-rotate;}`;
});

Quagga.onProcessed(function (result) {
    let drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function (box) {
                return box !== result.box;
            }).forEach(function (box) {
                Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
            });
        }

        if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        }

        if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
    }
});

let productService = new ProductService();

let oldScannedBarcode;
let barcodeCertainty = 0;
Quagga.onDetected(function (result) {
    let scannedBarcode = result.codeResult.code;
    console.log(scannedBarcode);
    if (oldScannedBarcode !== scannedBarcode) {
        oldScannedBarcode = scannedBarcode;
        barcodeCertainty = 0;
    } else {
        barcodeCertainty++;
        if (barcodeCertainty === 30) {
            let alreadyScanned = false;
            addToLogger('Identified barcode...');
            addToLogger('Fetching product...');
            productService.getProductByKey(scannedBarcode).then(product => {
                productService.getCategories(product.categories).then(r => {
                    //TODO: make it so suggestion is based on all scanned items categories
                    let categoryIds = product.categories;
                    product.categoriesNames = r;
                    var code = JSON.parse(sessionStorage.getItem("barcodes")) || [];
                    code.forEach(pr => {
                        if (pr.key === product.key) return alreadyScanned = true;
                    });
                    if (alreadyScanned) return addToLogger('Already added this product!');
                    code.push(product);
                    sessionStorage.setItem("barcodes", JSON.stringify(code));
                    addProductToScannedItems(product.productId);
                    setProductSuggestions(productService, categoryIds);

                });
            })
        }
    }
});

//Add a message to the log-array.
function addToLogger(message) {
    logMessages.push(message);
    //Only show the last 3 messages.
    logger.innerHTML = `${logMessages.slice(logMessages.length - 3, logMessages.length).join('<br/>')}`;
}


//double code, fix later
function setProductSuggestions(productService, categoryIds) {
    let suggestedItemsArray = [];

    productService.getSuggestions(categoryIds).then(products => {
        products.forEach(product => {
            productService.getCategories(product.categories).then(r => {
                product.categoriesNames = r;
                suggestedItemsArray.push(product);
                sessionStorage.setItem("suggestions", JSON.stringify(suggestedItemsArray));
                window.location.href = "/main";
            });
        })
    })
}

function addProductToScannedItems(productId) {
    try {
        let customerId = sessionStorage.getItem('customerId');
        customerService.getScannedItemsList(customerId).then(shoppingList => {
            customerService.addItemToList(shoppingList, productId);
        });
    } catch (error) {
        console.log(error)
    }
}