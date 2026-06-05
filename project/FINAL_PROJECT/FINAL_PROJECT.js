let mic, amp;
let particles = [];
let glyphs = [];
 
let breathLevel  = 0;   // raw mic amplitude 0–1
let smoothed     = 0;   // smoothed breath level
let calmness     = 0;   // 0 = total chaos, 1 = fully calm
let breathTimer  = 0;   // how long current exhale has lasted (frames)
 
const PARTICLE_COUNT = 100;
const GLYPH_ALPHA    = '⌇⌁⎍⎎⏃⌖⌘⍯⌬⌭⍊⌿⎔⏚⎋⏛⍎⍢⎆⏁⌰⍻⌳⌵⌷'.split('');
 
// ─── SETUP ───────────────────────────────────────────────────────
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  textFont('monospace');

  // Spawn particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  // Visible button — mic starts on click, not immediately
  let btn = createButton('click to enable mic');
  btn.position(width/2 - 80, height/2);
  btn.style('font-size', '16px');
  btn.style('padding', '10px 20px');
  btn.style('cursor', 'pointer');
  btn.mousePressed(() => {
    
      let audio = document.getElementById('bg-audio');
    console.log('audio element:', audio);
    audio.play().then(() => {
      console.log('✓ audio playing');
    }).catch(err => {
      console.log('✗ audio error:', err);
    });
    
    userStartAudio().then(() => {
      
      mic = new p5.AudioIn();  
      mic.start(() => {
        amp = new p5.Amplitude();
        amp.setInput(mic);
        amp.smooth(0.8);
        console.log('✓ mic started');
      });
      btn.remove();
      
      // Download button appears after mic starts
      let dlBtn = createButton('save poem');
      dlBtn.position(20, height - 44);
      dlBtn.style('font-size', '13px');
      dlBtn.style('padding', '8px 16px');
      dlBtn.style('cursor', 'pointer');
      dlBtn.style('background', 'rgba(255,255,255,0.08)');
      dlBtn.style('color', 'white');
      dlBtn.style('border', '0.5px solid rgba(255,255,255,0.25)');
      dlBtn.style('border-radius', '20px');
      dlBtn.style('letter-spacing', '0.06em');
      dlBtn.mousePressed(downloadPoem);
    }).catch(err => {
      console.log('audio error:', err);
      btn.html('mic blocked — check console');
    });
  });
}

 
// ─── DRAW LOOP ───────────────────────────────────────────────────
function draw() {
  // Trail effect — semi-transparent black overlay each frame
  background(0, 0, 5, 18);
 
  // ── 1. Read breath ──────────────────────────────────────────
  breathLevel = amp ? amp.getLevel() : 0;          // 0.0 – 1.0
 
  // Boost and clamp so breathing registers clearly
  breathLevel = constrain(breathLevel * 10, 0, 1);
 
  // Extra smoothing in our own code on top of amp.smooth()
  smoothed = lerp(smoothed, breathLevel, 0.12);
 
  // ── 2. Update calmness ──────────────────────────────────────
  // Rises when you breathe, slowly falls when you stop
  if (smoothed > 0.02) {
    calmness += 0.0008;
    breathTimer++;
  } else {
    calmness -= 0.002;
    breathTimer = 0;
  }
  calmness = constrain(calmness, 0, 1);
 
  let chaos = 1 - calmness * 0.85;  // 1 = full chaos, ~0.15 = calm
 
  // ── 3. Particles ────────────────────────────────────────────
  for (let p of particles) {
    p.update(chaos);
    p.draw();
  }
 
  // ── 4. Central pulse ring ───────────────────────────────────
  drawPulse();
 
  // ── 5. Generate glyphs on breath ────────────────────────────
  // Fire a new glyph every N frames while breathing
  let glyphRate = floor(map(smoothed, 0.1, 1, 20, 4));
  if (smoothed > 0.02 && frameCount % glyphRate === 0) {
    spawnGlyph(smoothed, breathTimer);
  }
 
  // ── 6. Draw accumulated glyph poem ──────────────────────────
  for (let i = glyphs.length - 1; i >= 0; i--) {
    glyphs[i].draw();
    if (glyphs[i].isDead()) glyphs.splice(i, 1);
  }
 
  // ── 7. Debug info (comment out when done) ───────────────────
  drawDebug(chaos);
}
 
