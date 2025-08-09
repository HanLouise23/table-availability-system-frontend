// app/components/Header.tsx
import React from 'react';

const Header: React.FC = () => (
    <header style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}>'
        <h1 style={{ color: 'red', textAlign:
    'center' }}></h1>
        <img src="../../img/header.png" />
  </header>
);

 export default Header;
