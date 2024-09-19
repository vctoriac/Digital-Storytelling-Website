let drawingCanvas;
const backgroundImages = []; 
const userImages = [];       
const stickerImages = [];    

let currentImgObj;  
let dragging = false; 
let drawing = false;  
let fadeInProgress = true;
let fadeInAlpha = 0;

function setup() {
  createCanvas(windowWidth, windowHeight); // Create the main canvas

  // Create a separate canvas for drawing
  drawingCanvas = createGraphics(windowWidth, windowHeight);

  // Create an upload button to add images
  let uploadButton = createFileInput(handleFile);
  uploadButton.position(100, 60);

  // Add images 
  addBackgroundImage("./Images/book1200.PNG", 450, 80);
  //addStickerImage("./Images/grid250.PNG", 1250, 450);
  //addStickerImage("./Images/stickynote170.PNG", 1250, 450);
  addStickerImage("./Images/pin65.png", 370, 560);
  addStickerImage("./Images/flower100.PNG", 330, 250);
  addStickerImage("./Images/stamp130.png", 300, 390);
  addStickerImage("./Images/cat165.png", 290, 650);
}

function draw() {
  background(235, 220, 210); // Set bg color

  // Draw all background images
  drawImages(backgroundImages);

  // Draw all user images
  drawImages(userImages);

  // Draw the drawing canvas on top of the main canvas
  image(drawingCanvas, 0, 0);

  // Draw all sticker images with fade-in effect
  drawFadingImages(stickerImages);
}

function drawImages(images) {
  for (const imgObj of images) {
    image(imgObj.img, imgObj.x, imgObj.y, imgObj.sizeX, imgObj.sizeY);
  }
}

function drawFadingImages(images) {
  if (fadeInProgress) {
    fadeInAlpha += 5; // Increase alpha value to create fade-in effect
    if (fadeInAlpha >= 255) {
      fadeInAlpha = 255;
      fadeInProgress = false; // Stop fade-in effect when fully opaque
    }
  }
  for (const imgObj of images) {
    tint(255, fadeInAlpha); // Apply transparency
    image(imgObj.img, imgObj.x, imgObj.y, imgObj.sizeX, imgObj.sizeY);
  }
  noTint(); // Reset tint
}

function mousePressed() {
  dragging = false; 

  // Check if the mouse is over any image
  const images = userImages.concat(stickerImages);
  for (const imgObj of images.slice().reverse()) {
    if (mouseX > imgObj.x && mouseX < imgObj.x + imgObj.sizeX &&
        mouseY > imgObj.y && mouseY < imgObj.y + imgObj.sizeY) {
      dragging = true;
      currentImgObj = imgObj; 
      break;
    }
  }

  if (!dragging) {
    drawing = true; // Start drawing if not dragging an image
  }
}

function mouseDragged() {
  if (dragging) {
    // Move the dragged image to follow the mouse
    currentImgObj.x = mouseX - currentImgObj.sizeX / 2;
    currentImgObj.y = mouseY - currentImgObj.sizeY / 2;
  } else if (drawing) {
    // Draw on the drawing canvas
    drawingCanvas.stroke(0); // Set stroke color to black
    drawingCanvas.strokeWeight(10); // Set stroke weight
    drawingCanvas.line(pmouseX, pmouseY, mouseX, mouseY); // Draw a line from the last mouse position to the current one
  }
}

function mouseReleased() {
  dragging = false; // Stop dragging when the mouse is released
  drawing = false;  // Stop drawing
}

// Function to handle file uploads
function handleFile(file) {
  if (file.type === 'image') {
    let img = createImg(file.data, ''); // Create an image element from the file data
    img.hide(); // Hide the HTML element
    addUserImage(file.data); // Add the image to the userImages array
  } else {
    console.log('Not an image file!'); // Log a message if the file is not an image
  }
}

function addBackgroundImage(filePath, x = 0, y = 0, sizeX = undefined, sizeY = undefined) {
  addImage(backgroundImages, filePath, x, y, sizeX, sizeY, false);
}

function addUserImage(filePath, x = undefined, y = undefined, sizeX = undefined, sizeY = undefined) {
  addImage(userImages, filePath, x, y, sizeX, sizeY, true);
}

function addStickerImage(filePath, x = undefined, y = undefined, sizeX = undefined, sizeY = undefined) {
  addImage(stickerImages, filePath, x, y, sizeX, sizeY, true);
}

function addImage(images, filePath, x = undefined, y = undefined, sizeX = undefined, sizeY = undefined, movable = true) {
  loadImage(filePath, img => {
    images.push({
      img,
      movable,
      x: x ?? windowWidth / 2,
      y: y ?? windowHeight / 2,
      sizeX: sizeX ?? img.width,
      sizeY: sizeY ?? img.height
    });
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  let newDrawingCanvas = createGraphics(windowWidth, windowHeight);
  newDrawingCanvas.image(drawingCanvas, 0, 0);
  drawingCanvas = newDrawingCanvas;
}