// ─── PULSE RING ──────────────────────────────────────────────────
function drawPulse() {
  noFill();
  let cx = width * 0.5, cy = height * 0.45;
  let r  = 30 + smoothed * 80;
  let a  = map(smoothed, 0, 1, 10, 40);
  stroke(35, 30, 80, a);
  strokeWeight(0.5);
  ellipse(cx, cy, r * 2, r * 2);
  stroke(35, 30, 80, a * 0.4);
  ellipse(cx, cy, r * 3.5, r * 3.5);
}
 
// ─── DEBUG OVERLAY ───────────────────────────────────────────────
function drawDebug(chaos) {
  noStroke();
  fill(0, 0, 70, 60);
  textSize(11);
  textAlign(LEFT, TOP);
  text('breath: ' + nf(smoothed, 1, 2), 14, 14);
  text('calmness: ' + nf(calmness, 1, 2), 14, 28);
  text('chaos: ' + nf(chaos, 1, 2), 14, 42);
}
 
// ─── SPAWN GLYPH ─────────────────────────────────────────────────
function spawnGlyph(force, duration) {
  // Stack vertically down the right column with more breathing room
  let col     = width * 0.88;
  let rowH    = map(force, 0.02, 1, 35, 65); // taller rows for bigger marks
  let lastY   = glyphs.length > 0 ? glyphs[glyphs.length - 1].y : 40;
  let row     = lastY + rowH;

  // Wrap back to top when reaching bottom
  if (row > height - 60) row = 40;

  glyphs.push(new Glyph(col, row, force, duration));
  if (glyphs.length > 60) glyphs.shift();
}
 
// ─── PARTICLE CLASS ──────────────────────────────────────────────
class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.baseX  = width  * 0.5 + randomGaussian(0, width  * 0.18);
    this.baseY  = height * 0.45 + randomGaussian(0, height * 0.14);
    this.x      = random(width);
    this.y      = random(height);
    this.vx     = random(-2, 2);
    this.vy     = random(-2, 2);
    this.w      = random(2, 8);     // block width
    this.h      = random(1, 4);     // block height (flat = scanline feel)
    this.hue    = random(160, 200); // cold cyan/teal for glitch
    this.chaos  = random(1.5, 4);
    this.angle  = random(TWO_PI);
    this.speed  = random(0.01, 0.04);
    this.radius = random(20, 80);

    // Glitch state
    this.flickerRate    = random(0.02, 0.15);
    this.visible        = true;
    this.teleportTimer  = floor(random(30, 120));
    this.stretchX       = 1;
    this.stretchY       = 1;
  }

  update(chaosFactor) {
    // ── Orbit / spring (same as before) ──
    this.angle += this.speed * (1 + chaosFactor);
    let tx = this.baseX + cos(this.angle) * this.radius * (1 - chaosFactor * 0.7);
    let ty = this.baseY + sin(this.angle) * this.radius * (1 - chaosFactor * 0.7);
    this.vx += (tx - this.x) * 0.012 * (1 - chaosFactor * 0.5);
    this.vy += (ty - this.y) * 0.012 * (1 - chaosFactor * 0.5);
    this.vx += randomGaussian(0, this.chaos * chaosFactor);
    this.vy += randomGaussian(0, this.chaos * chaosFactor);
    this.vx *= 0.87;
    this.vy *= 0.87;
    this.x  += this.vx;
    this.y  += this.vy;

    // ── Data corruption: random teleport ──
    this.teleportTimer--;
    if (this.teleportTimer <= 0 && chaosFactor > 0.5) {
      // Snap to a random scanline-style position
      this.x = random(width);
      this.y = floor(random(height / 4)) * 4; // snaps to scanline rows
      this.teleportTimer = floor(random(20, 80));
    }

    // ── Flicker: toggle visibility ──
    if (random() < this.flickerRate * chaosFactor) {
      this.visible = !this.visible;
    }

    // ── Signal stretch: horizontal tear ──
    if (chaosFactor > 0.6 && random() < 0.04) {
      this.stretchX = random(3, 18); // sudden horizontal stretch
      this.stretchY = random(0.5, 1);
    } else {
      this.stretchX = lerp(this.stretchX, 1, 0.2); // snap back
      this.stretchY = lerp(this.stretchY, 1, 0.2);
    }

    // Wrap
    if (this.x < -10) this.x = width  + 10;
    if (this.x > width  + 10) this.x = -10;
    if (this.y < -10) this.y = height + 10;
    if (this.y > height + 10) this.y = -10;
  }

  draw() {
    if (!this.visible) return;

    // Colour shifts from cold (glitch) to warm (calm)
    let h = map(calmness, 0, 1, this.hue, 35);
    let s = map(calmness, 0, 1, 80, 25);
    let b = map(calmness, 0, 1, 90, 75);
    let a = map(calmness, 0, 1, 50, 70);

    noStroke();
    fill(h, s, b, a);

    let rw = this.w * this.stretchX;
    let rh = this.h * this.stretchY;
    rect(this.x, this.y, rw, rh); // rect not ellipse = pixel/block feel

    // Chromatic aberration ghost — offset red copy at high chaos
    if (calmness < 0.4) {
      fill(0, 90, 100, 15); // red ghost
      rect(this.x + random(-4, 4), this.y, rw, rh);
      fill(180, 90, 100, 15); // cyan ghost
      rect(this.x + random(-4, 4), this.y, rw, rh);
    }
  }
}
 
