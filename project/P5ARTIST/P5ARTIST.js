const PALETTE = ['#CC1111','#CC1111','#1A1A1A','#1A1A1A','#8C8680','#B0AAA4','#D4820A','#F0EAD6'];
//COLOR PALETTE  RED                   BLACK              WARM GREY LIGHT GREY YELLOW    CREAM

function setup() {
  createCanvas(windowWidth, windowHeight);
  background('#d1cec7');
  rectMode(CENTER);
  ellipseMode(CENTER);
}

function draw() {
  if (pmouseX !== mouseX || pmouseY !== mouseY) {
     if (frameCount % 2 !== 0) return;  // LESS DENSE
    //ALL RANDOMISED
    const col = color(PALETTE[floor(random(PALETTE.length))]); 
    const size = random(20, 120);
    const sw = random(1, 6);
    const shape = floor(random(5));

    push();
    translate(mouseX, mouseY);
    rotate(random(TWO_PI)); // rotate randomly

    if (random() < 0.5) fill(col);
    else noFill();
    stroke(col);
    strokeWeight(sw);

    if (shape === 0) {
      // rectangle
      rect(0, 0, size, size * random(0.4, 1.6));
    } else if (shape === 1) {
      // circle
      ellipse(0, 0, size, size);
    } else if (shape === 2) {
      // line
      strokeWeight(random(2, 10));
      line(-size / 2, 0, size / 2, 0);
    } else if (shape === 3) {
      // triangle
      const r = size / 2;
      triangle(0, -r, -r * 0.866, r * 0.5, r * 0.866, r * 0.5);
    } else {
      // arc
      noFill();
      strokeWeight(random(2, 8));
      arc(0, 0, size, size, 0, random(HALF_PI, TWO_PI));
    }

    pop();
  }
}

function mousePressed() {
  background(242, 237, 225);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(242, 237, 225);
}
