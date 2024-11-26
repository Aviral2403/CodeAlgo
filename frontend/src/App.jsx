/* eslint-disable react/prop-types */
import "./App.css";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ProblemList from "./pages/ProblemList/ProblemList";
import QuestionArticle from "./pages/QuestionArticle/QuestionArticle";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import VideoExplanation from "./pages/VideoExplanation/VideoExplanation";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import Loader from "./Components/Loader/Loader";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
// import SolveProblem from "./pages/SolveProblem/SolveProblem";
import VerifyEmail from "./Components/VerifyEmail/VerifyEmail";
// import WorkspaceProblemDescription from "./Components/WorkspaceProblemDescription/WorkspaceProblemDescription";
import Workspace from "./pages/Workspace/Workspace";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth, user } = useAuthStore();
  const userId = user ? user._id : null; // Extract userId from user

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) return <Loader />;

  return (
    <>
      <div className="app-container">
        <Navbar user={user} userId={userId} />
        <Routes>
          <Route path="/" element={<HomePage user={user} />} />

          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <RegisterPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPassword />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPassword />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/problemlist"
            element={
              <ProtectedRoute>
                <ProblemList user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/problemlist/article/:id"
            element={
              <ProtectedRoute>
                <QuestionArticle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/video-explanation/:title/:id"
            element={
              <ProtectedRoute>
                <VideoExplanation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:id" // Ensure this matches the route
            element={
              <ProtectedRoute>
                <ProfilePage user = {user}/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/problem/:title/description/:id"
            element={
              <ProtectedRoute>
                 <Workspace user = {user}/>
              </ProtectedRoute>
            }
          />

          {/* <Route
            path="/problem/:title/description/:id"
            element={
              <ProtectedRoute>
               
              </ProtectedRoute>
            }
          /> */}

          <Route
            path="/verify-email"
            element={<VerifyEmail />}
          />
        </Routes>
        <Footer />
        <Toaster />
      </div>
    </>
  );
}

export default App;
