// import React, { useState, useRef } from 'react';
// import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Paper,
//   Button,
//   Typography,
//   Box,
//   CircularProgress
// } from '@mui/material';
// import axios from 'axios';
// import TranscriptionPage from './TranscriptionPage';

// // Main App component that sets up routing
// function App() {
//   const [fileData, setFileData] = useState(null);
//   const [transcriptionData, setTranscriptionData] = useState(null);
//   const [segmentsData, setSegmentsData] = useState([]);

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/"
//           element={
//             <UploadPage
//               setFileData={setFileData}
//               setTranscriptionData={setTranscriptionData}
//               setSegmentsData={setSegmentsData}
//             />
//           }
//         />
//         <Route
//           path="/transcription"
//           element={
//             <TranscriptionPage
//               file={fileData}
//               transcription={transcriptionData}
//               segments={segmentsData}
//               setSegments={setSegmentsData}
//             />
//           }
//         />
//       </Routes>
//     </Router>
//   );
// }

// // Upload page component
// function UploadPage({ setFileData, setTranscriptionData, setSegmentsData }) {
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleFileUpload = async (event) => {
//     console.log("File upload handler triggered");
//     const uploadedFile = event.target.files[0];
//     if (!uploadedFile) {
//       console.log("No file selected");
//       return;
//     }

//     setFileData(uploadedFile);
//     console.log("File selected:", uploadedFile);

//     const formData = new FormData();
//     formData.append('file', uploadedFile);
//     console.log("FormData created with file");

//     setLoading(true);
//     try {
//       console.log("Sending request to backend...");
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error(`Server returned ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("Response received:", data);
//       setTranscriptionData(data.transcription);
//       setSegmentsData(data.segments);

//       // Redirect to transcription page after successful upload
//       navigate('/transcription');
//     } catch (error) {
//       console.error('Error uploading file:', error.message);
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//       } else if (error.request) {
//         console.error('No response received');
//       }
//     } finally {
//       setLoading(false);
//       console.log("Upload process completed");
//     }
//   };

//   return (
//     <Container maxWidth="md">
//       <Box sx={{ my: 4 }}>
//         <Typography variant="h4" component="h1" gutterBottom>
//           Audio Transcription Editor
//         </Typography>

//         <input
//           type="file"
//           accept="video/mp4,audio/*"
//           onChange={handleFileUpload}
//           id="file-upload"
//         />
//         <label htmlFor="file-upload">
//           <Button variant="contained" component="span">
//             Upload Audio
//           </Button>
//         </label>

//         {loading && (
//           <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
//             <CircularProgress />
//           </Box>
//         )}
//       </Box>
//     </Container>
//   );
// }

// export default App;

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