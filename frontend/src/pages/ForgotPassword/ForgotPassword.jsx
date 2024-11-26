import "./ForgotPassword.css";
import { Link } from "react-router-dom";
import { IoIosClose, IoMdArrowRoundBack } from "react-icons/io";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import { Loader, Mail } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isLoading, forgotPassword } = useAuthStore();

  useEffect(() => {
    console.log("isSubmitted:", isSubmitted);
  }, [isSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting email:", email);
    try {
      await forgotPassword(email);
      console.log("Forgot password API call succeeded");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  return (
    <>
      <div className="forgotPassword-page">
        <div className="forgotPassword-container">
          <div className="closebtn">
            <Link to="/">
              <button>
                <IoIosClose />
              </button>
            </Link>
          </div>

          {!isSubmitted ? (
            <>
              <div className="resetMessage">
                <h1>Forgot Password?</h1>
                <div className="forgot-message">
                  <span>
                  Can remember every DSA  Algorithm but trouble remembring
                password? Nevermind, Lets initialise you a new one!
                  </span>
                  <div className="link-message">
                    <span>
                      Enter your email address and we will send you a link to reset
                      your password.
                    </span>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                />
                <button type="submit" className="submit-btn">
                  {isLoading ? (
                    <Loader className="animate-spin mx-auto" size={24} />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="confirmation-message">
              <h2>Reset Link Sent</h2>
              <div className="icon-container">
                <Mail className='mail-icon' />
              </div>
              <p className='success-message'>
                If an account exists for <b>{email}</b>, you will receive a password reset link shortly.
              </p>
            </div>
          )}

          <div className="back">
            <Link to="/login">
              <span>
                <IoMdArrowRoundBack /> Back to login
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;



