import { useState, useEffect } from "react";
import prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import axios from "axios";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum(a, b) {
  // Add two numbers
  return a + b;
}

// Example usage
const result = sum(5, 3);
console.log(result);`);

  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim()) {
      setError("Please enter some code to review");
      return;
    }

    setLoading(true);
    setError("");
    setReview("");

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
      const response = await axios.post(`${API_URL}/ai/get-review`, { code });
      setReview(response.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to get code review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function clearCode() {
    setCode("");
    setReview("");
    setError("");
  }

  return (
    <>
      <header className="app-header">
        <div className="header-content">
          <div className="header-title">
            <span className="header-icon">🤖</span>
            <h1>Codeyy</h1>
          </div>
          <p className="header-subtitle">
            Your Personal Code Reviewer and Peer 😊
          </p>
        </div>
      </header>

      <main>
        <div className="left">
          <div className="editor-header">
            <div className="editor-title">Code Editor</div>
            <div className="editor-actions">
              <button onClick={clearCode} title="Clear code">
                🗑️ Clear
              </button>
            </div>
          </div>

          <div className="code-wrapper">
            <div className="code">
              <Editor
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) =>
                  prism.highlight(
                    code,
                    prism.languages.javascript,
                    "javascript"
                  )
                }
                padding={10}
                style={{
                  fontFamily: '"Fira Code", "Fira Mono", monospace',
                  fontSize: 16,
                  height: "100%",
                  width: "100%",
                }}
              />
            </div>
          </div>

          <div className="review-button-container">
            <button
              onClick={reviewCode}
              className="review-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <span className="button-icon">✨</span>
                  <span>Review Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="right">
          <div className="review-header">
            <span className="review-header-icon">📋</span>
            <h2>Code Review Results</h2>
          </div>

          <div className={`review-content ${!review && !error ? "empty" : ""}`}>
            {error ? (
              <div style={{ color: "#f5576c" }}>
                <strong>Error:</strong> {error}
              </div>
            ) : review ? (
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            ) : (
              <>
                <div className="empty-icon">💡</div>
                <div className="empty-text">
                  Write or paste your code in the editor and click "Review Code"
                  to get AI-powered suggestions, best practices, and
                  improvements.
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;