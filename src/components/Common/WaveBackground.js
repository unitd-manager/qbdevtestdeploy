"use client";
import { useEffect } from "react";

const WaveBackground = () => {
  useEffect(() => {
    let isPlaying = true;
    let currentSpeed = "normal";

 const generateDots  = () =>{
            const grid = document.getElementById('dotsGrid');
            const isMobile = window.innerWidth < 768;
            const cols = isMobile ? 30 : 50;
            const rows = isMobile ? 25 : 35;
            
            // Clear existing dots
            grid.innerHTML = '';
            
            for (let y = 0; y < rows; y++) {
                for (let x = 0; x < cols; x++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    
                    // Calculate diagonal wave delay - creates the wave pattern
                    const delay = (x + y) * 0.03; // Diagonal wave timing
                    dot.style.setProperty('--delay', `${delay}s`);
                    
                    grid.appendChild(dot);
                }
            }
        }

    generateDots();

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        generateDots();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    // Smooth scroll for anchor links
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(anchor => {
      anchor.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      anchors.forEach(anchor =>
        anchor.removeEventListener("click", () => {})
      );
    };
  }, []);

  return (
    <div className="wave-background">
      <div className="dots-grid" id="dotsGrid"></div>
    </div>
  );
};

export default WaveBackground;
