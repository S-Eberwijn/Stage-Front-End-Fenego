let data = {};


let itemNames = ['Queens Ring', 'Kings Ring', 'Black Widow Ring', 'Hercules Ring', 'Brothers Alu Ring', 'The Ocean Crest', 'The Purity Wings Pin', 'The Purity Lily Ring', 'The Heaven Voice'];
let itemCodeNumber = 0;

function createItemData() {
    for (let i = 0; i < AMOUNT_OF_SCANNED_ITEMS; i++) {
        let barcode = createItemCodeString();
        data[`${barcode}`] = {};
        data[`${barcode}`]["name"] = `${itemNames[Math.floor(Math.random() * Math.floor(itemNames.length))]}`;
        //TODO: make the image selection dynamic, as in get length of the Images folder.
        data[`${barcode}`]["img"] = `./images/Rings/ring${Math.floor(Math.random() * 6)}.png`;
        data[`${barcode}`]["description"] = `${i} - ${getLoremIpsum()}`;
        data[`${barcode}`]["tags"] = ["Ring", "Steel", "Small"];
        data[`${barcode}`]["price"] = `€${Math.floor(Math.random() * 100) + 20},${Math.floor(Math.random() * 9)}${Math.floor(Math.random() * 9)}`;
    }
};

function getLoremIpsum() {
    return "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales egestas odio a venenatis. Duis lobortis imperdiet dolor. Suspendisse et porta metus. Phasellus facilisis felis id nisl auctor, nec laoreet enim tempor. Cras dictum dui eget mollis accumsan. Nunc diam mauris, interdum nonsapien nec, mattis pellentesque purus. Donec molestie posuere eleifend.";
}

function createItemCodeString() {
    let codeString = itemCodeNumber.toString();
    for (let index = 0; codeString.length < 12; index++) {
        codeString = `0${codeString}`;
    }
    itemCodeNumber++;
    return codeString;
}


createItemData();


