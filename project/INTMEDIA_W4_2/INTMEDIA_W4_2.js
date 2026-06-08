function setup() {
  createCanvas(windowWidth, windowHeight);
  background("blue");
  rectMode(CENTER);
}

function draw() {
  background(0,0,255, 10)
  square(mouseX, mouseY, 30);
}
