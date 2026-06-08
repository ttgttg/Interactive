// PRESS TO DRAW, SPEED AFFECTS THICKNESS

let paper;

function preload() {
  paper = loadImage("data/texture.jpg"); // ← your texture file
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  image(paper, 0, 0, width, height); // ← draw once as background
  rectMode(CENTER);
}

function draw() {
  let speed = abs(pmouseX - mouseX) + abs(pmouseY - mouseY);
  let thickness = map(speed, 0, 60, 18, 1);

  if (mouseIsPressed) {
    // ← only draws when held down
    noFill();
    strokeCap(ROUND);
    stroke(0, 0, 0, 180);
    strokeWeight(thickness);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
}

/*function setup() {
createCanvas(windowWidth, windowHeight);
background("black")
rectMode(CENTER);
textSize(60);
//frameRate(12)
}


function draw() {
  //background(0,16);
  //fill(random(255),random(255),random(255))
  
  circle(mouseX, mouseY, 50-abs(pmouseX - mouseX));
  //textSize(random(100));
  stroke(255);
  strokeWeight((50-abs(pmouseX - mouseX))/4);
  
  
  if (mouseIsPressed){
    fill("red");
    stroke("red");
  }
  else {
    fill("white");
    stroke("white");
  }
  
  line(pmouseX, pmouseY, mouseX, mouseY)
  //text("0_0", mouseX, mouseY);
  //line(width/2, height/2, mouseX, mouseY);

}
  */
