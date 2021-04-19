import ProductService from "./commercetools/service/ProductService.js";
let logger = document.querySelector('.logger');
let logMessages = [];

Quagga.init({}, function(err) {
    if (err) {
        console.log(err);
    }
    Quagga.start();
    addToLogger('Starting scanner...');
});



Quagga.onProcessed(function(result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
        if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
            result.boxes.filter(function(box) {
                return box !== result.box;
            }).forEach(function(box) {
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
Quagga.onDetected(function(result) {
    console.log(result.codeResult.code);
    if (scannercheck !== result.codeResult.code) {
        scannercheck = result.codeResult.code;
        counter = 0;
    } else {
        counter++;
        if (counter === 75) {
            addToLogger('Identified barcode...');
            addToLogger('Fetching product...');
            productService.getProductByKey(result.codeResult.code).then(product => {
                productService.getCategories(product.categories).then(r => {
                    let categoryIds = product.categories;
                    product.categories = r;
                    var code = JSON.parse(sessionStorage.getItem("barcodes")) || [];
                    code.push(product);
                    sessionStorage.setItem("barcodes", JSON.stringify(code));
                    productService.getSuggestions(categoryIds).then(r => {
                        sessionStorage.setItem("suggestions", JSON.stringify(r));
                        window.location.href = "/";
                    })
                })
            });
        }
    }
    //TODO: Check if barcode already exists in the array
    //TODO: Make it so only the barcode scans

});

function addToLogger(message) {
    logMessages.push(message);
    logger.innerHTML = `${logMessages.slice(logMessages.length - 3, logMessages.length).join('<br/>')}`;
}