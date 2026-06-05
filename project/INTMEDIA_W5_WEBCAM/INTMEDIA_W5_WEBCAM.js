function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255, 255, 0)
  // asks HTML to access device camera
  webcam = createCapture(VIDEO);
  webcam.hide();
  imageMode(CENTER);
}


function draw() {
  
  image(webcam, mouseX, mouseY);
  let mouseposterisevalue = map(mouseX, 0, width, 2, 16);
    filter(POSTERIZE, mouseposterisevalue);
    //Tothers include HRESHOLD
}
