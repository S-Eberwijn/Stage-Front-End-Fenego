let greeting = document.getElementById('greeting');
let wrapper = document.getElementById('wrapper');
const cursor = document.getElementById("cursorLeft");

greeting.addEventListener('animationend', function () {
    greeting.style.display = 'none';
});

wrapper.addEventListener('animationend', function () {
    wrapper.style.opacity = '1';
})