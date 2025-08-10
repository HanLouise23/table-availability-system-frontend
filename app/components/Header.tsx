import React from 'react';
import headerImg from '/img/header.png';

const Header: React.FC = () => (
  <header className="header">
    <img src={headerImg} alt="Restaurant Finder" />
  </header>
);

export default Header;
