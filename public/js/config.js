const MAX_VISIBLE_ITEMS = 3;
const ITEMS_MARGIN = 100;
const AMOUNT_OF_SCANNED_ITEMS = 50;
const CAROUSEL_ANIMATION_TIME = 1000;

const cursor = document.getElementById("cursorLeft");

let carouselIsMoving = false;
let isFirstTime = true;
let greeterAnimationTime = 4000;
let scannedItems = JSON.parse(sessionStorage.getItem("barcodes")) || null;
