
import React from 'react';

interface BasketballLogoProps {
  className?: string;
  size?: number;
}

const BasketballLogo: React.FC<BasketballLogoProps> = ({ className, size = 60 }) => {
  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full bg-basketball-orange">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
        >
          {/* Lines on the basketball */}
          <path
            d="M 50,0 V 100 M 0,50 H 100 M 15,15 Q 50,35 85,85 M 85,15 Q 50,35 15,85"
            stroke="black"
            strokeWidth="2"
            fill="none"
            strokeDasharray="2 3"
          />
        </svg>
      </div>
    </div>
  );
};

export default BasketballLogo;
