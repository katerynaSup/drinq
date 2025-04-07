import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import UploadPage from './components/UploadPage';
import TranscriptionPage from './components/TranscriptionPage';
import './styles/App.css';

function App() {
  const [fileData, setFileData] = useState(null);
  const [transcriptionData, setTranscriptionData] = useState(null);
  const [segmentsData, setSegmentsData] = useState([]);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/upload"
            element={
              <UploadPage
                setFileData={setFileData}
                setTranscriptionData={setTranscriptionData}
                setSegmentsData={setSegmentsData}
              />
            }
          />
          <Route
            path="/transcription"
            element={
              transcriptionData ? (
                <TranscriptionPage
                  file={fileData}
                  transcription={transcriptionData}
                  segments={segmentsData}
                  setSegments={setSegmentsData}
                />
              ) : (
                <Navigate to="/upload" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;