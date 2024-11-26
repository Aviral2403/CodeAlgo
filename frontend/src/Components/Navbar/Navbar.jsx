/* eslint-disable react/prop-types */
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";

const Navbar = ({ user, userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Function to toggle the hamburger menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle screen resize and close the hamburger menu for larger screens
  const handleResize = () => {
    if (window.innerWidth > 576) {
      setIsOpen(false); // Close the menu if screen size is greater than 576px
    }
  };

  // Listen to the window resize event
  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="navbar-container">
      <div className="left">
        <div className="logo">
          <Link to="/">
            <span className="code">{"< "}Code</span>
            <span className="algo">Algo{" >"}</span>
          </Link>
        </div>
      </div>

      <div className="right">
        {user ? (
          <>
            {/* Hamburger menu for mobile view */}
            <div className="hamburger" onClick={toggleMenu}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>

            {/* Menu that opens when the hamburger is clicked */}
            <div className={`menu ${isOpen ? "open" : ""}`}>
              <Link to="/problemlist" className="navContent">
                Problems
              </Link>
              <Link to={`/profile/${userId}`} className="navContent">
                Profile
              </Link>
              <button className="logout" onClick={handleLogout}>
                LogOut
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="link"></div>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="login">LogIn</button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
