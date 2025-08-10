import React from 'react';
import headerImg from '/img/header.png';

const Header: React.FC = () => (
  <header style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  }}>
    <img src={headerImg} alt="Spare Seat" />
  </header>
);

export default Header;
