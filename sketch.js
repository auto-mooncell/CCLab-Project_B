let memories = [];
let input, btn;
let stars = []; 

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");


  input = createInput();
  input.parent("p5-canvas-container"); 
  input.size(300);
  input.attribute("placeholder", "Input data to the void...");
  input.class("my-input"); 

  btn = createButton('UPLOAD');
  btn.parent("p5-canvas-container");
  btn.mousePressed(addMemory);
  btn.class("my-btn");

  for (let i = 0; i < 50; i++) {
    stars.push(new Star());
  }

  textAlign(CENTER);
  textSize(18);
}

function draw() {
  background(20, 20, 30, 200); 

  for (let s of stars) {
    s.move();
    s.show();
  }

  for (let i = memories.length - 1; i >= 0; i--) {
    let m = memories[i];
    m.move();
    m.show();

    if (m.lifespan <= 0) {
      memories.splice(i, 1);
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    addMemory();
  }
}

function addMemory() {
  let txt = input.value();
  if (txt !== '') {
    memories.push(new MemoryBubble(txt, random(100, width - 100), height - 50));
    input.value('');
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
    this.y -= 1.2; 
    this.lifespan -= 0.8; 

    this.x += sin(frameCount * 0.05 + this.xOffset) * 0.5;

    if (this.lifespan < 150) { 
      if (random(1) < 0.1) {
        this.glitch();
      }
    }
  }

  show() {
    noStroke();
    fill(200, 255, 200, this.lifespan);
    text(this.text, this.x, this.y);
  }

  glitch() {
    let chars = "$%#@&?!_~"; 
    let newText = "";
    
    for (let i = 0; i < this.text.length; i++) {
      if (random(1) < 0.2) {
        let r = int(random(chars.length));
        newText += chars.charAt(r);
      } else {
        newText += this.text.charAt(i);
      }
    }
    this.text = newText;
  }
}


class Star {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(1, 3);
    this.speed = random(0.2, 1);
    this.brightness = random(100, 255);
  }

  move() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.y = height;
      this.x = random(width);
    }
  }

  show() {
    fill(255, this.brightness);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}