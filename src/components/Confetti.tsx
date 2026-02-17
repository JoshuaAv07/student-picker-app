import React from 'react';

interface ConfettiProps {
  show: boolean;
}

const Confetti: React.FC<ConfettiProps> = ({ show }) => {
  if (!show) return null;

  const colors = ['#800000', '#d4af37', '#cd853f', '#b8860b', '#daa520'];
  
  return (
    <>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 0.6}s`,
            background: colors[Math.floor(Math.random() * colors.length)],
            width: `${Math.random() * 15 + 5}px`,
            height: `${Math.random() * 15 + 5}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </>
  );
};

export default Confetti;
