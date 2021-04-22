// //TODO: Rewrite this to a function.
// //Check for each next-button if the cursor is colliding.
// nextButtons.forEach(button => {
//     if (isColliding(cursorLeft.getBoundingClientRect(), button.getBoundingClientRect()) && !button.classList.contains('disabled')) {
//         button.classList.add('selecting');
//     } else {
//         if (button.classList.contains('selecting')) {
//             button.classList.remove('selecting');
//         }
//     }
// });
// //Check for each previous-button if the cursor is colliding.
// previousButtons.forEach(button => {
//     if (isColliding(cursorLeft.getBoundingClientRect(), button.getBoundingClientRect()) && !button.classList.contains('disabled')) {
//         button.classList.add('selecting');
//     } else {
//         if (button.classList.contains('selecting')) {
//             button.classList.remove('selecting');
//         }
//     }
// });

// function isColliding(a, b) {
//     return !(
//         ((a.y + a.height) < (b.y)) ||
//         (a.y > (b.y + b.height)) ||
//         ((a.x + a.width) < b.x) ||
//         (a.x > (b.x + b.width))
//     );
// }