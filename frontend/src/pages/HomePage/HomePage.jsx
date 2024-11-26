/* eslint-disable react/prop-types */
import "./HomePage.css";
import imageSrc from "../../assets/dashboard.png";
import { Link } from "react-router-dom";

const HomePage = ({ user }) => {
  return (
    <div>
      <div className="home-container">
        <div className="container text-center">
          {/* Main Heading */}
          <h1 className="display-4 mb-4">
            Gear Up for <span className="text-danger">Success</span>: Your{" "}
            <span className="text-danger">Ultimate</span> Preparation Hub!
          </h1>

          {/* Top Section */}
          <div className="row align-items-center">
            <div className="col-md-6 text-center mb-4 mb-md-0">
              <img
                src={imageSrc}
                alt="Dashboard"
                className="img-fluid"
                style={{ maxWidth: "80%" }}
              />
            </div>
            <div className="col-md-6 text-md-left">
              <h2 className="text-danger">Coding Made Easy!</h2>
              <p className="lead">
                CodeAlgo is the best platform to help you enhance your skills,
                expand your knowledge, and prepare for technical interviews.
              </p>
              <>
                {!user ? (
                  <Link to="/signup" className="link">
                    <button className="btn btn-danger btn-lg custom-hover">
                      Create Account
                    </button>
                  </Link>
                ) : (
                  <Link to="/problemlist" className="link">
                    <button className="btn btn-danger btn-lg custom-hover">
                      Lets get started
                    </button>
                  </Link>
                )}
              </>
            </div>
          </div>

          {/* Bottom Cards Section */}
          <div className="row mt-5">
            <div className="col-md-4 mb-4">
              <div className="card bg-dark text-white h-100 card-height">
                <div className="card-body">
                  <h3 className="card-title text-danger">
                    Unmatched Content Depth
                  </h3>
                  <p className="card-text">
                    We prioritize quality content, offering in-depth
                    explanations and a wider range of solved problems in both
                    free and paid courses. Our focus is on developing
                    problem-solving skills through intuitive video explanations.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card bg-dark text-white h-100 card-height">
                <div className="card-body">
                  <h3 className="card-title text-danger">
                    Structured Learning Path
                  </h3>
                  <p className="card-text">
                    A guided, step-by-step approach to maste coding skills.
                    Tailored for learners at all levels, Master Data Structures
                    & Algorithms (DSA) in-depth video solutions and detailed
                    articles on every topic.From beginner to advanced,this coveres everything in a stepwise manner.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-4">
              <div className="card bg-dark text-white h-100 card-height">
                <div className="card-body">
                  <h3 className="card-title text-danger">
                    Track your progress
                  </h3>
                  <p className="card-text">
                    Feature that allows users to monitor their growth as they
                    solve coding challenges. It provides detailed insights into
                    completed problems, performance metrics, and areas for
                    improvement. Set goals and effectively prepare for technical
                    interviews.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Heading */}
          <h2 className="mt-4 text-danger">Code | Learn | Grow!!!</h2>
          <p className="lead">
            The best place to learn data Structures and algorithms, most asked
            coding interview questions and get real interview experiences free of cost.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
