import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

import { FaShoppingCart } from "react-icons/fa";
import Searchbar from './SearchBar/Searchbar';

const Navbar = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('Token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('User')));

  useEffect(() => {
    setToken(localStorage.getItem('Token'));
    setUser(JSON.parse(localStorage.getItem('User')));
  }, [token]); // Update state when token changes

  const handleLogout = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/users/sign_out`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        if (response.data.status === 200) {
          localStorage.removeItem('Token');
          localStorage.removeItem('User');
          setToken(null);
          setUser(null);
          navigate("/")
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="navbar_home_page_mai_div">
      <div className="nav_bar_left_side_logo" style={{display : "flex" , alignItems : "center"}} onClick={() => navigate('/')}>
        SuperMart
        {token &&
          <div className="user_name_at_the_navbar">Hi, {user && user.name}</div>  
        }
      </div>
      {token ? (
        <div className="right_side_user_name_and_button_div_nav_bar">
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#searchbar">
            Search
          </button>
          <div className="modal fade" id="searchbar" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-dialog-scrollable custom-modal-width">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel" style={{color : "black"}}>Search Here</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body" style={{ color: 'black' , height : '90vh' }}>
                <Searchbar />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
          </div>
          <div className="user_name_at_the_navbar" style={{cursor : "pointer" , marginLeft: "1rem"}} onClick={() => navigate('/products/cart')}>Cart <FaShoppingCart /></div>
          <div className="user_name_at_the_navbar" style={{cursor : "pointer"}} onClick={() => navigate('/products')}>Products</div>
          {token && user.role == "admin" &&<div className="user_name_at_the_navbar" style={{cursor :"pointer"}} onClick={() => navigate("/adminpanel")}>Admin Panel</div>}
          <div className="right_side_login_button_and_sign_up_button" onClick={handleLogout}>
            Logout
          </div>
        </div>
      ) : (
        <div className="right_side_login_button_and_sign_up_button" onClick={() => navigate('/login')}>
          Login
        </div>
      )}
    </div>
  );
};

export default Navbar;
