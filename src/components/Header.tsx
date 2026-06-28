import React from 'react';
import '../styles/Header.css';

const Header: React.FC = () => {
  return (
    <header className="header slide-up">
      <div className="header-box">
        <h1 className="header-title">Student Picker</h1>
        <p className="header-subtitle">A warm approach to classroom participation</p>
      </div>
    </header>
  );
};

export default Header;
