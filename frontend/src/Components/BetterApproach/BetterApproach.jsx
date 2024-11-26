import { useParams } from "react-router-dom";
import "./BetterApproach.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
const BetterApproach = () => {

  const { id: questionId } = useParams(); // Extract question ID from URL
  const [question, setQuestion] = useState(null); // State to store the question
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetching the question data from the backend API
  const fetchQuestion = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/questions/${questionId}`);
      setQuestion(res.data); // Storing the fetched question in state
      setLoading(false); // Set loading to false when data is fetched
    } catch (err) {
      setError(err.message);
      setLoading(false); // Set loading to false if there's an error
    }
  }, [questionId]);

  useEffect(() => {
    fetchQuestion(); // Fetch data when the component mounts or questionId changes
  }, [fetchQuestion]);

  // Display a loading message while data is being fetched
  if (loading) {
    return <div className="loading-container"><Loader/></div>;
  }

  // If there's an error, display the error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="heading-container">
      <div className="questionName-container">
        <h3>Better Approach</h3>
      </div>
      <div className="intuition-container">
        <p className="intuition-description">
          <strong>Intuition:</strong> {question.betterIntuition}
        </p>
      </div>
      <div className="approach-container">
        <p className="approach-description">
          <strong>Approach: </strong> {question.betterApproach}
        </p>
      </div>
      <div className="complexity-container">
        <div className="complexity-description">
          <p className="time-desciption">
            <strong>Time Complexity: </strong> {question.betterTime}
          </p>
          <p className="space-complexity">
            <strong>Space Complexity: </strong> {question.betterSpace}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BetterApproach;