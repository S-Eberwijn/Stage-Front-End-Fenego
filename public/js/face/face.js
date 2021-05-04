const vid = document.querySelector("video");
let i = 4; //countdown in 10 seconds
let blobURL;
import CustomerService from "../commercetools/service/CustomerService.js";
let customerService = new CustomerService();

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('models')
]).then(() => {
    navigator.mediaDevices.getUserMedia({ video: true }) // request cam
        .then(stream => {
            vid.srcObject = stream; // don't use createObjectURL(MediaStream)
            return vid.play(); // returns a Promise
        })
        .then(() => { // enable the button
            let intervalid = setInterval(function () {
                if (i == 0) {
                    takeASnap().then(blob => {
                        console.log(getBlobURL(blob))
                        blobURL = getBlobURL(blob);
                        document.getElementById('pop_up').style.display = 'block';
                        document.getElementById('spinning-circle').style.display = 'block';
                        start();
                    });
                    clearInterval(intervalid);
                }
                document.getElementById("countdown").innerHTML = i;
                i--;
            }, 1000);
        })
        .catch(e => console.log('please use the fiddle instead'));
});

function takeASnap() {
    const canvas = document.createElement('canvas'); // create a canvas
    const ctx = canvas.getContext('2d'); // get its context
    canvas.width = vid.videoWidth; // set its size to the one of the video
    canvas.height = vid.videoHeight;
    ctx.drawImage(vid, 0, 0); // the video
    return new Promise((res, rej) => {
        canvas.toBlob(res, 'image/jpeg'); // request a Blob from the canvas
    });
}
function getBlobURL(blob) {
    return URL.createObjectURL(blob);
}

/*---------------------------------------------------------------------*/

async function start() {
    let titel = document.getElementById("titelElement");
    titel.innerHTML = "Bezig met identificeren!";
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    let image, canvas;
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = document.createElement("img");
    image.src = blobURL;
    image.addEventListener('load', async () => {
        canvas = faceapi.createCanvasFromMedia(image)
        const displaySize = { width: image.width, height: image.height }
        faceapi.matchDimensions(canvas, displaySize)
        const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)
        const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
        results.forEach((result, i) => {
            console.log(result);
        });
        sessionStorage.setItem("customerName", "Anoniempje");
        if (results[0]) {
            if (results[0].label != 'unknown') {
                sessionStorage.setItem("customerName", `${results[0].label}`);
            };
        }
        let vidWrapper = document.getElementsByClassName("vidWrapper")[0];
        vidWrapper.parentElement.removeChild(vidWrapper);
        titel.innerHTML = `Welkom ${sessionStorage.getItem("customerName")}!`;
        setTimeout(function () {
            window.location.href = '/';
        }, 3000);
    });
}

function loadLabeledImages() {
    const labels = [];
    const images = [];
    let counter = 0;
    let customers;
    customers = customerService.getAllCustomers();
    return customers.then(customers => {
        customers.forEach(customer => {
            labels.push(customer.name);
            images.push(customer.img);
        });
        return Promise.all(labels.map(async label => {
            const descriptions = [];
            const img = await faceapi.fetchImage(images[counter]);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptions.push(detections.descriptor);
            counter++;
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        }))
    });
}