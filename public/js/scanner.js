import ProductService from "./commercetools/service/ProductService.js";
let styleElem = document.head.appendChild(document.createElement("style"));
let logger = document.querySelector('.logger');
let logMessages = [];

Quagga.init({}, function (err) {
    if (err) {
        console.log(err);
    }
    Quagga.start();
    addToLogger('Starting scanner...');
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

let scannercheck;
let counter = 0;
Quagga.onDetected(function (result) {
    console.log(result.codeResult.code);
    if (scannercheck !== result.codeResult.code) {
        scannercheck = result.codeResult.code;
        counter = 0;
    } else {
        counter++;
        if (counter === 75) {
            let alreadyScanned = false;
            let suggestedItemsArray = [];
            addToLogger('Identified barcode...');
            addToLogger('Fetching product...');
            productService.getProductByKey(result.codeResult.code).then(product => {
                productService.getCategories(product.categories).then(r => {
                    let categoryIds = product.categories;
                    product.categories = r;
                    var code = JSON.parse(sessionStorage.getItem("barcodes")) || [];
                    code.forEach(pr => {
                        if (pr.key === product.key) return alreadyScanned = true;
                    });
                    if (alreadyScanned) return addToLogger('Already added this product!');
                    code.push(product);
                    sessionStorage.setItem("barcodes", JSON.stringify(code));
                    productService.getSuggestions(categoryIds).then(products => {
                        products.forEach(product => {
                            productService.getCategories(product.categories).then(r => {
                                product.categories = r;
                                suggestedItemsArray.push(product);
                                console.log(suggestedItemsArray);
                                sessionStorage.setItem("suggestions", JSON.stringify(suggestedItemsArray));
                                window.location.href = "/";

                            });
                        })
                    })
                });
            })

        }
    }
});

function addToLogger(message) {
    logMessages.push(message);
    logger.innerHTML = `${logMessages.slice(logMessages.length - 3, logMessages.length).join('<br/>')}`;
}