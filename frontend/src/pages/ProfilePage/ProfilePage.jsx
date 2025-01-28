import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProfilePage.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import Calendar from "react-calendar";
import "react-circular-progressbar/dist/styles.css";
import "react-calendar/dist/Calendar.css";
import Loader from "../../Components/Loader/Loader";
import GoalSet from "../../Components/Goal/GoalSet";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProfilePage = () => {
  const { id: userId } = useParams();
  const [latestSubmissions, setLatestSubmissions] = useState([]);
  const [submissionsSummary, setSubmissionsSummary] = useState({
    completed: { easy: 0, medium: 0, hard: 0 },
    incomplete: { easy: 0, medium: 0, hard: 0 },
    unattempted: { easy: 0, medium: 0, hard: 0 },
  });
  const [submissionDates, setSubmissionDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [submissionData, setSubmissionData] = useState({
    completed: 0,
    incomplete: 0,
  });
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [goalAchievementMessage, setGoalAchievementMessage] = useState(null);

  const fetchSubmissionDates = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/submission/submission-dates/${userId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch submission dates");
      const data = await response.json();
      setSubmissionDates(data);
    } catch (error) {
      console.error("Error fetching submission dates:", error);
      setError("Failed to load submission dates");
    }
  };

  const fetchLatestSubmissions = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/submission/latest-submissions/${userId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch latest submissions");
      const data = await response.json();
      setLatestSubmissions(data);
    } catch (error) {
      console.error("Error fetching latest submissions:", error);
      setError("Failed to load latest submissions");
    }
  };

  const fetchSubmissionsSummary = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/submission/submissions-summary/${userId}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch submissions summary");
      const data = await response.json();
      setSubmissionsSummary(data);
    } catch (error) {
      console.error("Error fetching submissions summary:", error);
      setError("Failed to load submissions summary");
    }
  };

  const fetchGoalForDate = async (dateString) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/goal/${userId}/${dateString}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch goal");
      const data = await response.json();
      setCurrentGoal(data);

      // Check goal achievement for past dates
      const selectedDate = new Date(dateString);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today && data.goals) {
        const { goals, submissions } = data;
        const isGoalAchieved =
          submissions.easy >= goals.easy &&
          submissions.medium >= goals.medium &&
          submissions.hard >= goals.hard;

        setGoalAchievementMessage(
          isGoalAchieved
            ? "Congratulations! Goal successfully Completed!"
            : "Goal wasn't achieved! Keep Hustling! Keep Growing!"
        );
      } else {
        setGoalAchievementMessage(null);
      }
    } catch (error) {
      console.error("Error fetching goal:", error);
      setCurrentGoal(null);
      setGoalAchievementMessage(null);
    }
  };

  useEffect(() => {
    if (!userId) {
      setError("No user ID provided");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchLatestSubmissions(),
          fetchSubmissionsSummary(),
          fetchSubmissionDates(),
        ]);
      } catch (error) {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const getTileClassName = ({ date }) => {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dateString = utcDate.toISOString().split("T")[0];
    const submission = submissionDates.find((sub) => sub.date === dateString);
    if (submission) {
      return submission.isCompleted
        ? "submissionCompleted"
        : "submissionIncomplete";
    }
    return null;
  };

  const handleDateHover = async (date) => {
    const dateString = date.toISOString().split("T")[0];
    try {
      const response = await fetch(
        `http://localhost:8000/api/submission/submissions-on-date/${userId}/${dateString}`,
        {
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error("Failed to fetch submissions on date");
      const data = await response.json();
      setSubmissionData(data);
      await fetchGoalForDate(dateString);
    } catch (error) {
      console.error("Error fetching submissions on date:", error);
      setSubmissionData({ completed: 0, incomplete: 0 });
    }
    setHoveredDate(date);
  };

  const handleDateLeave = () => {
    setHoveredDate(null);
    setSubmissionData({ completed: 0, incomplete: 0 });
    setCurrentGoal(null);
  };

  // const handleDateClick = async (date) => {
  //   const utcDate = new Date(
  //     Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  //   );
  //   const dateString = utcDate.toISOString().split("T")[0];

  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/api/submission/submissions-on-date/${userId}/${dateString}`,
  //       { credentials: "include" }
  //     );
  //     if (!response.ok) throw new Error("Failed to fetch submissions on date");
  //     const data = await response.json();
  //     setSubmissionData(data);
  //     await fetchGoalForDate(dateString);
  //   } catch (error) {
  //     console.error("Error fetching submissions on date:", error);
  //     setSubmissionData({ completed: 0, incomplete: 0 });
  //   }
  //   setHoveredDate(date);
  // };

  const handleDateClick = async (date) => {
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dateString = utcDate.toISOString().split("T")[0];

    try {
      const response = await fetch(
        `http://localhost:8000/api/submission/submissions-on-date/${userId}/${dateString}`,
        { credentials: "include" }
      );
      if (!response.ok) throw new Error("Failed to fetch submissions on date");
      const data = await response.json();
      setSubmissionData(data);
      await fetchGoalForDate(dateString);
    } catch (error) {
      console.error("Error fetching submissions on date:", error);
      setSubmissionData({ completed: 0, incomplete: 0 });
    }
    setHoveredDate(date);
  };

  if (loading) {
    return (
      <div className="profile-page-loading">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page-error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  // Calculate progress
  const completedCount =
    submissionsSummary.completed.easy +
    submissionsSummary.completed.medium +
    submissionsSummary.completed.hard;

  const attemptedCount =
    submissionsSummary.incomplete.easy +
    submissionsSummary.incomplete.medium +
    submissionsSummary.incomplete.hard;

  const unattemptedCount =
    submissionsSummary.unattempted.easy +
    submissionsSummary.unattempted.medium +
    submissionsSummary.unattempted.hard;

  const totalCount = completedCount + attemptedCount + unattemptedCount;

  const totalEasy =
    submissionsSummary.completed.easy +
    submissionsSummary.incomplete.easy +
    submissionsSummary.unattempted.easy;

  const totalMedium =
    submissionsSummary.completed.medium +
    submissionsSummary.incomplete.medium +
    submissionsSummary.unattempted.medium;

  const totalHard =
    submissionsSummary.completed.hard +
    submissionsSummary.incomplete.hard +
    submissionsSummary.unattempted.hard;

  const completedPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="profile-page">
      <div className="submissionTitle">
        <h2>All Submissions Summary</h2>
      </div>
      <div className="progress-stats">
        <div className="progress-history">
          <div className="progress-section">
            <div className="progress-circle">
              <CircularProgressbar
                value={completedPercentage}
                text={`${completedCount}/${totalCount}`}
                strokeWidth={10}
                styles={buildStyles({
                  pathColor: "#4CAF50",
                  trailColor: "#000000",
                  backgroundColor: "#ffb300",
                  textColor: "#ffffff",
                  textSize: "16px",
                })}
              />
            </div>
            {completedPercentage === 0 && (
              <div className="message">
                <p>You're yet to start your journey!</p>
                <p className="wish-message">All The Best!</p>
              </div>
            )}
          </div>

          <div className="stats">
            <p className="easy">
              Easy: {submissionsSummary.completed.easy}/{totalEasy}
            </p>
            <p className="medium">
              Medium: {submissionsSummary.completed.medium}/{totalMedium}
            </p>
            <p className="hard">
              Hard: {submissionsSummary.completed.hard}/{totalHard}
            </p>
          </div>
        </div>
      </div>

      <div className="submissions-summary">
        <div className="summary">
          <div className="completed">
            <h3>Completed</h3>
            <p className="easy">
              Easy: {submissionsSummary.completed.easy || 0}
            </p>
            <p className="medium">
              Medium: {submissionsSummary.completed.medium || 0}
            </p>
            <p className="hard">
              Hard: {submissionsSummary.completed.hard || 0}
            </p>
          </div>
          <div className="attempted">
            <h3>Attempted</h3>
            <p className="easy">
              Easy: {submissionsSummary.incomplete.easy || 0}
            </p>
            <p className="medium">
              Medium: {submissionsSummary.incomplete.medium || 0}
            </p>
            <p className="hard">
              Hard: {submissionsSummary.incomplete.hard || 0}
            </p>
          </div>
          <div className="unattempted">
            <h3>Unattempted</h3>
            <p className="easy">
              Easy: {submissionsSummary.unattempted.easy || 0}
            </p>
            <p className="medium">
              Medium: {submissionsSummary.unattempted.medium || 0}
            </p>
            <p className="hard">
              Hard: {submissionsSummary.unattempted.hard || 0}
            </p>
          </div>
        </div>
        <button className="set-goal-btn" onClick={() => setShowGoalForm(true)}>
          Set Daily Goal
        </button>
      </div>

      <div className="calendar-section">
        <h2>Submission Activity Calendar</h2>
        <Calendar
          tileClassName={getTileClassName}
          onClickDay={(date) => handleDateClick(date)}
          onActiveStartDateChange={({ activeStartDate, value, view }) => {
            if (view === "month") {
              handleDateHover(activeStartDate);
            }
          }}
          onMouseLeave={handleDateLeave}
        />
        {hoveredDate && (
          <>
            <div className="submission-goals">
              <div className="tooltip-date">
                <span>Submission And Daily Goal for</span>{" "}
                {hoveredDate.toLocaleDateString("en-GB")}
              </div>
            </div>
            <div>
              <div className="submission-tooltip">
                <div className="tooltip-stats">
                  <p className="tooltip-completed">
                    Completed: {submissionData.completed}
                  </p>
                  <p className="tooltip-incomplete">
                    Incomplete: {submissionData.incomplete}
                  </p>
                </div>
                {currentGoal && currentGoal.goals ? (
                  <div className="tooltip-goals">
                    <p className="easy">Easy: {currentGoal.goals.easy}</p>
                    <p className="medium">Medium: {currentGoal.goals.medium}</p>
                    <p className="hard">Hard: {currentGoal.goals.hard}</p>

                    {/* Add goal achievement message for past dates */}
                    {goalAchievementMessage && (
                      <div
                        className={`goal-achievement-message ${
                          goalAchievementMessage.includes("Congratulations")
                            ? "success-message"
                            : "failure-message"
                        }`}
                      >
                        {goalAchievementMessage}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-goal-message">
                    No Goals Set For The Selected Date
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="latest-submissions">
        <h2>Latest Submissions</h2>
        <table>
          <thead>
            <tr>
              <th>Question</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(latestSubmissions) &&
            latestSubmissions.length > 0 ? (
              latestSubmissions.map((submission, index) => (
                <tr key={index}>
                  <td>{submission.questionId.titleSm}</td>
                  <td>
                    {new Date(submission.submissionDate).toLocaleDateString()}
                  </td>
                  <td
                    className={
                      submission.isCompleted
                        ? "status-completed"
                        : "status-incomplete"
                    }
                  >
                    {submission.isCompleted ? "Completed" : "Incomplete"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No submissions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showGoalForm && (
        <GoalSet userId={userId} onClose={() => setShowGoalForm(false)} />
      )}
    </div>
  );
};

export default ProfilePage;
