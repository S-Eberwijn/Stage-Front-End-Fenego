let items = document.querySelectorAll('div.item');

const MAX_VISIBLE_ITEMS = 3;
const ITEMS_MARGIN = 70;


window.onload = function () {
    console.log(document.getElementsByClassName('carousel')[0].getBoundingClientRect().height / 3)
    items.forEach(item => {
        //Border width of an item div, only lower than 9px.
        var borderW = getComputedStyle(item, null).getPropertyValue('border-left-width').substr(0, 1);
        //Margin correction so the overlapping margin from the boxes in the middle is taken care of.
        var marginCorrection = 0
        for (let index = 1; index < MAX_VISIBLE_ITEMS; index++) {
            marginCorrection += 0.5;
            //WHEN MAX VISIBLE ITEMS IS 1, (ITEMS_MARGIN * 1.5) SHOULD BE (ITEMS_MARGIN * 0)
            //WHEN MAX VISIBLE ITEMS IS 2, (ITEMS_MARGIN * 1.5) SHOULD BE (ITEMS_MARGIN * .5)
            //WHEN MAX VISIBLE ITEMS IS 3, (ITEMS_MARGIN * 1.5) SHOULD BE (ITEMS_MARGIN * 1)
            //WHEN MAX VISIBLE ITEMS IS 4, (ITEMS_MARGIN * 1) SHOULD BE (ITEMS_MARGIN * 1.5)
        }
        //Calculate the item div height, based on the height of the carousel, MAX_VISIBLE_ITEMS and ITEMS_MARGIN.
        item.style.height = `${((document.getElementsByClassName('carousel')[0].getBoundingClientRect().height - (ITEMS_MARGIN * marginCorrection)) / MAX_VISIBLE_ITEMS) - (2 * borderW) - (ITEMS_MARGIN / MAX_VISIBLE_ITEMS)}px`;
        //Add the margin to the top and bottom of the item div.
        item.style.marginTop = `${ITEMS_MARGIN / 2}px`;
        item.style.marginBottom = `${ITEMS_MARGIN / 2}px`;
    });
}