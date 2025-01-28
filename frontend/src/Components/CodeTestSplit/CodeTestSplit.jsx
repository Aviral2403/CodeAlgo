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

  // Comprehensive default templates for common languages
  const getDefaultCode = (language) => {
    const defaultTemplates = {
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        return {};
    }
};`,
      c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // Your solution here
    *returnSize = 0;
    return NULL;
}`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[]{};
    }
}`,
      python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your solution here
        return []`,
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Your solution here
    return [];
};`
    };

    return defaultTemplates[language] || defaultTemplates.javascript;
  };

  // Get appropriate language extension for CodeMirror
  const getLanguageExtension = (language) => {
    const languageExtensions = {
      cpp: cpp(),
      c: cpp(), // C uses cpp extension in CodeMirror
      java: java(),
      python: python(),
      javascript: javascript()
    };

    return languageExtensions[language] || javascript();
  };

  // Fetch problem details and set initial code
  useEffect(() => {
    if (questionId) {
      setLoading(true);
      axios
        .get(`http://localhost:8000/api/code/get-description/${questionId}`)
        .then((response) => {
          // Set test cases
          setTestCases(
            response.data.input.map((input, index) => ({
              input,
              output: response.data.output[index],
            }))
          );

          // Prioritize starter templates from backend
          const starterTemplates = response.data.starterTemplates || {};
          const languageTemplate = starterTemplates[selectedLanguage];
          
          // Set code: use language-specific template if available, else use default
          setCode(languageTemplate || getDefaultCode(selectedLanguage));
        })
        .catch((error) => {
          console.error("Error fetching test cases:", error);
          setError("Failed to load test cases");
          
          // Fallback to default code if fetch fails
          setCode(getDefaultCode(selectedLanguage));
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [questionId, selectedLanguage]);

  // Handle code changes in editor
  const handleCodeChange = (value) => {
    setCode(value);
  };

  


  const handleRunCode = async () => {
    setExecuting(true);
    setConsoleOutput("");
    try {
      // Encode the code in Base64
      const base64Code = btoa(code);
  
      const response = await axios.post(
        "http://localhost:8000/api/submission/submit-code",
        {
          code: base64Code,
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
      const base64Code = btoa(code);
      const response = await axios.post(
        "http://localhost:8000/api/submission/submit-code",
        {
          code: base64Code,
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

  // Render loading state
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
        <Loader />
      </div>
    );
  }

  // Render error state
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

  return (
    <Split
      className="split-container"
      direction="vertical"
      sizes={[60, 40]}
      minSize={[200, 100]}
      gutterSize={10}
      snapOffset={30}
      dragInterval={1}
    >
      <div className="code-editor">
        <CodeMirror
          theme={vscodeDark}
          className="code-mirror-editor"
          extensions={[getLanguageExtension(selectedLanguage)]}
          value={code}
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
