import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import './ProblemStatment.css';
import Loader from "../Loader/Loader";

const ProblemStatement = () => {
  const { id: questionId } = useParams(); // Extract question ID from URL
  const [question, setQuestion] = useState(null); // State to store the question
  const [error, setError] = useState(null); // Error state

  // Fetching the question data from the backend API
  const fetchQuestion = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/questions/${questionId}`);
      setQuestion(res.data); // Storing the fetched question in state
    } catch (err) {
      setError(err.message);
    }
  }, [questionId]);

  useEffect(() => {
    fetchQuestion(); // Fetch data when the component mounts or questionId changes
  }, [fetchQuestion]);

  // Display a loading message while data is being fetched
  if (!question && !error) {
    return <div className="loading-container"><Loader/></div>;
  }

  // If there's an error, display the error message
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Render the fetched question details once available
  return (
    <div className="problemStatement-container">
      <div className="questionName-container">
        <h1>{question.titleBg}</h1> {/* Render dynamic title */}
      </div>
      <div className="questionStatement-container">
        <p className="problem-description">
          <strong>Problem Statement:</strong> {question.problemStatement} {/* Render dynamic problem statement */}
        </p>
        {question.note && (
          <p className="note">
            <strong>Note:</strong> {question.note} {/* Render dynamic note if present */}
          </p>
        )}

        {/* Example Container */}
        <div className="examples-container">
          {question.example.map((ex, index) => (
            <div key={index} className="example">
              <div className="example-number">Example {index + 1}:</div>
              <div className="input-format">
                <strong>Input Format:</strong> {ex} {/* Render dynamic example */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='disclaimer'>
        <strong>Disclaimer:</strong> Do not jump directly to the solution, try it out yourself first.
      </div>
    </div>
  );
};

export default ProblemStatement;
