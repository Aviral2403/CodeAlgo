import "./RegisterPage.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { useAuthStore } from "../../store/authStore";
import { useState } from "react";
import Loader from "../../Components/Loader/Loader";
//import backgroundImage from '../../assets/loginBg.png';

const Register = () => {
  const [username, setUserName] = useState("");
  const [fullname, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await signup(email, password, username, fullname);
      console.log({ email, password, username, fullname }); // Add this log

      // Set success message
      setSuccessMessage("Account created! Redirecting to verification page...");

      // Set a timeout to delay redirection by 2 seconds
      setTimeout(() => {
        navigate("/verify-email");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="register-page">
        <div className="register-container">
          <div className="closebtn">
            <Link to="/">
              <button>
                <IoIosClose />
              </button>
            </Link>
          </div>
          <h1>
            Ready to begin your journey with{" "}
            <span style={{ color: "rgb(225, 29, 72)" }}>CodeAlgo</span>
          </h1>
          <button className="google-signin">Sign in with Google</button>
          <div className="divider">Or, sign up with</div>
          <form onSubmit={handleSignUp}>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              type="text"
              name="fullname"
              id="fullname"
              placeholder="Fullname"
              value={fullname}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              name="email"
              id="email"
              placeholder="john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error-text">{error}</p>}
            {successMessage && <p className="success-text">{successMessage}</p>} {/* Display success message */}

            <button type="submit" className="register-btn">
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
          <Link to="/login" className="login">
            Already have an account?{" "}
            <span style={{ color: "#e63946" }}>Login</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Register;
