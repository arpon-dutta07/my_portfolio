import { useEffect, useRef } from "react";

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 };
    this.vel = { x: 0, y: 0 };
    this.acc = { x: 0, y: 0 };
    this.target = { x: 0, y: 0 };

    this.closeEnoughTarget = 100;
    this.maxSpeed = 1.0;
    this.maxForce = 0.1;
    this.particleSize = 10;
    this.isKilled = false;

    this.startColor = { r: 0, g: 0, b: 0 };
    this.targetColor = { r: 0, g: 0, b: 0 };
    this.colorWeight = 0;
    this.colorBlendRate = 0.01;
  }

  move() {
    // Check if particle is close enough to its target to slow down
    let proximityMult = 1;
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) + Math.pow(this.pos.y - this.target.y, 2)
    );

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    // Add force towards target
    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y);
    if (magnitude > 0) {
      towardsTarget.x = (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y = (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    // Move particle
    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx, drawAsPoints) {
    // Blend towards target color
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    // Calculate current color
    const currentColor = {
      r: Math.round(this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight),
      g: Math.round(this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight),
      b: Math.round(this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight),
    };

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width, height) {
    if (!this.isKilled) {
      // Set target outside the scene
      const randomPos = this.generateRandomPos(width / 2, height / 2, (width + height) / 2);
      this.target.x = randomPos.x;
      this.target.y = randomPos.y;

      // Begin blending color to black
      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;

      this.isKilled = true;
    }
  }

  generateRandomPos(x, y, mag) {
    const randomX = Math.random() * 800;
    const randomY = Math.random() * 400;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  }
}

const DEFAULT_WORDS = ["CODE", "DESIGN", "CAPTURE", "CREATE", "INNOVATE"];

export default function ParticleTextEffect({ words = DEFAULT_WORDS }) {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const particlesRef = useRef([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, isPressed: false, isRightClick: false });
  const rainbowTimeRef = useRef(0);

  const pixelSteps = 6;
  const drawAsPoints = true;

  const generateRandomPos = (x, y, mag) => {
    const randomX = Math.random() * 1000;
    const randomY = Math.random() * 500;

    const direction = {
      x: randomX - x,
      y: randomY - y,
    };

    const magnitude = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    if (magnitude > 0) {
      direction.x = (direction.x / magnitude) * mag;
      direction.y = (direction.y / magnitude) * mag;
    }

    return {
      x: x + direction.x,
      y: y + direction.y,
    };
  };

  // Function to create rainbow HSL color
  const getRainbowColor = (time, offset = 0) => {
    const hue = ((time * 50 + offset * 60) % 360);
    return `hsl(${hue}, 100%, 50%)`;
  };

  const nextWord = (word, canvas) => {
    // Create off-screen canvas for text rendering
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d");

    // Draw text
    offscreenCtx.fillStyle = "white";
    offscreenCtx.font = "bold 100px Arial";
    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2);

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;

    // Generate new color
    const newColor = {
      r: Math.random() * 255,
      g: Math.random() * 255,
      b: Math.random() * 255,
    };

    const particles = particlesRef.current;
    let particleIndex = 0;

    // Collect coordinates
    const coordsIndexes = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i);
    }

    // Shuffle coordinates for fluid motion
    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]];
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex;
      const alpha = pixels[pixelIndex + 3];

      if (alpha > 0) {
        const x = (pixelIndex / 4) % canvas.width;
        const y = Math.floor(pixelIndex / 4 / canvas.width);

        let particle;

        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();

          const randomPos = generateRandomPos(canvas.width / 2, canvas.height / 2, (canvas.width + canvas.height) / 2);
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;

          particle.maxSpeed = Math.random() * 6 + 4;
          particle.maxForce = particle.maxSpeed * 0.05;
          particle.particleSize = Math.random() * 6 + 6;
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;

          particles.push(particle);
        }

        // Set color transition
        particle.startColor = {
          r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
          g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
          b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
        };
        particle.targetColor = newColor;
        particle.colorWeight = 0;

        particle.target.x = x;
        particle.target.y = y;
      }
    }

    // Kill remaining particles
    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const particles = particlesRef.current;

    // Update rainbow time
    rainbowTimeRef.current += 0.02;

    // Background with motion blur
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.move();
      particle.draw(ctx, drawAsPoints);

      // Remove dead particles that are out of bounds
      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1);
        }
      }
    }

    // Handle mouse interaction
    if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
      particles.forEach((particle) => {
        const distance = Math.sqrt(
          Math.pow(particle.pos.x - mouseRef.current.x, 2) + Math.pow(particle.pos.y - mouseRef.current.y, 2),
        );
        if (distance < 50) {
          particle.kill(canvas.width, canvas.height);
        }
      });
    }

    // Auto-advance words
    frameCountRef.current++;
    if (frameCountRef.current % 240 === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
      nextWord(words[wordIndexRef.current], canvas);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 800;
    canvas.height = 400;

    // Initialize with first word
    nextWord(words[0], canvas);

    // Start animation
    animate();

    // Mouse event handlers
    const handleMouseDown = (e) => {
      mouseRef.current.isPressed = true;
      mouseRef.current.isRightClick = e.button === 2;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("contextmenu", handleContextMenu);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div 
        className="relative"
        style={{
          background: `conic-gradient(
            from ${rainbowTimeRef.current * 100}deg,
            #ff0000 0deg,
            #ff8800 60deg,
            #ffff00 120deg,
            #88ff00 180deg,
            #00ff00 240deg,
            #00ff88 300deg,
            #00ffff 360deg,
            #0088ff 420deg,
            #0000ff 480deg,
            #8800ff 540deg,
            #ff00ff 600deg,
            #ff0088 660deg,
            #ff0000 720deg
          )`,
          padding: '4px',
          borderRadius: '12px',
          animation: 'rainbow-rotate 3s linear infinite'
        }}
      >
        <style jsx>{`
          @keyframes rainbow-rotate {
            0% { 
              background: conic-gradient(
                from 0deg,
                #ff0000 0deg,
                #ff8800 60deg,
                #ffff00 120deg,
                #88ff00 180deg,
                #00ff00 240deg,
                #00ff88 300deg,
                #00ffff 360deg
              );
            }
            25% { 
              background: conic-gradient(
                from 90deg,
                #ff0000 0deg,
                #ff8800 60deg,
                #ffff00 120deg,
                #88ff00 180deg,
                #00ff00 240deg,
                #00ff88 300deg,
                #00ffff 360deg
              );
            }
            50% { 
              background: conic-gradient(
                from 180deg,
                #ff0000 0deg,
                #ff8800 60deg,
                #ffff00 120deg,
                #88ff00 180deg,
                #00ff00 240deg,
                #00ff88 300deg,
                #00ffff 360deg
              );
            }
            75% { 
              background: conic-gradient(
                from 270deg,
                #ff0000 0deg,
                #ff8800 60deg,
                #ffff00 120deg,
                #88ff00 180deg,
                #00ff00 240deg,
                #00ff88 300deg,
                #00ffff 360deg
              );
            }
            100% { 
              background: conic-gradient(
                from 360deg,
                #ff0000 0deg,
                #ff8800 60deg,
                #ffff00 120deg,
                #88ff00 180deg,
                #00ff00 240deg,
                #00ff88 300deg,
                #00ffff 360deg
              );
            }
          }
          
          @keyframes rainbow-glow {
            0% { 
              box-shadow: 
                0 0 20px #ff0000,
                0 0 40px #ff0000,
                0 0 60px #ff0000;
            }
            16.67% { 
              box-shadow: 
                0 0 20px #ffff00,
                0 0 40px #ffff00,
                0 0 60px #ffff00;
            }
            33.33% { 
              box-shadow: 
                0 0 20px #00ff00,
                0 0 40px #00ff00,
                0 0 60px #00ff00;
            }
            50% { 
              box-shadow: 
                0 0 20px #00ffff,
                0 0 40px #00ffff,
                0 0 60px #00ffff;
            }
            66.67% { 
              box-shadow: 
                0 0 20px #0000ff,
                0 0 40px #0000ff,
                0 0 60px #0000ff;
            }
            83.33% { 
              box-shadow: 
                0 0 20px #ff00ff,
                0 0 40px #ff00ff,
                0 0 60px #ff00ff;
            }
            100% { 
              box-shadow: 
                0 0 20px #ff0000,
                0 0 40px #ff0000,
                0 0 60px #ff0000;
            }
          }
        `}</style>
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-2xl bg-black"
          style={{ 
            maxWidth: "100%", 
            height: "auto",
            animation: 'rainbow-glow 2s ease-in-out infinite',
          }}
        />
      </div>
      <div className="mt-4 text-white text-sm text-center max-w-md">
        <p className="mb-2"></p>
        <p className="text-gray-400 text-xs">
          Right-click and hold while moving mouse to destroy particles • Words change automatically every 4 seconds
        </p>
      </div>
    </div>
  );
}