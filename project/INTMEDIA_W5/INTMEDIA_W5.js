var img, smallimg;
function preload(){
  img = loadImage("data/popsicle.webp");
  smallimg = loadImage("data/tofu.png")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("yellow");
  imageMode(CENTER)
  image(img, width/2, height/2,);
  // rectangle has auto CORNER mode
  //uses top left corner as anchor
}


function draw() {
  image(smallimg, mouseX, mouseY,);
}
