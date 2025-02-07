import React, { useState, useEffect } from "react";
import Logo from "../utils/logo.png";
import { auth } from "../utils/firebaseConfig";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logout } from "../utils/userSlice";
import { useLocation, useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/signup") {
      signOut(auth).then(()=>{

      })
      .catch(()=>{
        
      })
      dispatch(logout());
    }
  }, [location, dispatch]);


  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      alert("Logout Error");
    }
  };

  return (
    <div className="absolute flex justify-between items-center w-full md:px-10 rounded-sm shadow-lg bg-gradient-to-br bg-white md:py-3 bg-opacity-35">
      <img className="w-48 md:w-52 mt-2 z-10" src={Logo} alt="logo" />
      {auth?.currentUser && (
        <div className="flex gap-10">
          <div className="flex flex-col justify-center items-center" onClick={handleProfile}>
            <FaUserCircle className="text-4xl" />
            <h6 className="text-center">My Profile</h6>
          </div>
          <button
            className="w-24  text-white bg-blue-500 mr-8 px-4 py-2 md:py-4 rounded-md font-semibold  text-pretty"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) }
    </div>
  )
};

export default Header;
