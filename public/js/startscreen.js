const greeting = document.getElementById('greeting');
const videoElement = document.getElementById("input_video");
const cursor = document.getElementById("cursor");
const modes = document.querySelectorAll('div.mode');
const wrapper = document.querySelector('#wrapper');

let cursorY, cursorX;

document.addEventListener('mousemove', e => {
    clearInterval(idleTimer);

    cursor.setAttribute('style', `top: ${e.pageY}px; left: ${e.pageX}px; display: block;`);

    idleTimer = setInterval(redirectToStandby, 120000);
});

modes.forEach(mode => {
    mode.addEventListener('animationend', function() {
        if (mode.id.toLowerCase().includes('findego')) {
            console.log('findego');
            window.location.href = "/findego";
        } else if (mode.id.toLowerCase().includes('main')) {
            console.log('main');
            window.location.href = "/main";
        }
    })
});

greeting.addEventListener('animationend', function() {
    greeting.style.display = 'none';
});

wrapper.addEventListener('animationend', function() {
    wrapper.style.opacity = '1';
});