var mouseDown = 0;

// document.body.onmousedown = function() {
//   ++mouseDown;
//   console.log(mouseDown);
// };
document.body.onmouseup = function() {
  --mouseDown;
};
