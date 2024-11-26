import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import WorkspaceProblemDescription from "../../Components/WorkspaceProblemDescription/WorkspaceProblemDescription";
import Playground from "../../Components/Playground/Playground";
import Split from "react-split";
import "./Workspace.css";

/* eslint-disable react/prop-types */
const Workspace = ({ user }) => {
  console.log("Workspace user:", user);
  console.log("Workspace userId:", user?._id);


  const { id } = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="workspace-mobile">
        <div className="workspace-section">
          <WorkspaceProblemDescription questionId={id} user={user} />
        </div>
        <div className="workspace-section">
          <Playground questionId={id} userId={user._id} />
        </div>
      </div>
    );
  }

  return (
    <Split className="split workspace-desktop" minSize={0} snapOffset={0}>
      <div className="workspace-panel">
        <WorkspaceProblemDescription questionId={id} user={user} />
      </div>
      <div className="workspace-panel">
        <Playground questionId={id} userId={user._id}/>
      </div>
    </Split>
  );
};

export default Workspace;
