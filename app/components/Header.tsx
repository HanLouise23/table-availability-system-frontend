import React from 'react';
import leftImg from '/img/left.png';
import headerImg from '/img/header.png';
import rightImg from '/img/right.png';

const Header: React.FC = () => (
  <header className="header">
    <div className="header-images">
      <img src={leftImg} alt="Left decoration" />
      <img src={headerImg} alt="Restaurant Finder" />
      <img src={rightImg} alt="Right decoration" />
    </div>
  </header>
);

export default Header;