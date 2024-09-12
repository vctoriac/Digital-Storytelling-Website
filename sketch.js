let img;
let imgX, imgY;
let dragging = false;
let drawing = false;

function preload() {
  img = loadImage('Images/miso.png'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imgX = width / 2;
  imgY = height / 2;
  background(235, 220, 210); 
}

function draw() {
  image(img, imgX, imgY);
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
    imgX = mouseX - img.width / 2;
    imgY = mouseY - img.height / 2;
  } else if (drawing) {
    stroke(0); 
    strokeWeight(10); 
    line(pmouseX, pmouseY, mouseX, mouseY); // Draw a line from the previous mouse position to the current mouse position
  }
}

function mouseReleased() {
  dragging = false; // Stop dragging the image when the mouse is released
  drawing = false; // Stop drawing when the mouse is released
}
