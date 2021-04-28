import CustomerService from "../commercetools/service/CustomerService.js";
let bla = new CustomerService();
const imageUpload = document.getElementById('imageUpload')

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('models')
]).then(start)

async function start() {
    const container = document.createElement('div')
    container.style.position = 'relative'
    document.body.append(container)
    let faceMatcher;
    let image
    let canvas
    const labeledFaceDescriptors = await loadLabeledImages().then((result) => {
        return result;
    });
    console.log(labeledFaceDescriptors);
    let loaded = false;
    console.log("na log");
    faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6)
    document.body.append('Loaded')
    console.log(labeledFaceDescriptors); console.log("all done");


    imageUpload.addEventListener('click', async () => {

        if (image) image.remove()
        if (canvas) canvas.remove()
        image = document.createElement("img");
        image.src = "./labeled_images/something.jpg";
        container.append(image)
        image.addEventListener('load', async () => {
            canvas = faceapi.createCanvasFromMedia(image)
            container.append(canvas)
            const displaySize = { width: image.width, height: image.height }
            faceapi.matchDimensions(canvas, displaySize)
            const detections = await faceapi.detectAllFaces(image).withFaceLandmarks().withFaceDescriptors()
            const resizedDetections = faceapi.resizeResults(detections, displaySize)
            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor))
            results.forEach((result, i) => {
                const box = resizedDetections[i].detection.box
                const drawBox = new faceapi.draw.DrawBox(box, { label: result.toString() })
                drawBox.draw(canvas)
            })
        })



    })
}

function loadLabeledImages() {
    const labels = [];
    const images = [];
    let counter = 0;
    let customers;
    customers = bla.getAllCustomers();
    return customers.then(customers => {
        customers.forEach(customer => {
            console.log("customer " + customer);
            labels.push(customer.name);
            images.push(customer.img);
        });
        return Promise.all(labels.map(async label => {
            console.log("labels");
            const descriptions = [];
            const img = await faceapi.fetchImage(images[counter]);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            descriptions.push(detections.descriptor);
            console.log(descriptions);console.log("descriptions");
            counter++;
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        }))
    });

    // console.log(labels);console.log("help");

}
function loadLabeledImagesOri() {
    const labels = ['Black Widow', 'Captain America', 'Captain Marvel', 'Hawkeye', 'Jim Rhodes', 'Thor', 'Tony Stark']
    return Promise.all(
        labels.map(async label => {
            const descriptions = []
            for (let i = 1; i <= 2; i++) {
                const img = await faceapi.fetchImage(`https://raw.githubusercontent.com/WebDevSimplified/Face-Recognition-JavaScript/master/labeled_images/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                descriptions.push(detections.descriptor)
            }

            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}