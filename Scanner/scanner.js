Quagga.init({
    inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#video')    // Or '#yourElement' (optional)
    },
    decoder : {
        readers : ["code_128_reader"]
    }
}, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
});

Quagga.onProcessed(function(result) {
    console.log(result);
});



Quagga.onDetected(function(result) {
    var code = result.codeResult.code;
    console.log(code);
    sessionStorage.setItem("barcode", code);
    location.href = "../index.html";

});