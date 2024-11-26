import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { Loader } from "lucide-react";
import backgroundImage from '../../assets/loginBg.png';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const { login, isLoading, error } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    const isLoggedIn = await login(email, password);

    if (isLoggedIn) {
      // Redirect after 2 seconds if login is successful
      setTimeout(() => {
        navigate("/");
      }, 2000); // 2000ms = 2 seconds
    }


  }

  return (
    <>
      <div className="login-page" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="login-container">
          <div className="closebtn">
            <Link to="/">
              <button>
                <IoIosClose />
              </button>
            </Link>
          </div>
          <h1>
            Welcome back to <br />{" "}
            <span style={{ color: "rgb(225, 29, 72)" }}>CodeAlgo</span>
          </h1>
          <form onSubmit={handleLogin}>
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
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?

            </Link>
            {error && <p className="error-text">{error}</p>}
            <button type="submit" className="login-btn">
              {isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Login"
              )}
            </button>
            <Link to="/signup" className="signup">
              Dont have an account?{" "}
              <span style={{ color: "#e63946" }}>Sign up</span>
            </Link>
          </form>



        </div>
      </div>
    </>
  );
};

export default LoginPage;
