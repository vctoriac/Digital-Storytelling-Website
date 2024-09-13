let drawingCanvas;

// Store all images with their positions and states
const backgroundImages = [];
const userImages = [];
const stickerImages = [];

let currentImgObj;
let dragging = false;
let drawing = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a separate drawing canvas
  drawingCanvas = createGraphics(windowWidth, windowHeight);

  // Create an upload button
  let uploadButton = createFileInput(handleFile);
  uploadButton.position(10, 10);
  addBackgroundImage("./images/book3.png", 0, 0)
  addStickerImage("./images/pin.png", 100, 100)
  addStickerImage("./images/flower.png", 200, 200)
  addStickerImage("./images/austin.png", 300, 300)
}

function draw() {
  // Redraw background and canvases
  background(235, 220, 210);

  // Draw all images
  drawImages(backgroundImages)
  drawImages(userImages)
  image(drawingCanvas, 0, 0);
  drawImages(stickerImages)
}

function drawImages(images) {
  for (const imgObj of images) {
    image(imgObj.img, imgObj.x, imgObj.y, imgObj.sizeX, imgObj.sizeY);
  }
}

function mousePressed() {
  dragging = false;

  // Check if the mouse is over any image and enable dragging

  const images = userImages.concat(stickerImages)
  for (const imgObj of images.slice().reverse()) { // Go through the images in reverse order (top image gets priority)
    if (mouseX > imgObj.x && mouseX < imgObj.x + imgObj.sizeX && mouseY > imgObj.y && mouseY < imgObj.y + imgObj.sizeY) {
      dragging = true;
      currentImgObj = imgObj
      break;
    }
  }

  if (!dragging) {
    drawing = true; // Start drawing if not dragging an image
  }
}

function mouseDragged() {
  if (dragging) {
    // Update position of the dragged image
    currentImgObj.x = mouseX - currentImgObj.sizeX / 2;
    currentImgObj.y = mouseY - currentImgObj.sizeY / 2;
  } else if (drawing) {
    // Draw stroke on the drawing canvas
    drawingCanvas.stroke(0);
    drawingCanvas.strokeWeight(10);
    drawingCanvas.line(pmouseX, pmouseY, mouseX, mouseY); // Draw a line from the previous mouse position to the current one
  }
}

function mouseReleased() {
  dragging = false; // Stop dragging the image
  drawing = false;  // Stop drawing
}

// Function to handle uploaded files
function handleFile(file) {
  if (file.type === 'image') {
    let img = createImg(file.data, ''); // Create an image from the file data
    img.hide(); // Hide the HTML element (we just need the p5 image)
    addUserImage(file.data)
  } else {
    console.log('Not an image file!');
  }
}

function addBackgroundImage(filePath, x, y, sizeX, sizeY) {
  addImage(backgroundImages, filePath, x, y, sizeX, sizeY, false)
}

function addUserImage(filePath, x, y, sizeX, sizeY) {
  addImage(userImages, filePath, x, y, sizeX, sizeY, true)
}

function addStickerImage(filePath, x, y, sizeX, sizeY) {
  addImage(stickerImages, filePath, x, y, sizeX, sizeY, true)
}

function addImage(images, filePath, x, y, sizeX, sizeY, movable = true) {
  // Load the image and add to array of images
  loadImage(filePath,
    img => {
      const imgObj = {
        img: img,
        movable: movable,
        x: x ?? windowWidth / 2,
        y: y ?? windowHeight / 2,
        sizeX: sizeX ?? img.width,
        sizeY: sizeY ?? img.height
      }
      images.push(imgObj);
    }
  )
}

// Handle window resizing
function windowResized() {
  // Create a new graphics canvas to store the current drawing
  let newDrawingCanvas = createGraphics(windowWidth, windowHeight);
  // Copy the contents of the old drawing canvas onto the new one
  newDrawingCanvas.image(drawingCanvas, 0, 0);
  // Replace the old drawing canvas with the new one
  drawingCanvas = newDrawingCanvas;
  // Resize the main canvas
  resizeCanvas(windowWidth, windowHeight);
}
