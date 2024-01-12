import React from 'react'
import Logo from '../img/Logo.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


const NavBar = ({ showSignUp,showSignIn }) => {
const navigate=useNavigate()
 

const handleRegisterClick=()=>{
   showSignUp()
   navigate('/register')
}
 const handleSignIn=()=>{
  showSignIn()
  
 }
  return (
    <div className='navbar'>
      <div className='container'>
        <div className='logo'>
          <img src={Logo} alt='logo' />
        </div>

        <div className='menu_container'>
          
          <Link className='menu' to='/menu1'>Generative AI</Link>
          <Link className='menu' to='/menu2'>Machine Learning</Link>
          <Link className='menu' to='/menu3'>AI Applications</Link>
          <Link className='menu' to='/menu3'>AI News</Link>
          
        </div>

        <div className='links'>
          <button className='link' onClick={handleSignIn}>
            <h4>Sign In</h4>
          </button>
          <button className="link" onClick={handleRegisterClick}>
            <h4>Sign Up</h4>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
