import "./ProblemList.css";
import SearchBar from "../../Components/SearchBar/SearchBar";
import QuestionSet from "../../Components/QuestionSet/QuestionSet";
import Loader from "../../Components/Loader/Loader";
import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";
import imageSrc from "../../assets/no-result.png";


const ProblemList = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const questionsPerPage = 5;
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchQuestionsAndSubmissions = async () => {
      try {
        setIsLoading(true);
        
        const questionsResponse = await fetch("http://localhost:8000/api/questions/questions");
        if (!questionsResponse.ok) {
          throw new Error('Failed to fetch questions');
        }
        const questionsData = await questionsResponse.json();
        setAllQuestions(questionsData);
        setDisplayedQuestions(questionsData);

        if (user && user._id) {
          const submissionsResponse = await fetch(
            `http://localhost:8000/api/submission/submissions/${user._id}`
          );
          
          if (submissionsResponse.ok) {
            const submissionsData = await submissionsResponse.json();
            if (submissionsData.success && Array.isArray(submissionsData.data)) {
              const submissionsMap = submissionsData.data.reduce((acc, submission) => {
                const questionId = submission.questionId?._id || submission.questionId;
                if (questionId) {
                  acc[questionId] = {
                    isCompleted: submission.isCompleted,
                    submissionDate: submission.submissionDate,
                  };
                }
                return acc;
              }, {});
              setSubmissions(submissionsMap);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestionsAndSubmissions();
  }, [user]);

  const handleSearchResults = (results) => {
    if (results === null) {
      setDisplayedQuestions(allQuestions);
    } else {
      setDisplayedQuestions(results);
    }
    setCurrentPage(1);
  };

  const getSubmissionStatus = (questionId) => {
    if (!user) return "Unattempted";
    if (!submissions[questionId]) return "Unattempted";
    return submissions[questionId].isCompleted ? "Completed" : "Incomplete";
  };

  const totalPages = Math.ceil(displayedQuestions.length / questionsPerPage);

  const currentQuestions = displayedQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div className="loading-container"><Loader /></div>;
  }

  return (
    <div className="problem-container">
      <SearchBar onSearchResults={handleSearchResults} />
      {displayedQuestions.length === 0 ? (
        <div className="no-results">
          <img src={imageSrc} alt="" />
          <span>No Questions Matches Your Search!</span>
        </div>
      ) : (
        <>
          {currentQuestions.map((question) => (
            <QuestionSet
              key={question._id}
              question={question}
              submissionStatus={getSubmissionStatus(question._id)}
            />
          ))}
          
          <div className="pagination-controls">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProblemList;