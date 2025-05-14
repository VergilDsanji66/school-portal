import React from 'react';
import { Roles } from "../../assets/assets"; 
import './Navbar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


const Navbar = ({ id }) => {
  // Get the role based on the id prop
  const role = Roles.find(r => r.id === id);
  const navigate = useNavigate();

  return (
    <div className="navbar">
      <h1>
        {role?.name || 'Unknown'}
      </h1>
      <div className="right">
        <FontAwesomeIcon className='icon' icon={faRightFromBracket} onClick={() => {navigate('/LoginPage');}} />
      </div>
    </div>
  );
};

export default Navbar;