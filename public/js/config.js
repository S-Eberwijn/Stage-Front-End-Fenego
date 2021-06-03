const MAX_VISIBLE_ITEMS = 3;
const ITEMS_MARGIN = 100;
const CAROUSEL_ANIMATION_TIME = 1000;


let carouselIsMoving = false;
let isFirstTime = sessionStorage.getItem("isFirstTime") || 'true';
let scannedItems = JSON.parse(sessionStorage.getItem("barcodes")) || [];
let suggestedItems = JSON.parse(sessionStorage.getItem("suggestions")) || [];
let allAvailableItems = scannedItems.concat(suggestedItems);
allAvailableItems = allAvailableItems.filter(function(item) { return (item != null) });

const CT_API_HOST = "https://api.europe-west1.gcp.commercetools.com";
const CT_AUTH_HOST = "https://auth.europe-west1.gcp.commercetools.com";
const PROJ_KEY = "stage-pxl-20";
const CLIENT_ID = "tesYg1HdkwOXngl3oCECKlAE";
const CLIENT_SECRET = "8Lo4p0N9mW7xIDE7a4c8WUBvT2BibS1d";