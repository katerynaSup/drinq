import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/UploadPage.css';

function UploadPage({ setFileData, setTranscriptionData, setSegmentsData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile) return;

    setFileData(uploadedFile);
    setError(null);
    const formData = new FormData();
    formData.append('file', uploadedFile);

    setLoading(true);
    try {
      console.log("Sending file to server:", uploadedFile.name);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', response.status, errorData);
        throw new Error(`Server error: ${response.status} ${errorData.detail || ''}`);
      }

      const data = await response.json();
      console.log("Received data:", data);
      setTranscriptionData(data.transcription);
      setSegmentsData(data.segments);

      navigate('/transcription');
    } catch (error) {
      console.error('Error uploading file:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="upload-container">
      <h1 className="upload-title">To get started, upload your audio file</h1>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="video/mp4,audio/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      
      <button 
        className="upload-button" 
        onClick={triggerFileInput}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Upload'}
        {!loading && (
          <svg className="upload-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z"/>
          </svg>
        )}
      </button>
      
      {loading && <div className="loader"></div>}
      
      {error && (
        <div className="error-message" style={{ marginTop: '20px', color: 'red' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
}

export default UploadPage;