// ─── GLYPH CLASS — calligraphic brush marks ──────────────────────
class Glyph {
  constructor(x, y, force, duration) {
    this.x        = x;
    this.y        = y;
    this.force    = force;       // breath strength → stroke weight
    this.duration = duration;    // breath length → stroke complexity
    this.alpha    = map(force, 0.02, 1, 40, 95);
    this.life     = 255;
    this.decay    = 0.08;        // very slow fade — poem persists
    this.strokes  = this.buildStrokes();
  }

  buildStrokes() {
    // Each glyph is 2–5 brush strokes generated from breath data
    let strokes = [];
    let numStrokes = floor(map(this.duration, 0, 180, 2, 5));
    let weight     = map(this.force, 0.02, 1, 1.5, 6);
    let spread     = map(this.force, 0.02, 1, 18, 48);

    for (let i = 0; i < numStrokes; i++) {
      let angle  = random(TWO_PI);
      let len    = random(spread * 0.4, spread);
      let wobble = random(0.3, 1.2); // brush pressure variation

      strokes.push({
        // Start point offset from glyph centre
        x1: randomGaussian(0, spread * 0.25),
        y1: randomGaussian(0, spread * 0.25),
        // End point — directional like a brushstroke
        x2: cos(angle) * len,
        y2: sin(angle) * len * 0.6, // slightly compressed — calligraphic
        weight: weight * wobble,
        // Taper: thick start, thin end
        weight2: weight * wobble * random(0.1, 0.4),
      });
    }
    return strokes;
  }

  draw() {
    let a = this.alpha * (this.life / 255);
    push();
    translate(this.x, this.y);

    for (let s of this.strokes) {
      // Draw tapered stroke — thick to thin like a brush
      let steps = 12;
      for (let t = 0; t < steps; t++) {
        let pct = t / steps;
        let x   = lerp(s.x1, s.x2, pct);
        let y   = lerp(s.y1, s.y2, pct);
        let sw  = lerp(s.weight, s.weight2, pct);
        // Slight ink spread at start
        let spread = sw * 0.3 * (1 - pct);

        stroke(30, 15, 88, a * (1 - pct * 0.3));
        strokeWeight(sw + spread);
        if (t === 0) {
          point(x, y);
        } else {
          let px = lerp(s.x1, s.x2, (t - 1) / steps);
          let py = lerp(s.y1, s.y2, (t - 1) / steps);
          line(px, py, x, y);
        }
      }
    }
    pop();
    this.life -= this.decay;
  }

