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



async function start() {
    let titel = document.getElementById("titelElement");
    titel.innerHTML = "Bezig met identificeren!";
    const labeledFaceDescriptors = await loadLabeledImages();
    let image, canvas;
    if (image) image.remove()
    if (canvas) canvas.remove()
    image = document.createElement("img");
    image.src = blobURL;
    image.addEventListener('load', async () => {
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors)

        const singleResult = await faceapi
            .detectSingleFace(image)
            .withFaceLandmarks()
            .withFaceDescriptor()

        sessionStorage.setItem("customerName", "Anoniempje");

        if (singleResult) {
            const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)

            sessionStorage.setItem("customerName", bestMatch.label);
            for(let i = 0; i < customerList.length; i++) {
                if (customerList[i].name === bestMatch.label) {
                    sessionStorage.setItem("customerId", bestMatch.label);
                }
            }
        }

        let vidWrapper = document.getElementsByClassName("vidWrapper")[0];
        vidWrapper.parentElement.removeChild(vidWrapper);
        titel.innerHTML = `Welkom ${sessionStorage.getItem("customerName")}!`;
        setTimeout(function () {
            window.location.href = '/';
        }, 3000);
    });
}
let ids = [];
let customerList;

async function loadLabeledImages() {
    const labels = [];
    const images = [];
    ;
    return await customerService.getAllCustomers().then(async customers => {
        customerList = customers;
        let counter = -1;
        for (let i = 0; i < customers.length; i++) {
            labels.push(customers[i].name);
            images.push(customers[i].img);
            ids.push(customers[i].customerId);
        }
        return await Promise.all(labels.map(async label => {
            const descriptions = [];
            counter = counter + 1;
            const img = await faceapi.fetchImage(images[counter]);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptions.push(detections.descriptor);
            return await new faceapi.LabeledFaceDescriptors(label, descriptions)
        }))
    });

}