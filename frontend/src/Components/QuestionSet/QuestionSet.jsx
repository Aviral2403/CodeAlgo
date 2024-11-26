import PropTypes from "prop-types";
import { FaYoutube } from "react-icons/fa";
import { GrNotes } from "react-icons/gr";
import { FaCode } from "react-icons/fa";
import "./QuestionSet.css";
import { Link } from "react-router-dom";

const QuestionSet = ({ question, submissionStatus }) => {
  const truncatedName =
    question.titleSm.length > 25
      ? question.titleSm.slice(0, 25) + "..."
      : question.titleSm;

  const getStatusClass = (status) => {
    switch (status) {
      case "Completed":
        return "status-completed";
      case "Incomplete":
        return "status-incomplete";
      default:
        return "status-unattempted";
    }
  }; // This brace was in the wrong place

  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "difficulty-easy";
      case "medium":
        return "difficulty-medium";
      case "hard":
        return "difficulty-hard";
      default:
        return "";
    }
  };

  return (
    <div className="question-container">
      <div className="question-details">
        <div className="row-one">
          <div className="name-number">
            <div className="q-number">{question.number}</div>
            <div className="q-name">{truncatedName}</div>
          </div>
          <div className="status-difficulty">
            <div className={`q-status ${getStatusClass(submissionStatus)}`}>
              {submissionStatus}
            </div>
            <div
              className={`q-difficulty ${getDifficultyClass(
                question.difficulty
              )}`}
            >
              {question.difficulty}
            </div>{" "}
          </div>
        </div>

        <div className="row-two">
          <div className="q-tag-container">
            {question.tags.map((tag, index) => (
              <div key={index} className="q-tag">
                {tag}
              </div>
            ))}
          </div>
        </div>

        <div className="row-three">
          <Link to={`/problemList/article/${question._id}`}>
            <GrNotes className="note-icon" />
          </Link>
          <Link to={`/video-explanation/${question.titleSm.replace(/ /g, "-")}/${question._id}`}>
            <FaYoutube className="youtube-icon" />
          </Link>
          <Link
            to={`/problem/${question.titleSm.replace(/ /g, "-")}/description/${
              question._id
            }`}
          >
            <FaCode className="code-icon" />
          </Link>
        </div>
      </div>
    </div>
  );
};

QuestionSet.propTypes = {
  question: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    number: PropTypes.string.isRequired,
    titleSm: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  submissionStatus: PropTypes.oneOf(["Completed", "Incomplete", "Unattempted"])
    .isRequired,
};

export default QuestionSet;
