import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from "react-router-dom";

function generateShortCode() {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

function HomePage({ urls, setUrls }) {
  const [urlInput, setUrlInput] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCode = generateShortCode();
    const newUrl = { code: newCode, originalUrl: urlInput };
    setUrls([...urls, newUrl]);
    setUrlInput("");
  };

  return (
    <div className="container">
      <h2>URL Shortener</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          required
          placeholder="Enter URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />
        <button type="submit">Shorten URL</button>
      </form>
      <ul>
        {urls.map((item) => (
          <li key={item.code}>
            <Link to={`/r/${item.code}`}>
              {window.location.origin}/r/{item.code}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/stats">View Statistics</Link>
    </div>
  );
}

function StatisticsPage({ urls }) {
  return (
    <div className="container">
      <h2>Statistics</h2>
      {urls.length === 0 ? (
        <p>No URLs created yet.</p>
      ) : (
        <ul>
          {urls.map((item) => (
            <li key={item.code}>
              <div>
                <strong>Short URL:</strong> {window.location.origin}/r/{item.code}
              </div>
              <div>
                <strong>Original URL:</strong> {item.originalUrl}
              </div>
            </li>
          ))}
        </ul>
      )}
      <Link to="/">Back to Home</Link>
    </div>
  );
}

function RedirectPage({ urls }) {
  const { code } = useParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    const found = urls.find((item) => item.code === code);
    if (found) {
      window.location.href = found.originalUrl;
    } else {
      navigate("/");
    }
  }, [code, urls, navigate]);

  return <div>Redirecting...</div>;
}

export default function App() {
  const [urls, setUrls] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage urls={urls} setUrls={setUrls} />} />
        <Route path="/stats" element={<StatisticsPage urls={urls} />} />
        <Route path="/r/:code" element={<RedirectPage urls={urls} />} />
      </Routes>
    </BrowserRouter>
  );
}
