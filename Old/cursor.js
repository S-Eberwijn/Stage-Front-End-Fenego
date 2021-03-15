// ++=-CURSOR-=++

//Variables
const cursor = document.getElementById("cursor");

//Initialize page
cursor.style.display = 'none';


//Turn on/off the cursor when active/inactive
let timeout;
document.onmousemove = function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () { cursor.style.display = 'none'; }, 5000);
}

//Move the cursor
document.addEventListener('mousemove', e => {
    cursor.setAttribute("style", `top: ${e.pageY - 15}px; left: ${e.pageX - 15}px`);
    document.querySelectorAll('div.item').forEach(item => {
        if (isColliding(cursor.getBoundingClientRect(), item.getBoundingClientRect())) {
            item.classList.add('selectingItem');
        } else {
            if (item.classList.contains('selectingItem')) {
                item.classList.remove('selectingItem');
            }
        }
    });
    document.querySelectorAll('button').forEach(button => {
        if (isColliding(cursor.getBoundingClientRect(), button.getBoundingClientRect())) {
            console.log('collides')
            button.classList.add('arrow-down');
        } else {
            if (button.classList.contains('arrow-down')) {
                button.classList.remove('arrow-down');
            }
        }
    })

});


function isColliding(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}





