let mainElement = document.getElementById("main");
let greeting = document.getElementById("greeting");
let spinnerElement = document.getElementById("spinner");

if (scannedItems) {
    greeting.parentNode.removeChild(greeting);
    spinnerElement.style.opacity = 1;
    spinnerElement.classList.add('animate2');
    greeterAnimationTime = 0;
} else {
    greeting.classList.add('fadeOut')
    greeting.onanimationend = (e) => {
        greeting.parentNode.removeChild(greeting);
        spinnerElement.style.opacity = 1;
        spinnerElement.classList.add('animate2');
    };
}


spinnerElement.onanimationend = (e) => {
    spinnerElement.parentNode.removeChild(spinnerElement);
    mainElement.classList.add('fadeIn');
    mainElement.style.opacity = 1;
};

mainElement.onanimationend = (e) => {
    mainElement.style.opacity = "1";
};