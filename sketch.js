// === GLOBALS ===
let stage = -1; // Start at Splash Screen
let totalData = 0; 

// UI & Assets
let video, caveGraphic;
let input, btnMain, btnPay, divInputGroup;
let memories = []; 
let stars = [];    

let prompts = [
  "What is your earliest memory?",
  "Who are you afraid to lose?",
  "Tell me a secret.",
  "What does home feel like?",
  "Who was your first love?",
  "What is your biggest regret?"
];

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // Webcam setup
  video = createCapture(VIDEO);
  video.size(80, 60); 
  video.hide();

  caveGraphic = createGraphics(windowWidth, windowHeight);

  // Input UI
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

  // Pay Button
  btnPay = createButton('PAY $999 TO RESTORE MEMORY');
  btnPay.class("pay-btn"); 
  btnPay.mousePressed(resetSystem);

  // Stars (Matrix Code Rain)
  // Increase count for better effect
  for (let i = 0; i < 150; i++) stars.push(new Star());

  textAlign(CENTER);
  pixelDensity(1);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  caveGraphic = createGraphics(windowWidth, windowHeight);
}

function draw() {
  background(0);

  // === STAGE -1: SPLASH SCREEN ===
  if (stage === -1) {
    // Draw Matrix Rain in background (Green)
    for (let s of stars) { s.move(); s.show(); }

    // Pulsing Title
    let pulse = map(sin(frameCount * 0.05), -1, 1, 150, 255);
    
    fill(100, 255, 100, pulse); // Matrix Green
    noStroke();
    textSize(32);
    textFont('Courier New');
    text("DEAR FUTURE: WE WERE YOUR BETA TEST", width/2, height/2);
    
    textSize(16);
    fill(150);
    text("[ CLICK TO INITIALIZE ]", width/2, height/2 + 60);
  }

  // === STAGE 0: CAVE ===
  else if (stage === 0) {
    if (video.width > 0) {
        drawCaveEffect(video); 
    }
    
    fill(200, 100, 50); 
    noStroke();
    textSize(20);
    text("Era 1: The Stone. Click to imprint.", width/2, height - 180);
  }

  // === STAGE 1: PAPER ===
  else if (stage === 1) {
    background(240); 
    tint(255, 50); 
    image(caveGraphic, 0, 0); 
    
    fill(0);
    noStroke();
    textSize(16);
    for (let m of memories) text(m.text, m.x, m.y); 

    fill(100);
    text("Era 2: The Paper. Data is stable.", width/2, height - 180);
    text(`Written: ${memories.length}/3`, width/2, height - 150);
  }

  // === STAGE 2: CLOUD (Matrix Rain) ===
  else if (stage === 2) {
    background(0, 20); // Dark trail
    
    // Draw Matrix Rain
    for (let s of stars) { s.move(); s.show(); }

    for (let i = memories.length - 1; i >= 0; i--) {
      let m = memories[i];
      m.move(); 
      m.show();
      if (m.lifespan <= 0) memories.splice(i, 1);
    }

    if (totalData > 4) {
       fill(255, 255, 0); 
       textSize(14);
       text("WARNING: STORAGE LIMIT REACHED", width/2, 80);
    }

    if (totalData > 6) {
       if (frameCount % 60 < 30) {
           fill(255, 0, 0);
           textSize(18);
           text("SUBSCRIPTION EXPIRED. DATA CORRUPTION IMMINENT.", width/2, 110);
       }
       btnMain.html("UPLOAD (FAILED)");
       btnMain.style("border", "1px solid red");
       btnMain.style("color", "red");
    }

    if (totalData > 8) stage = 3; 
  }

  // === STAGE 3: PAYWALL ===
  else if (stage === 3) {
    background(255, 0, 0); 
    
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
    
    btnPay.style('display', 'block');
    btnPay.position(windowWidth / 2, windowHeight / 2 + 160);
  }
  
  if (stage !== 3) {
    btnPay.style('display', 'none');
  }
}

// === CONTROLS ===

function mousePressed() {
  // Splash -> Cave
  if (stage === -1) {
      stage = 0;
      return;
  }

  // Cave -> Paper
  if (stage === 0) {
    drawCaveEffect(video, caveGraphic); 
    stage = 1;
    
    divInputGroup.show();
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
  input.attribute('placeholder', random(prompts));
}

function addMemory() {
  let txt = input.value();
  if (txt !== '') {
    memories.push(new MemoryBubble(txt, random(100, width-100), random(100, height-100)));
    input.value('');
    updatePrompt(); 
    totalData++; 

    // Stage 1 -> 2
    if (stage === 1 && memories.length >= 3) {
      stage = 2;
      input.style("color", "#50fa7b");
      input.style("border-bottom", "1px solid #50fa7b");
      input.style("background", "rgba(0,0,0,0.5)");

      btnMain.html("UPLOAD");
      btnMain.style("color", "#50fa7b");
      btnMain.style("border", "1px solid #50fa7b");
      
      for (let m of memories) { m.lifespan = 255; m.y = height; }
    }
  }
}

let isResetting = false;
function resetSystem() {
  if (isResetting) return;
  isResetting = true;
  
  btnPay.style("animation", "none");
  btnPay.style("background", "black");
  btnPay.style("color", "red");
  btnPay.style("border", "2px solid red");
  btnPay.html("ERROR 404: INSUFFICIENT FUNDS");

  setTimeout(() => location.reload(), 2000);
}

// === HELPERS ===

function drawCaveEffect(source, target) {
  let ctx = target || window;
  if (!source || source.width === 0) return;
  source.loadPixels();
  if (source.pixels.length === 0) return;

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
    
    let decayRate = 0;
    if (totalData > 6) decayRate = map(totalData, 6, 10, 0.1, 0.9); 
    else if (stage === 2) decayRate = 0.02; 

    if (random(1) < decayRate) this.glitch();
  }

  show() {
    noStroke();
    if (stage === 1) fill(0); 
    else {
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

// === MODIFIED STAR CLASS (Matrix Rain) ===
class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = random(2, 5); // Faster speed for "rain"
    this.value = round(random(1)); // 0 or 1
    this.size = random(12, 18);
    this.switchInterval = random(10, 30);
  }

  move() {
    // Make them fall DOWN (Rain) or move UP (Upload)
    // Here: Move UP to symbolize uploading data
    this.y -= this.speed; 
    
    // Shake if expired
    if (totalData > 6) {
        this.x += random(-2, 2);
    }

    if (this.y < 0) {
      this.y = height;
      this.x = random(width);
    }
  }

  show() {
    noStroke();
    textSize(this.size);
    
    // Green normally, Red if collapsed
    if (totalData > 6) {
        fill(255, 0, 0, 150);
    } else {
        fill(0, 255, 70, 150); // Matrix Green
    }

    // Switch between 0 and 1
    if (frameCount % int(this.switchInterval) === 0) {
        this.value = round(random(1));
    }

    text(this.value, this.x, this.y);
  }
}