import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <div className="header slide-up">
      <div className="header-box">
        <h1 className="header-title">
          🎓 Student Picker
        </h1>
      </div>
      <p className="header-subtitle">A warm approach to classroom participation</p>
    </div>
  );
};

export default Header;
