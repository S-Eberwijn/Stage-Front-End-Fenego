const MAX_VISIBLE_ITEMS = 3;
const ITEMS_MARGIN = 100;
const CAROUSEL_ANIMATION_TIME = 1000;


let carouselIsMoving = false;
let isFirstTime = sessionStorage.getItem("isFirstTime") || true;
let greeterAnimationTime = 4000;
let scannedItems = JSON.parse(sessionStorage.getItem("barcodes")) || null;
let suggestedItems = JSON.parse(sessionStorage.getItem("suggestions")) || null;
let allAvailableItems = scannedItems.concat(suggestedItems);
allAvailableItems = allAvailableItems.filter(function (item) { return (item != null) })
