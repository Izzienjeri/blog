import React from 'react'
import Logo from '../img/Logo.png'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <div className='navbar'>
      <div className='container'>
        <div className='logo'>
          <img src={Logo} alt='logo' />
        </div>

        <div className='menu_container'>
          <Link className='menu' to='/menu1'>Menu 1</Link>
          <Link className='menu' to='/menu2'>Menu 2</Link>
          <Link className='menu' to='/menu3'>Menu 3</Link>
        </div>

        <div className='links'>
          <button className='link' onClick={() => console.log("Sign In clicked")}>
            <h4>Sign In</h4>
          </button>
          <button className='link' onClick={() => console.log("Sign Up clicked")}>
            <h4>Sign Up</h4>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
