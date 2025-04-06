// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     Container,
//     Paper,
//     Button,
//     Typography,
//     Box,
//     Divider
// } from '@mui/material';
// import axios from 'axios';

// function TranscriptionPage({ file, transcription, segments, setSegments }) {
//     const navigate = useNavigate();

//     const handleDeleteSegment = (index) => {
//         const newSegments = segments.filter((_, i) => i !== index);
//         setSegments(newSegments);
//     };

//     const handleSaveEdit = async () => {
//         try {
//             const response = await axios.post('/api/edit-audio', {
//                 filename: file.name,
//                 segments: segments
//             }, {
//                 responseType: 'blob'
//             });

//             const url = window.URL.createObjectURL(new Blob([response.data]));
//             const link = document.createElement('a');
//             link.href = url;
//             link.setAttribute('download', `edited_${file.name}`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//         } catch (error) {
//             console.error('Error saving edit:', error);
//         }
//     };

//     const handleBackToUpload = () => {
//         navigate('/');
//     };

//     return (




//         <Container maxWidth="md">
//             <Box sx={{ my: 4 }}>
//                 <Typography variant="h4" component="h1" gutterBottom>
//                     Transcription Results
//                 </Typography>

//                 <Button
//                     variant="outlined"
//                     onClick={handleBackToUpload}
//                     sx={{ mb: 3 }}
//                 >
//                     Back to Upload
//                 </Button>

//                 <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
//                     <Typography variant="h6" gutterBottom>
//                         Full Transcription
//                     </Typography>
//                     <Typography paragraph>{transcription}</Typography>
//                 </Paper>

//                 <Paper sx={{ p: 3 }} elevation={2}>
//                     <Typography variant="h6" gutterBottom>
//                         Editable Segments
//                     </Typography>
//                     <Divider sx={{ mb: 2 }} />

//                     {segments.map((segment, index) => (
//                         <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
//                             <Typography>
//                                 {segment.text}
//                                 <Button
//                                     size="small"
//                                     color="error"
//                                     onClick={() => handleDeleteSegment(index)}
//                                     sx={{ ml: 1 }}
//                                 >
//                                     Delete
//                                 </Button>
//                             </Typography>
//                             <Typography variant="caption" color="text.secondary">
//                                 {segment.start}s - {segment.end}s
//                             </Typography>
//                         </Box>
//                     ))}

//                     <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={handleSaveEdit}
//                         sx={{ mt: 2 }}
//                         disabled={!segments.length}
//                     >
//                         Save Edited Audio
//                     </Button>
//                 </Paper>
//             </Box>
//         </Container>
//     );
// }

// export default TranscriptionPage; 


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TranscriptionPage.css';
import {
    Container,
    Paper,
    Button,
    Typography,
    Box,
    Divider
} from '@mui/material';
import axios from 'axios';

function TranscriptionPage({ file, transcription, segments, setSegments }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('transcript');
  const [selectedVoices, setSelectedVoices] = useState([]);
  const [filterOpen, setFilterOpen] = useState(false);

  const handleDeleteSegment = (index) => {
    const newSegments = segments.filter((_, i) => i !== index);
    setSegments(newSegments);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch('/api/edit-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: file.name,
          segments: segments
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `edited_${file.name}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error saving edit:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const getNoiseLabel = (segment) => {
    if (segment.text.includes('sponsor')) return 'Sponsor';
    if (segment.end - segment.start > 3) return 'Long Pause';
    return 'Static';
  };

  return (
    <div className="transcription-container">
      <div className="tabs-container">
        <div 
          className={`tab ${activeTab === 'transcript' ? 'active' : ''}`}
          onClick={() => setActiveTab('transcript')}
        >
          Transcript
        </div>
        
        <div 
          className={`tab ${activeTab === 'noise' ? 'active' : ''}`}
          onClick={() => setActiveTab('noise')}
        >
          Noise Classifier
        </div>
      </div>

      <div className="content-area">
        <div className="sidebar">
          <div className="filter-section">
            <h3>Filters</h3>
            
            <div className="filter-item" onClick={() => setFilterOpen(!filterOpen)}>
              <div className="filter-header">
                <span>Voices (2)</span>
                <svg className="filter-icon" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>
            
            <div className="filter-item">
              <div className="filter-header">
                <span>Lables</span>
                <svg className="filter-icon" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="transcript-area">
          {segments.map((segment, index) => {
            const isVoice1 = index % 2 === 0;
            const voiceLabel = isVoice1 ? 'Voice 1:' : 'Voice 2:';
            const time = formatTime(segment.start);
            const noiseLabel = getNoiseLabel(segment);
            
            return (
              <div className="segment" key={index}>
                <div className="segment-header">
                  <div className="voice-label">{voiceLabel}</div>
                  <div className="time-label">{time}</div>
                  {noiseLabel && (
                    <div className={`noise-tag ${noiseLabel.toLowerCase().replace(' ', '-')}`}>
                      {noiseLabel}
                    </div>
                  )}
                </div>
                <div className="segment-text">{segment.text}</div>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteSegment(index)}
                  sx={{ ml: 1 }}>
                  Delete
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="actions-bar">
        <button 
          className="secondary-button"
          onClick={() => navigate('/upload')}
        >
          To upload another video
        </button>

        <button 
          className="secondary-button"
          onClick={() => handleSaveEdit()}
        >
          Save new audio
        </button>
        
      </div>
    </div>
  );
}

export default TranscriptionPage;