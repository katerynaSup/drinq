import React from 'react';
import { useNavigate } from 'react-router-dom';
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

    const handleDeleteSegment = (index) => {
        const newSegments = segments.filter((_, i) => i !== index);
        setSegments(newSegments);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.post('/api/edit-audio', {
                filename: file.name,
                segments: segments
            }, {
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
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

    const handleBackToUpload = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Transcription Results
                </Typography>

                <Button
                    variant="outlined"
                    onClick={handleBackToUpload}
                    sx={{ mb: 3 }}
                >
                    Back to Upload
                </Button>

                <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
                    <Typography variant="h6" gutterBottom>
                        Full Transcription
                    </Typography>
                    <Typography paragraph>{transcription}</Typography>
                </Paper>

                <Paper sx={{ p: 3 }} elevation={2}>
                    <Typography variant="h6" gutterBottom>
                        Editable Segments
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {segments.map((segment, index) => (
                        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography>
                                {segment.text}
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleDeleteSegment(index)}
                                    sx={{ ml: 1 }}
                                >
                                    Delete
                                </Button>
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {segment.start}s - {segment.end}s
                            </Typography>
                        </Box>
                    ))}

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveEdit}
                        sx={{ mt: 2 }}
                        disabled={!segments.length}
                    >
                        Save Edited Audio
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}

export default TranscriptionPage; 