/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";
import "./WorkspaceProblemDescription.css";

const WorkspaceProblemDescription = ({ user }) => {
  const { id } = useParams();
  const [problemDetails, setProblemDetails] = useState(null);
  const [codeDetails, setCodeDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissionStatus, setSubmissionStatus] = useState('unsolved');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      try {
        const userId = user?._id;
        if (!userId) return;
        
        const response = await fetch(
          `http://localhost:8000/api/submission/status/${userId}/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch submission status");
        const data = await response.json();
        setSubmissionStatus(data.status);
      } catch (err) {
        console.error("Failed to fetch submission status:", err);
        toast.error("Failed to load submission status");
      }
    };

    if (user?._id && id) fetchSubmissionStatus();
  }, [user?._id, id]);

  useEffect(() => {
    const fetchProblemDetails = async () => {
      try {
        setIsLoading(true);
        const [questionResponse, codeResponse] = await Promise.all([
          fetch(`http://localhost:8000/api/questions/${id}`),
          fetch(`http://localhost:8000/api/code/get-description/${id}`)
        ]);

        if (!questionResponse.ok) throw new Error("Failed to fetch question details");
        
        const questionData = await questionResponse.json();
        setProblemDetails(questionData);

        if (codeResponse.ok) {
          const codeData = await codeResponse.json();
          setCodeDetails(codeData);
        }
      } catch (err) {
        console.error("Failed to fetch problem details:", err);
        toast.error("Failed to load problem details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblemDetails();
  }, [id]);

  const renderConstraints = () => {
    if (!codeDetails?.constraints) return <li>No constraints specified</li>;
    
    const constraints = Array.isArray(codeDetails.constraints) 
      ? codeDetails.constraints 
      : codeDetails.constraints.split(/[,\n]/).filter(Boolean);

    return constraints.map((constraint, index) => (
      <li key={index}>
        <code>{constraint.trim()}</code>
      </li>
    ));
  };

  if (isLoading) return <div className="loader-container"><Loader /></div>;
  if (!problemDetails) return <div className="not-found">Problem not found</div>;

  return (
    <div className="workspace-problem">
      {/* Header with tabs */}
      <div className="workspace-tabs">
        <button
          onClick={() => setActiveTab('description')}
          className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
        >
          Description
        </button>
        
      </div>

      {/* Main content */}
      <div className="workspace-content">
        <div className="content-container">
          {/* Title and metadata */}
          <div className="problem-header">
            <h1 className="problem-title">
              {problemDetails.number}. {problemDetails.titleSm}
            </h1>
            
            <div className="problem-metadata">
              <span className={`difficulty-badge ${problemDetails.difficulty.toLowerCase()}`}>
                {problemDetails.difficulty}
              </span>
              
              <span className={`status-badge ${submissionStatus}`}>
                {submissionStatus.charAt(0).toUpperCase() + submissionStatus.slice(1)}
              </span>
            </div>
          </div>

          {/* Problem description */}
          <div className="problem-description">
            {codeDetails?.problemDesc?.map((desc, index) => (
              <p key={index}>{desc}</p>
            ))}
          </div>

          {/* Examples */}
          <div className="examples-section">
            {codeDetails?.input?.map((input, index) => (
              <div key={index} className="example">
                <h3 className="example-title">Example {index + 1}</h3>
                <div className="example-card">
                  <div className="example-input">
                    <div className="example-label">Input</div>
                    <pre>{input}</pre>
                  </div>
                  <div className="example-output">
                    <div className="example-label">Output</div>
                    <pre>{codeDetails.output[index]}</pre>
                  </div>
                  {codeDetails.explanation[index] && (
                    <div className="example-explanation">
                      <div className="example-label">Explanation</div>
                      <p>{codeDetails.explanation[index]}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          {codeDetails && (
            <div className="constraints-section">
              <h3 className="constraints-title">Constraints</h3>
              <ul className="constraints-list">
                {renderConstraints()}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceProblemDescription;
