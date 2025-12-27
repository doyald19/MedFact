import React, { useEffect, useRef, useState } from 'react';

interface GalaxyEffectProps {
  particleCount?: number;
  interactive?: boolean;
  mouseInfluence?: number;
}

const GalaxyEffect: React.FC<GalaxyEffectProps> = ({ 
  particleCount = 100, 
  interactive = true, 
  mouseInfluence = 50 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
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

    // Mobile optimization: reduce particle count by 50% on mobile devices
    const optimizedParticleCount = isMobile ? Math.floor(particleCount * 0.5) : particleCount;
    const optimizedMouseInfluence = isMobile ? mouseInfluence * 0.7 : mouseInfluence;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse tracking for interactivity (disabled on mobile for performance)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
      }
    };

    if (interactive && !isMobile) {
      window.addEventListener('mousemove', handleMouseMove);
    } else if (interactive && isMobile) {
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
    }

    // Galaxy animation implementation
    // This wrapper would integrate with @react-bits/Galaxy-JS-CSS library
    const particles: Array<{ 
      x: number; 
      y: number; 
      dx: number; 
      dy: number; 
      size: number; 
      opacity: number;
      baseX: number;
      baseY: number;
      twinkleSpeed: number;
    }> = [];
    
    for (let i = 0; i < optimizedParticleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        dx: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        dy: (Math.random() - 0.5) * (isMobile ? 0.3 : 0.5),
        size: Math.random() * (isMobile ? 1.5 : 2) + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Mouse/touch interaction
        if (interactive) {
          const mouseDistance = Math.sqrt(
            Math.pow(mouseRef.current.x - particle.x, 2) + 
            Math.pow(mouseRef.current.y - particle.y, 2)
          );
          
          if (mouseDistance < optimizedMouseInfluence) {
            const force = (optimizedMouseInfluence - mouseDistance) / optimizedMouseInfluence;
            const angle = Math.atan2(
              particle.y - mouseRef.current.y, 
              particle.x - mouseRef.current.x
            );
            const pushForce = force * (isMobile ? 1.5 : 2);
            particle.x += Math.cos(angle) * pushForce;
            particle.y += Math.sin(angle) * pushForce;
          } else {
            // Return to base position gradually
            particle.x += (particle.baseX - particle.x) * 0.01;
            particle.y += (particle.baseY - particle.y) * 0.01;
          }
        }

        // Normal movement
        particle.x += particle.dx;
        particle.y += particle.dy;

        // Wrap around edges
        if (particle.x < 0) {
          particle.x = canvas.width;
          particle.baseX = canvas.width;
        }
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.baseX = 0;
        }
        if (particle.y < 0) {
          particle.y = canvas.height;
          particle.baseY = canvas.height;
        }
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.baseY = 0;
        }

        // Twinkling effect
        particle.opacity += (Math.random() - 0.5) * particle.twinkleSpeed;
        particle.opacity = Math.max(0.1, Math.min(0.9, particle.opacity));

        // Draw particle with glow effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${particle.opacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${particle.opacity * 0.5})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Add small bright center
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(particle.opacity * 1.5, 1)})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive && !isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      } else if (interactive && isMobile) {
        window.removeEventListener('touchmove', handleTouchMove);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, interactive, mouseInfluence, isMobile]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
      aria-hidden="true"
    />
  );
};

export default GalaxyEffect;