  isDead() { return this.life <= 0; }
}

// ─── DOWNLOAD POEM ─────────────────────────────────────────────────
function downloadPoem() {
  let pg = createGraphics(900, 1200);
  pg.colorMode(HSB, 360, 100, 100, 100);

  // ── Paper base — aged warm yellow ──────────────────────────
  pg.background(38, 18, 94);

  // ── Noise texture — simulate aged paper grain ───────────────
  pg.loadPixels();
  for (let i = 0; i < pg.pixels.length; i += 4) {
    let grain = random(-18, 18);
    pg.pixels[i]     += grain;
    pg.pixels[i + 1] += grain;
    pg.pixels[i + 2] += grain;
  }
  pg.updatePixels();


  // ── Tian zi ge grid ────────────────────────────────────────
  let margin  = 72;
  let cols    = 6;
  let rows    = 7;
  let cellW   = (pg.width  - margin * 2) / cols;
  let cellH   = (pg.height - margin * 2 - 60) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let x = margin + c * cellW;
      let y = margin + 60 + r * cellH;

      // Outer border — slightly uneven like hand-ruled
      pg.stroke(25, 30, 45, 55);
      pg.strokeWeight(0.8);
      pg.noFill();
      pg.rect(x, y, cellW, cellH);

      // Inner cross — thinner, fainter (the 田 divisions)
      pg.stroke(25, 20, 50, 28);
      pg.strokeWeight(0.4);
      // Horizontal centre
      pg.line(x, y + cellH * 0.5, x + cellW, y + cellH * 0.5);
      // Vertical centre
      pg.line(x + cellW * 0.5, y, x + cellW * 0.5, y + cellH);

      // Faint diagonal guides (some tian zi ge variants include these)
      pg.stroke(25, 15, 50, 14);
      pg.strokeWeight(0.3);
      pg.line(x, y, x + cellW, y + cellH);
      pg.line(x + cellW, y, x, y + cellH);
    }
  }

  // ── Title ──────────────────────────────────────────────────
  pg.noStroke();
  pg.fill(25, 30, 30, 70);
  pg.textFont('monospace');
  pg.textSize(10);
  pg.textAlign(LEFT, TOP);
  pg.text('Rosetta, for one body — ' + year() + '.' + nf(month(),2) + '.' + nf(day(),2), margin, 44);

  // ── Re-draw glyphs centred in each cell ────────────────────
  for (let i = 0; i < min(glyphs.length, cols * rows); i++) {
    let c  = i % cols;
    let r  = floor(i / cols);
    let cx = margin + c * cellW + cellW * 0.5;
    let cy = margin + 60 + r * cellH + cellH * 0.5;

    let g = glyphs[i];
    pg.push();
    pg.translate(cx, cy);

    for (let s of g.strokes) {
      let steps = 14;
      for (let t = 0; t < steps; t++) {
        let pct = t / steps;
        let x   = lerp(s.x1, s.x2, pct);
        let y   = lerp(s.y1, s.y2, pct);
        let sw  = lerp(s.weight, s.weight2, pct);
        pg.stroke(22, 35, 18, 88);
        pg.strokeWeight(sw);
        if (t > 0) {
          let px = lerp(s.x1, s.x2, (t-1)/steps);
          let py = lerp(s.y1, s.y2, (t-1)/steps);
          pg.line(px, py, x, y);
        }
      }
    }
    pg.pop();
  }

  pg.save('rosetta-poem-' + year() + nf(month(),2) + nf(day(),2) + '.png');
}
 
// ─── RESIZE ──────────────────────────────────────────────────────
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Re-home particles to new canvas dimensions
  for (let p of particles) p.reset();
}
 
