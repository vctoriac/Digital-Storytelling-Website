let drawingCanvas;

let img;
let imgX, imgY;

let dragging = false;
let drawing = false;

function preload() {
  img = loadImage('Images/miso.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // create separate drawing canvas
  drawingCanvas = createGraphics(windowWidth, windowHeight);
  // init starting position of image
  imgX = windowWidth / 2;
  imgY = windowHeight / 2;
}

function draw() {
  // redraw background and canvases
  background(235, 220, 210);
  image(drawingCanvas, 0, 0);
  image(img, imgX, imgY, 200, 200);
}

function mousePressed() {
  if (mouseX > imgX && mouseX < imgX + img.width && mouseY > imgY && mouseY < imgY + img.height) {
    dragging = true;
  } else {
    drawing = true; // Start drawing if not dragging an image
  }
}

function mouseDragged() {
  if (dragging) {
    // update image positions
    imgX = mouseX - img.width / 2;
    imgY = mouseY - img.height / 2;
  } else if (drawing) {
    // draw stroke on drawing canvas
    drawingCanvas.stroke(0);
    drawingCanvas.strokeWeight(10);
    drawingCanvas.line(pmouseX, pmouseY, mouseX, mouseY); // Draw a line from the previous mouse position to the current mouse position
  }
}

function mouseReleased() {
  dragging = false; // Stop dragging the image when the mouse is released
  drawing = false; // Stop drawing when the mouse is released
}
