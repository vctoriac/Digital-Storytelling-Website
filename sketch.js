let drawingCanvas;
const backgroundImages = []; 
const userImages = [];       
const stickerImages = [];    

let currentImgObj;  
let dragging = false; 
let drawing = false;  

function setup() {
  createCanvas(windowWidth, windowHeight); // Create the main canvas

  // Create a separate canvas for drawing
  drawingCanvas = createGraphics(windowWidth, windowHeight);

  // Create an upload button to add images
  let uploadButton = createFileInput(handleFile);
  uploadButton.position(100, 60);

  // Add images 
  addBackgroundImage("./images/book3.PNG", 30, -50);
  addStickerImage("./images/pin.PNG", 100, 100);
  addStickerImage("./images/flower.png", 200, 200);
  addStickerImage("./images/austin.png", 300, 300);
}

function draw() {
  background(235, 220, 210); // Set bg color

  // Draw all background images
  drawImages(backgroundImages);

  // Draw all user images
  drawImages(userImages);

  // Draw the drawing canvas on top of the main canvas
  image(drawingCanvas, 0, 0);

  // Draw all sticker images on top
  drawImages(stickerImages);
}

function drawImages(images) {
  for (const imgObj of images) {
    image(imgObj.img, imgObj.x, imgObj.y, imgObj.sizeX, imgObj.sizeY);
  }
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
    addUserImage(file.data); // Add the image to user images
  } else {
    console.log('Not an image file!');
  }
}

function addBackgroundImage(filePath, x, y, sizeX, sizeY) {
  addImage(backgroundImages, filePath, x, y, sizeX, sizeY, false);
}

function addUserImage(filePath, x, y, sizeX, sizeY) {
  addImage(userImages, filePath, x, y, sizeX, sizeY, true);
}

function addStickerImage(filePath, x, y, sizeX, sizeY) {
  addImage(stickerImages, filePath, x, y, sizeX, sizeY, true);
}

function addImage(images, filePath, x, y, sizeX, sizeY, movable = true) {
  // Load the image and add it to the array of images
  loadImage(filePath, img => {
    const imgObj = {
      img: img,
      movable: movable,
      x: x ?? windowWidth / 2, // Default to center if not provided
      y: y ?? windowHeight / 2,
      sizeX: sizeX ?? img.width, // Default to image's original size if not provided
      sizeY: sizeY ?? img.height
    };
    images.push(imgObj);
  });
}

// Handle window resizing
function windowResized() {
  // Create a new graphics canvas with the new window size
  let newDrawingCanvas = createGraphics(windowWidth, windowHeight);
  // Copy the old drawing canvas content to the new one
  newDrawingCanvas.image(drawingCanvas, 0, 0);
  drawingCanvas = newDrawingCanvas; // Replace the old canvas
  resizeCanvas(windowWidth, windowHeight); // Resize the main canvas
}
