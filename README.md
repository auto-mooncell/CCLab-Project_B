# Dear Future: We Were Your Beta Test

> "Memory lies in your mind as a vague matter. When you try to remember, and even try to fix it, memory increases its speed of decaying."

**[View Live Demo]https://auto-mooncell.github.io/CCLab-Project_B/**

## 📖 About The Project

**Dear Future: We Were Your Beta Test** is an interactive net art piece exploring the fragility of digital history. It critiques our reliance on digital storage, suggesting that the more we optimize and upload our memories, the faster they decay into entropy.

The project takes the user on a linear journey through three eras of memory technology: from the tactile permanence of stone to the illusion of stability in paper, and finally to the chaotic, ephemeral nature of the cloud.

## 🎮 The Experience (Stages)

The experience is divided into sequential stages, controlled by a finite state machine:

1.  **Splash Screen:** A pulsing terminal entry point.
2.  **Era 1: The Stone (The Cave):** * Uses webcam pixel manipulation to render the user's reflection as an abstract, prehistoric rock painting.
    * *Interaction:* Click to imprint your physical form.
3.  **Era 2: The Paper (Stability):** * A clean, static interface where memories are written and stored safely.
    * *Interaction:* Type and save 3 memories to advance.
4.  **Era 3: The Cloud (Entropy):** * The visual style shifts to a "Matrix-style" data stream.
    * **The Decay System:** As you upload more data, the system becomes unstable. Memories begin to float, drift, and glitch.
    * *Climax:* Once the storage limit is reached, the system collapses into a paywall, locking the user out of their own past.

## 💻 Technical Highlights

Built with **p5.js**, this project features several custom technical implementations:

### 1. Gradual Entropy System
Instead of random chaos, the glitch effect is tied to user input. The variable `totalData` tracks interaction. As it increases, it drives the `decayRate` in the `MemoryBubble` class.

```javascript
// Inside MemoryBubble.move()
let decayRate = 0;
if (totalData > 6) {
    // Map data count to glitch probability (5% -> 80%)
    decayRate = map(totalData, 6, 10, 0.05, 0.8); 
}
if (random(1) < decayRate) this.glitch();
```

### 2. Matrix Code Rain
A custom particle system (`Star` class) that renders falling/rising streams of binary code (`0` and `1`). These particles react to the system's state—turning from neon green to warning red when the "system collapse" is imminent.

### 3. Pixel Manipulation
For the "Cave" effect, I directly manipulated the `video.pixels[]` array to create a mosaic/threshold effect, optimizing performance for full-screen rendering without relying on heavy filter functions.

## 🛠️ Installation & Setup

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```
2.  **Open the project**
    * Simply open `index.html` in your browser.
    * *Recommended:* Use "Live Server" in VS Code to avoid local CORS issues with the webcam.

## ⌨️ Controls

* **Mouse Click:** Interact / Advance stages.
* **Keyboard:** Type to input memories.
* **Enter:** Save memory.
* **'T' Key (Dev Mode):** Fast-forward through stages for testing purposes.

## 📚 Credits & References

* **Library:** [p5.js](https://p5js.org/)
* **Inspiration:** Concepts of digital entropy and *The Matrix* visual aesthetics.
* **Course:** Creative Coding Lab, Fall 2025.
---
*Created by Auto Mooncell
