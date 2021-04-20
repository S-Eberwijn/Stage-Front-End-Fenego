document.querySelector('.circle').style.right = `${document.querySelector('.container').getBoundingClientRect().left - 200}px`


let countdown = document.querySelector('.count');
countdown.addEventListener('animationend', function () {
    window.location.href = "/";
});
window.onload = function () {
    let timeLeft = parseInt(countdown.innerHTML) - 1;
    setInterval(function () {
        if (timeLeft >= 0) countdown.innerHTML = timeLeft--;
    }, 1000);
}