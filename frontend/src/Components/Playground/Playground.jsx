/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { IoMdSettings } from "react-icons/io";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import "./Playground.css";
import CodeTestSplit from "../CodeTestSplit/CodeTestSplit";

const TimerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
    className="timer-icon"
  >
    <path
      fillRule="evenodd"
      d="M12 4a9 9 0 110 18 9 9 0 010-18zm0 2a7 7 0 100 14 7 7 0 000-14zm0 1.634a1 1 0 01.993.883l.007.117-.001 3.774 2.111 1.162a1 1 0 01.445 1.253l-.05.105a1 1 0 01-1.254.445l-.105-.05-2.628-1.447a1 1 0 01-.51-.756L11 13V8.634a1 1 0 011-1zM16.235 2.4a1 1 0 011.296-.269l.105.07 4 3 .095.08a1 1 0 01-1.19 1.588l-.105-.069-4-3-.096-.081a1 1 0 01-.105-1.319zM7.8 2.4a1 1 0 01-.104 1.319L7.6 3.8l-4 3a1 1 0 01-1.296-1.518L2.4 5.2l4-3a1 1 0 011.4.2z"
      clipRule="evenodd"
    />
  </svg>
);

const Playground = ({ questionId, userId }) => {
  console.log("Playground userId:", userId);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [time, setTime] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours < 10 ? "0" + hours : hours}:${
      minutes < 10 ? "0" + minutes : minutes
    }:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const handleTimerClick = () => {
    setShowTimer(!showTimer);
    if (!showTimer) {
      setTime(0);
    }
  };

  useEffect(() => {
    const exitHandler = () => {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    };

    document.addEventListener("fullscreenchange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);

    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
      document.removeEventListener("mozfullscreenchange", exitHandler);
      document.removeEventListener("MSFullscreenChange", exitHandler);
    };
  }, []);

  useEffect(() => {
    let intervalId;
    if (showTimer) {
      intervalId = setInterval(() => {
        setTime((time) => time + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [showTimer]);

  return (
    <div className="code-test-container">
      <div className="workspace-desc-container">
        <div className="content-area">
          <div className="header-nav">
            <div className="header-nav-left">
              <div className="nav-item">
                <select
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="language-dropdown"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                  <option value="c">C</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                </select>
              </div>
            </div>
            <div className="header-nav-right">
              <button
                className="nav-item timer-button"
                onClick={handleTimerClick}
              >
                <TimerIcon />
                {showTimer && (
                  <span className="timer-display">{formatTime(time)}</span>
                )}
              </button>
              <button className="nav-item">
                <IoMdSettings />
              </button>
              <button className="nav-item" onClick={handleFullScreen}>
                {!isFullScreen ? (
                  <AiOutlineFullscreen />
                ) : (
                  <AiOutlineFullscreenExit />
                )}
              </button>
            </div>
          </div>
          <CodeTestSplit
            selectedLanguage={selectedLanguage}
            questionId={questionId}
            userId={userId}
          />
        </div>
      </div>
    </div>
  );
};

export default Playground;
