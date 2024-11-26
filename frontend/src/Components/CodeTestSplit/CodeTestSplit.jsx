/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { java } from "@codemirror/lang-java";
import { python } from "@codemirror/lang-python";
import { BsChevronUp } from "react-icons/bs";
import Loader from "../../Components/Loader/Loader";
import "./CodeTestSplit.css";

const CodeTestSplit = ({ selectedLanguage, questionId, userId }) => {
  const [testCases, setTestCases] = useState([]);
  const [selectedTestCase, setSelectedTestCase] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [code, setCode] = useState("");
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState("");
  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    if (questionId) {
      setLoading(true); // Set loading to true when fetching starts
      axios
        .get(`http://localhost:8000/api/code/get-description/${questionId}`)
        .then((response) => {
          setTestCases(
            response.data.input.map((input, index) => ({
              input,
              output: response.data.output[index],
            }))
          );
        })
        .catch((error) => {
          console.error("Error fetching test cases:", error);
          setError("Failed to load test cases"); // Set error message if fetch fails
        })
        .finally(() => {
          setLoading(false); // Set loading to false once fetch completes
        });
    }
  }, [questionId]);

  const getLanguageExtension = (language) => {
    switch (language) {
      case "cpp":
      case "c":
        return cpp();
      case "java":
        return java();
      case "python":
        return python();
      case "javascript":
      default:
        return javascript();
    }
  };

  const getDefaultCode = (language) => {
    switch (language) {
      case "cpp":
      case "c":
        return "const int a = 1;";
      case "java":
        return "final int a = 1;";
      case "python":
        return "a = 1";
      case "javascript":
      default:
        return "const a = 1;";
    }
  };

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          backgroundColor: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        <Loader /> {/* Display a loading spinner or message */}
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="error-message"
        style={{
          backgroundColor: "black",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
        }}
      >
        {error}
      </div>
    );
  }

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    setExecuting(true);
    setConsoleOutput("");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/submission/submit-code",
        {
          code,
          language: selectedLanguage,
          questionId,
          userId,
          testCaseIndex: selectedTestCase,
        }
      );

      // Format the output to show input, expected output, and actual output
      const formattedOutput = response.data.results.map((result) => ({
        input: result.input,
        expectedOutput: result.expected_output,
        actualOutput: result.stdout || result.stderr || "No output",
        status: result.status.description,
        time: result.time,
        memory: result.memory,
      }));

      setConsoleOutput(JSON.stringify(formattedOutput, null, 2));
      setShowConsole(true);
    } catch (error) {
      setConsoleOutput(`Error: ${error.message}`);
      setShowConsole(true);
    } finally {
      setExecuting(false);
    }
  };

  const handleSubmitCode = async () => {
    setExecuting(true);
    setConsoleOutput("");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/submission/submit-code",
        {
          code,
          language: selectedLanguage,
          questionId,
          userId,
        }
      );

      setExecutionResult(response.data);
      setConsoleOutput(JSON.stringify(response.data.results, null, 2));
      setShowConsole(true);

      // Show success/failure message
      if (response.data.success) {
        alert("Congratulations! All test cases passed!");
      } else {
        alert("Some test cases failed. Check the console for details.");
      }
    } catch (error) {
      setConsoleOutput(`Error: ${error.message}`);
      setShowConsole(true);
    } finally {
      setExecuting(false);
    }
  };

  return (
    <Split
      className="split-container"
      direction="vertical"
      sizes={[60, 40]}
      minSize={[200, 100]} // Set minimum heights for top and bottom sections
      gutterSize={10} // Increase gutter size for easier dragging
      snapOffset={30} // Add snap offset to improve gutter behavior
      dragInterval={1} // Improve dragging granularity
    >
      <div className="code-editor">
        <CodeMirror
          theme={vscodeDark}
          className="code-mirror-editor"
          extensions={[getLanguageExtension(selectedLanguage)]}
          value={getDefaultCode(selectedLanguage)}
          onChange={handleCodeChange}
        />
      </div>

      <div className="testcase-container">
        <div className="testcase-heading">
          <div className="testcase-tab">
            <div className="testcase-tab-text">Testcases</div>
            <hr className="testcase-tab-line" />
          </div>
        </div>

        <div className="testcase-list">
          {testCases.map((_, index) => (
            <div
              key={index}
              className={`testcase-item ${
                index === selectedTestCase ? "active" : ""
              }`}
              onClick={() => setSelectedTestCase(index)}
            >
              <div>{`Case-${index + 1}`}</div>
            </div>
          ))}
        </div>

        {testCases[selectedTestCase] && (
          <div className="testcase-details">
            <p className="testcase-label">Input:</p>
            <div className="testcase-input">
              {testCases[selectedTestCase].input}
            </div>
            <p className="testcase-label">Output:</p>
            <div className="testcase-output">
              {testCases[selectedTestCase].output}
            </div>
          </div>
        )}

        {/* <div className="code-editor-footer">
          <div className="editor-footer-container">
            <div className="left-buttons">
              <button className="console-button">
                Console <BsChevronUp />
              </button>
            </div>
            <div className="right-buttons">
              <button className="run-button">Run</button>
              <button className="submit-code-button">Submit</button>
            </div>
          </div>
        </div> */}
        <div className="code-editor-footer">
          <div className="editor-footer-container">
            <div className="left-buttons">
              <button
                className={`console-button ${showConsole ? "active" : ""}`}
                onClick={() => setShowConsole(!showConsole)}
              >
                Console{" "}
                <BsChevronUp
                  style={{ transform: showConsole ? "rotate(180deg)" : "none" }}
                />
              </button>
            </div>
            <div className="right-buttons">
              <button
                className="run-button"
                onClick={handleRunCode}
                disabled={executing}
              >
                {executing ? "Running..." : "Run"}
              </button>
              <button
                className="submit-code-button"
                onClick={handleSubmitCode}
                disabled={executing}
              >
                {executing ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
        {showConsole && (
          <div className="console-output">
            <pre>{consoleOutput}</pre>
          </div>
        )}
      </div>
    </Split>
  );
};

export default CodeTestSplit;
