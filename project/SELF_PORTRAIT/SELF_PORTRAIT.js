function setup() {
  createCanvas(600, 700);
  background(10);
}

function draw() {
  background(185, 200, 100);
 
 
  fill(265, 198, 60);
  noStroke();
 

  // back layer
  quad(180, 290, 420, 290, 405, 500, 195, 500);
  
  // left side curtain chunks
  quad(175, 260, 235, 268, 218, 430, 168, 415);
  quad(162, 305, 200, 313, 192, 450, 155, 432);
  
  // right side curtain chunks
  quad(425, 260, 365, 268, 382, 430, 432, 415);
  quad(438, 305, 400, 313, 408, 450, 445, 432);
    
  // shoulders
  fill("green");
  noStroke();
  ellipse(300, 590, 380, 180);
  
  // neck
  fill(215, 178, 140);
  noStroke();
  rect(268, 405, 64, 110);
  

  
  // head
  fill (235, 205, 170);
  noStroke();
  ellipse(300, 360, 195, 225);

  // fringe - layered curtain pieces
  fill(245, 180, 35); // slightly darker for depth
  quad(185, 240, 290, 225, 295, 305, 180, 310); // left fringe
  quad(290, 225, 415, 260, 420, 315, 305, 295); // right fringe

  // wispy fringe ends
  fill(245, 180, 35);
  triangle(180, 295, 230, 310, 195, 340); // left wisp
  triangle(420, 295, 370, 310, 405, 340); // right wisp



  // ears 
  fill(235, 205, 170);
  noStroke();
  ellipse(200, 375, 25, 29);
  ellipse(400, 375, 25, 29);

  // ── FACE ──

  // left eye
  stroke(40, 25, 12);
  strokeWeight(2.5);
  line(232, 352, 278, 352); // straight line lid
  
  noStroke();
  fill(40, 25, 12);
  rect(246, 352, 30, 16); // square beneath
 
  
  // right eye
  stroke(40, 25, 12);
  strokeWeight(2.5);
  line(322, 352, 368, 352); // straight line lid
  
  noStroke();
  fill(40, 25, 12);
  rect(338, 352, 30, 16); // square beneath

  // eyebrows
  stroke(40, 25, 12);
  strokeWeight(3.5);
  noFill();
  beginShape();
  vertex(230, 332);
  vertex(248, 327);
  vertex(278, 331);
  endShape();

  beginShape();
  vertex(322, 331);
  vertex(352, 327);
  vertex(370, 332);
  endShape();

  // nose
  stroke(185, 148, 112);
  strokeWeight(1.8);
  noFill();
  line(298, 368, 289, 396);
  line(289, 396, 311, 396);
  
  // nose piercing
  fill(240, 240, 240); 
  noStroke();
  ellipse(308, 386, 5, 5); // sits at the nostril

  // mouth
  noStroke();
  fill(195, 108, 98);
  ellipse(300, 424, 48, 16);

  // lip line
  stroke(160, 82, 72);
  strokeWeight(1.2);
  line(276, 424, 324, 424);
}
