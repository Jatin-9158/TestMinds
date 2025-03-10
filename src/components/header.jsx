import React, { useState, useEffect } from "react";
import Logo from "../utils/logo.png";
import { auth } from "../utils/firebaseConfig";
import { signOut } from "firebase/auth";
import { useDispatch } from "react-redux";
import { logout } from "../utils/userSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/signup") {
      signOut(auth)
        .then(() => {})
        .catch(() => {});
      dispatch(logout());
    }
  }, [location, dispatch]);


  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      navigate("/");
    } catch (error) {
      alert("Logout Error");
    }
    setMenuOpen(false);
  };

  return (
    <div className="absolute flex justify-between items-center w-full md:px-10 rounded-sm shadow-lg bg-gradient-to-br bg-white md:py-3 bg-opacity-35">
      <img className="w-48 md:w-52 mt-2 z-10" src={Logo} alt="logo" />
      {auth?.currentUser && (
        <>
          <button
            className="md:hidden text-2xl p-2 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div
            className={`${
              menuOpen ? "flex" : "hidden"
            } md:flex flex-col md:flex-row gap-6 absolute md:relative top-16 right-4 md:top-0 md:right-0 bg-white md:bg-transparent shadow-md md:shadow-none p-4 md:p-0 rounded-md`}
          >
           
            <button
              className="w-24 text-white bg-blue-500 px-4 py-2 md:py-4 rounded-md font-semibold"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;