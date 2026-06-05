function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 0)
  // asks HTML to access device camera
  webcam = creaetCapture(VIDEO);
  capture.hide();
  imageMode(CENTER)
}


function draw() {
  image(webcam, width/2, height/2);
}
