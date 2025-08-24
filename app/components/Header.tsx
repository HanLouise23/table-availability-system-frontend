import React from 'react';
import leftImg from '/img/left.png';
import rightImg from '/img/right.png';

const Header: React.FC = () => (
  <header className="header-banner">
    <img src={leftImg} alt="" aria-hidden="true" className="banner-img" />
    <div className="banner-text">Table Availability System</div>
    <img src={rightImg} alt="" aria-hidden="true" className="banner-img" />
  </header>
);

export default Header;
