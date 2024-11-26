import BetterApproach from "../../Components/BetterApproach/BetterApproach";
import BruteForce from "../../Components/BruteForce/BruteForce";
import OptimalApproach from "../../Components/OptimalApproach/OptimalApproach";
import ProblemStatment from "../../Components/ProblemStatment/ProblemStatment";
import "./QuestionArticle.css";
const QuestionArticle = () => {
  return (
    <>
      <div className="article-container">
        <ProblemStatment />
        <BruteForce/>
        <BetterApproach/>
        <OptimalApproach/>
      </div>
    </>
  );
};

export default QuestionArticle;
