import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./VideoExplanation.css"; // Optional: Add styles as needed
import imageSrc from "../../assets/no-video.png";

const VideoExplanation = () => {
  const { id } = useParams(); // Extract the question ID from the URL
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    // Fetch question data by ID
    const fetchQuestion = async () => {

      try {
        const response = await axios.get(
          `http://localhost:8000/api/questions/${id}`
        );
        console.log("Fetched question:", response.data); // Debugging log to verify the question data
        setQuestion(response.data);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    fetchQuestion();
  }, [id]);


  if (!question) {
    return <div>Error loading question...</div>; // Error handling case
  }

  return (
    <>
      <div className="video-explanation-container">
        <h1 className="vidTitle">{question.titleSm}</h1>
        {question.videoLink ? (
          <div className="video-container">
            <iframe
              width="560"
              height="315"
              src={question.videoLink.replace("watch?v=", "embed/")} // Use the dynamic video link
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <>
            <p>No video available for this question.</p>
            <img
              src={imageSrc} // Update with the correct path to your image
              alt="Sorry, video unavailable"
              className="unavailable-image"
            />
            <span>
              Here is the link to the article:{" "}
              <Link to={`/problemList/${question._id}`}>Click here</Link>
            </span>
          </>
        )}
      </div>
    </>
  );
};

export default VideoExplanation;
