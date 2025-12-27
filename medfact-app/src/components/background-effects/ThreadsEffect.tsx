import React, { useEffect, useRef, useState } from 'react';

interface ThreadsEffectProps {
  density?: number;
  speed?: number;
  color?: string;
}

const ThreadsEffect: React.FC<ThreadsEffectProps> = ({ 
  density = 50, 
  speed = 1, 
  color = '#ffffff' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile for performance optimization
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if we're in a test environment
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Mobile optimization: reduce density by 50% on mobile devices
    const optimizedDensity = isMobile ? Math.floor(density * 0.5) : density;
    const optimizedSpeed = isMobile ? speed * 0.7 : speed;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Threads animation implementation
    // This wrapper would integrate with @react-bits/Threads-JS-CSS library
    const threads: Array<{ 
      x: number; 
      y: number; 
      dx: number; 
      dy: number; 
      opacity: number;
    }> = [];
    
    for (let i = 0; i < optimizedDensity; i++) {
      threads.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * optimizedSpeed,
        dy: (Math.random() - 0.5) * optimizedSpeed,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Use requestAnimationFrame for smooth animation
      threads.forEach((thread, i) => {
        thread.x += thread.dx;
        thread.y += thread.dy;

        // Wrap around edges
        if (thread.x < 0) thread.x = canvas.width;
        if (thread.x > canvas.width) thread.x = 0;
        if (thread.y < 0) thread.y = canvas.height;
        if (thread.y > canvas.height) thread.y = 0;

        // Draw connections to nearby threads
        threads.forEach((otherThread, j) => {
          if (i !== j) {
            const distance = Math.sqrt(
              Math.pow(thread.x - otherThread.x, 2) + 
              Math.pow(thread.y - otherThread.y, 2)
            );
            
            const maxDistance = isMobile ? 80 : 120;
            if (distance < maxDistance) {
              const opacity = (1 - distance / maxDistance) * thread.opacity;
              ctx.strokeStyle = color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
              ctx.lineWidth = isMobile ? 0.5 : 1;
              ctx.beginPath();
              ctx.moveTo(thread.x, thread.y);
              ctx.lineTo(otherThread.x, otherThread.y);
              ctx.stroke();
            }
          }
        });

        // Draw thread points
        ctx.beginPath();
        ctx.arc(thread.x, thread.y, isMobile ? 1 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = color + Math.floor(thread.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [density, speed, color, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
};

export default ThreadsEffect;