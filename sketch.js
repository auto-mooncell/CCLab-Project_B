let memories = [];
let input, btn;
let stars = [];
let video;
let osc; 
let audioStarted = false;

// 【核心修改 1】: 引入“不可逆”的计数器
// totalData 记录你一共上传了多少次数据，它只会增加，不会减少
// 这意味着系统的崩坏是永久的
let totalData = 0; 

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  // 1. 摄像头
  video = createCapture(VIDEO);
  video.size(800, 500); 
  video.hide();

  // 2. 声音
  osc = new p5.Oscillator('sawtooth'); // 改用 'sawtooth' (锯齿波)，声音更刺耳、更像故障
  osc.amp(0);

  // 3. UI
  input = createInput();
  input.parent("p5-canvas-container");
  input.size(300);
  input.attribute("placeholder", "Feed the system..."); // 文案改得更黑暗一点
  input.class("my-input");

  btn = createButton('UPLOAD DATA');
  btn.parent("p5-canvas-container");
  btn.mousePressed(addMemory);
  btn.class("my-btn");

  // 4. 背景星尘
  for (let i = 0; i < 50; i++) {
    stars.push(new Star());
  }

  textAlign(CENTER);
  textSize(18);
  pixelDensity(1); // 保证性能
}

function draw() {
  background(0);

  // === 阶段控制逻辑 ===
  // 使用 totalData (累计数据) 而不是 memories.length
  // 0-5: 安全区
  // 5-15: 马赛克化
  // 15+: 彻底破碎 (Shattered)
  let chaosLevel = totalData; 

  // 计算马赛克大小 (Step)
  let step = map(chaosLevel, 0, 20, 1, 50);
  step = floor(constrain(step, 1, 60));

  // --- 阶段一：镜像 (chaos < 5) ---
  if (chaosLevel < 5) {
    tint(100, 100, 255, 80); // 幽灵蓝
    image(video, 0, 0, width, height);
  } 
  // --- 阶段二 & 三：崩坏 (chaos >= 5) ---
  else {
    video.loadPixels();
    noStroke();
    
    // 遍历像素
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        
        // 计算像素索引 [Week 11 知识点]
        let index = (x + y * video.width) * 4;
        
        let r = video.pixels[index];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];

        // 【核心修改 2】: 破碎效果 (Shatter)
        // 如果 chaosLevel 很高 (>15)，方块位置开始随机抖动
        let xOffset = 0;
        let yOffset = 0;
        
        if (chaosLevel > 15) {
          // 抖动幅度随 chaos 增加
          let shake = (chaosLevel - 15) * 2; 
          xOffset = random(-shake, shake);
          yOffset = random(-shake, shake);
          
          // 颜色失真 (RGB Split): 红色通道增强，制造恐惧感
          r += 50; 
        }

        // 绘制方块 (带偏移)
        fill(r, g, b + 50, 100); // 保持幽灵蓝底色
        rect(x + xOffset, y + yOffset, step, step);
      }
    }
  }

  // 暗色遮罩
  noStroke();
  fill(10, 10, 20, 120);
  rect(0, 0, width, height);

  // --- 声音控制 ---
  if (audioStarted) {
    // 声音随 chaos 变得极其尖锐和混乱
    // 频率从 100Hz 飙升到 1000Hz
    let targetFreq = map(chaosLevel, 0, 30, 100, 1000);
    // 加一点随机噪点，让声音听起来“坏掉了”
    if (chaosLevel > 15) targetFreq += random(-100, 100);
    
    osc.freq(targetFreq, 0.1);
    
    let amp = map(sin(frameCount * 0.2), -1, 1, 0.1, 0.2);
    osc.amp(amp, 0.1);
  }

  noTint(); 
  
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
 
  fill(0, 255, 0);
  textSize(12);
  textAlign(RIGHT);
  text("SYSTEM ENTROPY: " + floor(totalData * 5) + "%", width - 20, height - 20);
  textAlign(CENTER); // 还原
}

function keyPressed() {
  if (keyCode === ENTER) {
    addMemory();
  }
}

function addMemory() {
  if (!audioStarted) {
    userStartAudio();
    osc.start();
    osc.amp(0.2, 0.5);
    audioStarted = true;
  }

  let txt = input.value();
  if (txt !== '') {
    totalData += 1; 
    
    memories.push(new MemoryBubble(txt, random(100, width - 100), height - 50));
    input.value('');
  }
}

// ================= Classes =================
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
    

    let chaosChance = map(totalData, 0, 30, 0.01, 0.5);
    
    if (random(1) < chaosChance) {
        this.glitch();
    }
  }
  show() {
    noStroke();
    fill(200, 255, 200, this.lifespan);
    textSize(18);
    text(this.text, this.x, this.y);
  }
  glitch() {
    let chars = "$%#@&?!_~";
    let newText = "";
    for (let i = 0; i < this.text.length; i++) {
      if (random(1) < 0.3) { /
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
    if (totalData > 15) {
        this.x += random(-1, 1);
    }
    
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