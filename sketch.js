// === GLOBALS ===
let stage = 0; // 0: Cave, 1: Paper, 2: Cloud, 3: Paywall
let totalData = 0; // Tracks input count to drive decay

// Assets & UI
let video, caveGraphic;
let input, btnMain, btnPay, divInputGroup;
let memories = []; 
let stars = [];    

// Prompts to guide user input
let prompts = [
  "What is your earliest memory?",
  "Who are you afraid to lose?",
  "Tell me a secret you've never told.",
  "What does home feel like?",
  "Who was your first love?",
  "What is your biggest regret?"
];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // 1. Webcam (hidden, used for pixel effect)
  video = createCapture(VIDEO);
  video.size(80, 60); 
  video.hide();

  caveGraphic = createGraphics(windowWidth, windowHeight);

  // 2. UI Setup
  divInputGroup = createDiv('');
  divInputGroup.class('input-group');
  divInputGroup.hide(); 

  input = createInput();
  input.parent(divInputGroup);
  input.class("my-input"); 
  updatePrompt(); 

  btnMain = createButton('SAVE');
  btnMain.parent(divInputGroup);
  btnMain.mousePressed(addMemory);
  btnMain.class("my-btn");

  btnPay = createButton('PAY $999 TO RESTORE MEMORY');
  // Center the pay button manually
  btnPay.position(windowWidth/2 - 150, windowHeight/2 + 50); 
  btnPay.mousePressed(resetSystem);
  btnPay.class("pay-btn");
  btnPay.hide();

  // 3. Stars for background
  for (let i = 0; i < 80; i++) stars.push(new Star());

  textAlign(CENTER);
  pixelDensity(1);
}

// Handle window resize for full screen
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  caveGraphic = createGraphics(windowWidth, windowHeight);
  btnPay.position(windowWidth/2 - 150, windowHeight/2 + 50);
}

function draw() {
  background(0);

  // === STAGE 0: CAVE ===
  if (stage === 0) {
    drawCaveEffect(video); 
    fill(200, 100, 50); 
    noStroke();
    textSize(20);
    text("Era 1: The Stone. Click to imprint.", width/2, height - 120);
  }

  // === STAGE 1: PAPER ===
  else if (stage === 1) {
    background(240); 
    tint(255, 50); 
    image(caveGraphic, 0, 0); // Faint background trace
    
    fill(0);
    noStroke();
    textSize(16);
    for (let m of memories) text(m.text, m.x, m.y); 

    fill(100);
    text("Era 2: The Paper. Data is stable.", width/2, height - 120);
    text(`Written: ${memories.length}/3`, width/2, height - 90);
  }

  // === STAGE 2: CLOUD / DECAY ===
  else if (stage === 2) {
    background(20, 20, 30, 50); 
    
    noTint();
    for (let s of stars) { s.move(); s.show(); }

    // Render memories
    for (let i = memories.length - 1; i >= 0; i--) {
      let m = memories[i];
      m.move(); 
      m.show();
      if (m.lifespan <= 0) memories.splice(i, 1);
    }

    // Decay Thresholds
    if (totalData > 4) {
       fill(255, 255, 0); 
       textSize(14);
       text("WARNING: STORAGE LIMIT REACHED", width/2, 80);
    }

    if (totalData > 6) {
       // Flashing alert
       if (frameCount % 60 < 30) {
           fill(255, 0, 0);
           textSize(18);
           text("SUBSCRIPTION EXPIRED. DATA CORRUPTION IMMINENT.", width/2, 110);
       }
       // UI Failure
       btnMain.html("UPLOAD (FAILED)");
       btnMain.style("border", "1px solid red");
       btnMain.style("color", "red");
    }

    // Trigger Crash
    if (totalData > 8) stage = 3; 
  }

  // === STAGE 3: PAYWALL ===
  else if (stage === 3) {
    background(255, 0, 0); 
    // Matrix rain effect
    for (let i=0; i<50; i++) {
      fill(0, 50);
      text(char(random(33, 126)), random(width), random(height));
    }

    fill(0);
    rectMode(CENTER);
    rect(width/2, height/2, 500, 250);
    fill(255);
    textSize(30);
    text("SYSTEM FAILURE", width/2, height/2 - 30);
    textSize(16);
    text("Your memories have been deleted.", width/2, height/2 + 20);
    
    divInputGroup.hide();
    btnPay.show();
  }
}

