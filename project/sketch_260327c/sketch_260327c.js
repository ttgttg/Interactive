function setup() {
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
