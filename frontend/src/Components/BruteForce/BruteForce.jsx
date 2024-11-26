import { useParams } from "react-router-dom";
import "./BruteForce.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

const BruteForce = () => {
  const { id: questionId } = useParams(); // Extract question ID from URL
  const [question, setQuestion] = useState(null); // State to store the question
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(true); // Loading state

  // Fetching the question data from the backend API
  const fetchQuestion = useCallback(async () => {
    setLoading(true); // Start loading
    try {
      const res = await axios.get(`http://localhost:8000/api/questions/${questionId}`);
      setQuestion(res.data); // Storing the fetched question in state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading
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
        <h3>Naive / Brute-Force Approach</h3>
      </div>
      <div className="intuition-container">
        <p className="intuition-description">
          <strong>Intuition:</strong> {question?.bruteIntuition}
        </p>
      </div>
      <div className="approach-container">
        <p className="approach-description">
          <strong>Approach: </strong> {question?.bruteApproach}
        </p>
      </div>
      <div className="complexity-container">
        <div className="complexity-description">
          <p className="time-desciption">
            <strong>Time Complexity: </strong> {question?.bruteTime}
          </p>
          <p className="space-complexity">
            <strong>Space Complexity: </strong> {question?.bruteSpace}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BruteForce;
