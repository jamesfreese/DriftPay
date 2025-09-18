
import React, { useEffect, useState } from 'react';

const StarryBackground = () => {
  const [stars, setStars] = useState<React.CSSProperties[]>([]);
  const [shootingStars, setShootingStars] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    // Drifting stars
    const generateStars = () => {
      const newStars = Array.from({ length: 50 }).map(() => {
        const size = Math.random() * 2 + 1; // 1px to 3px
        const duration = Math.random() * 20 + 15; // 15s to 35s
        const rotation = (Math.random() - 0.5) * 90; // -45 to 45 degrees
        return {
          left: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationName: 'drift-up',
          animationDuration: `${duration}s`,
          animationDelay: `${Math.random() * duration}s`,
          '--rotation': `${rotation}deg`,
        } as React.CSSProperties;
      });
      setStars(newStars);
    };

    // Shooting stars
    const generateShootingStars = () => {
      const newShootingStars = Array.from({ length: 10 }).map(() => {
        const animDuration = Math.random() * 2 + 3; // 3s to 5s
        return {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          '--angle': `${Math.random() * 360}deg`,
          animationDuration: `${animDuration}s, ${animDuration}s`,
          animationDelay: `${Math.random() * 10}s`,
        } as React.CSSProperties;
      });
      setShootingStars(newShootingStars);
    };

    generateStars();
    generateShootingStars();
  }, []);

  return (
    <div className="starry-background">
      {stars.map((style, index) => (
        <div key={`star-${index}`} className="star" style={style}></div>
      ))}
      {shootingStars.map((style, index) => (
        <div key={`shooting-star-${index}`} className="shooting-star" style={style}></div>
      ))}
    </div>
  );
};

export default StarryBackground;