// === INTERACTION ===

function mousePressed() {
  // Advance from Cave to Paper
  if (stage === 0) {
    drawCaveEffect(video, caveGraphic); // Save snapshot
    stage = 1;
    
    divInputGroup.show();
    // Styling for "Paper" mode
    input.style("color", "black");
    input.style("border-bottom", "2px solid black");
    input.style("background", "rgba(255,255,255,0.8)");
    
    btnMain.html("WRITE");
    btnMain.style("color", "black");
    btnMain.style("border", "1px solid black");
    
    setTimeout(() => input.elt.focus(), 100);
  }
}

function keyPressed() {
  if (keyCode === ENTER && (stage === 1 || stage === 2)) {
    addMemory();
  }
}

function updatePrompt() {
  let p = random(prompts);
  input.attribute('placeholder', p);
}

function addMemory() {
  let txt = input.value();
  if (txt !== '') {
    memories.push(new MemoryBubble(txt, random(100, width-100), random(100, height-100)));
    input.value('');
    updatePrompt(); 
    
    totalData++; 

    // Transition Stage 1 -> 2
    if (stage === 1 && memories.length >= 3) {
      stage = 2;
      // Styling for "Cyber" mode
      input.style("color", "#50fa7b");
      input.style("border-bottom", "1px solid #50fa7b");
      input.style("background", "rgba(0,0,0,0.5)");

      btnMain.html("UPLOAD");
      btnMain.style("color", "#50fa7b");
      btnMain.style("border", "1px solid #50fa7b");
      
      // Make memories float
      for (let m of memories) { m.lifespan = 255; m.y = height; }
    }
  }
}

function resetSystem() {
  memories = [];
  alert("Error 404: Cash not found.");
  location.reload(); 
}

// === HELPERS ===

// Pixelate effect for cave stage
function drawCaveEffect(source, target) {
  let ctx = target || window;
  source.loadPixels();
  ctx.noStroke();
  let w = width / source.width;
  let h = height / source.height;

  for (let y = 0; y < source.height; y++) {
    for (let x = 0; x < source.width; x++) {
      let index = (x + y * source.width) * 4;
      let r = source.pixels[index];
      let bright = (r + source.pixels[index+1] + source.pixels[index+2])/3;
      if (bright < 100) {
        ctx.fill(150, 80, 40, 200); 
        ctx.rect(x * w, y * h, w + 1, h + 1); 
      }
    }
  }
}

class MemoryBubble {
  constructor(text, x, y) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.lifespan = 255;
    this.xOffset = random(1000);
  }

  move() {
    this.y -= 1.5; 
    this.lifespan -= 1.0; 
    this.x += sin(frameCount * 0.05 + this.xOffset);
    
    // Glitch Probability
    let decayRate = 0;
    if (totalData > 6) decayRate = map(totalData, 6, 10, 0.1, 0.9); 
    else if (stage === 2) decayRate = 0.02; 

    if (random(1) < decayRate) this.glitch();
  }

  show() {
    noStroke();
    if (stage === 1) fill(0); 
    else {
        // Red if corrupted, Green if safe
        if (totalData > 6) fill(255, 50, 50, this.lifespan);
        else fill(100, 255, 100, this.lifespan);
    }
    textSize(20); 
    text(this.text, this.x, this.y);
  }

  glitch() {
    let chars = "$%#@&?!";
    let newText = "";
    for (let i = 0; i < this.text.length; i++) {
      let intensity = map(totalData, 4, 10, 0.1, 0.9); 
      if (random(1) < intensity) newText += chars.charAt(int(random(chars.length)));
      else newText += this.text.charAt(i);
    }
    this.text = newText;
  }
}

class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.speed = random(0.5, 2);
  }
  move() {
    this.y -= this.speed;
    if (totalData > 6) this.x += random(-2, 2); // Shake on corruption
    if (this.y < 0) {
      this.y = height;
      this.x = random(width);
    }
  }
  show() {
    fill(255, random(100, 255));
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}