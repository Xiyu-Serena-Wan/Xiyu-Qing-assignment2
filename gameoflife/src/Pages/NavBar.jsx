import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div>
      <div className="navbar">
        <div className="links">
          <Link to="/Homepage">Go to HomePage</Link>
          <Link to="/">Game</Link>
          <Link to="/TeamAndLink">Find TeamAndLink</Link>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
