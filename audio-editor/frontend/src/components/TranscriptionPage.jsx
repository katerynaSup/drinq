import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TranscriptionPage.css';
import {
    Container,
    Paper,
    Button,
    Typography,
    Box,
    Divider,
    TextField,
    Chip,
    InputAdornment,
    IconButton,
    Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UndoIcon from '@mui/icons-material/Undo';
// import axios from 'axios';

function TranscriptionPage({ file, transcription, segments, setSegments }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('transcript');
    const [selectedVoices, setSelectedVoices] = useState([]);
    const [filterOpen, setFilterOpen] = useState(false);

    // New state for custom labels
    const [customLabels, setCustomLabels] = useState(['Off-topic', 'Important', 'Question']);
    const [newLabelText, setNewLabelText] = useState('');
    const [selectedSegments, setSelectedSegments] = useState([]);

    // New state for user instruction input
    const [labelingInstruction, setLabelingInstruction] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    // New state for word-level editing
    const [editHistory, setEditHistory] = useState([]); // For undo functionality
    const [selectedWord, setSelectedWord] = useState(null);
    const [segmentsCopy, setSegmentsCopy] = useState([]);

    // Initialize segmentsCopy with the original segments
    useEffect(() => {
        // Deep copy the segments to avoid reference issues
        setSegmentsCopy(JSON.parse(JSON.stringify(segments)));
    }, [segments]);

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

    // New function to add a custom label
    const handleAddCustomLabel = () => {
        if (newLabelText.trim() && !customLabels.includes(newLabelText.trim())) {
            setCustomLabels([...customLabels, newLabelText.trim()]);
            setNewLabelText('');
        }
    };

    // New function to toggle segment selection
    const toggleSegmentSelection = (index) => {
        console.log('Toggling segment selection:', index);
        if (selectedSegments.includes(index)) {
            setSelectedSegments(selectedSegments.filter(i => i !== index));
        } else {
            setSelectedSegments([...selectedSegments, index]);
        }
        console.log('Selected segments after toggle:',
            selectedSegments.includes(index)
                ? selectedSegments.filter(i => i !== index)
                : [...selectedSegments, index]);
    };

    // New function to apply a label to selected segments
    const applyLabelToSelectedSegments = (label) => {
        // First, create a deep copy of the segments array
        const updatedSegments = JSON.parse(JSON.stringify(segments));

        // Apply the label to each selected segment
        selectedSegments.forEach(index => {
            // Make sure the segment exists
            if (updatedSegments[index]) {
                // Initialize labels array if it doesn't exist
                if (!updatedSegments[index].labels) {
                    updatedSegments[index].labels = [];
                }

                // Only add the label if it doesn't already exist
                if (!updatedSegments[index].labels.includes(label)) {
                    updatedSegments[index].labels.push(label);
                }
            }
        });

        // Update the segments state
        setSegments(updatedSegments);

        // Clear selection after applying
        setSelectedSegments([]);

        // Log for debugging
        console.log('Labels applied:', label);
        console.log('Updated segments:', updatedSegments);
    };

    // New function to search segments based on the labeling instruction
    const searchSegmentsBasedOnInstruction = () => {
        if (!labelingInstruction.trim()) return;

        // Simple search implementation - could be replaced with more advanced NLP in the future
        const searchTerms = labelingInstruction.toLowerCase().split(' ');
        const matchedIndices = segments
            .map((segment, index) => {
                // Check if segment text contains any of the search terms
                const matches = searchTerms.some(term =>
                    segment.text.toLowerCase().includes(term) &&
                    // Exclude terms like "label", "mark", "identify" from the matching
                    !['label', 'mark', 'identify', 'segments', 'that', 'are'].includes(term)
                );
                return matches ? index : -1;
            })
            .filter(index => index !== -1);

        setSearchResults(matchedIndices);
        setSelectedSegments(matchedIndices);
    };

    // Update the handleWordClick function to include a delete button
    const handleWordClick = (segmentIndex, wordIndex, word, event) => {
        event.stopPropagation();
        setSelectedWord({ segmentIndex, wordIndex, word });

        // Log for debugging
        console.log('Word selected:', word, 'at segment', segmentIndex, 'word index', wordIndex);
    };

    // Add a more direct way to delete words
    const deleteSelectedWord = () => {
        if (!selectedWord) return;

        console.log('Attempting to delete word:', selectedWord);

        const { segmentIndex, wordIndex } = selectedWord;

        // Save current state for undo
        setEditHistory([...editHistory, JSON.parse(JSON.stringify(segments))]);

        // Create a new copy of segments
        const updatedSegments = JSON.parse(JSON.stringify(segments));

        // Make sure the segment exists
        if (!updatedSegments[segmentIndex]) {
            console.error('Segment not found:', segmentIndex);
            return;
        }

        // Get the segment
        const segment = updatedSegments[segmentIndex];

        // Split text into words
        const words = segment.text.split(/\s+/);
        console.log('Words before deletion:', words);

        // Check if wordIndex is valid
        if (wordIndex < 0 || wordIndex >= words.length) {
            console.error('Invalid word index:', wordIndex);
            return;
        }

        // Remove the selected word
        const removedWord = words.splice(wordIndex, 1)[0];
        console.log('Removed word:', removedWord);

        // Join words back to text
        segment.text = words.join(' ');
        console.log('Updated text:', segment.text);

        // Calculate word timing (approximate)
        const segmentDuration = segment.end - segment.start;
        const wordDuration = segmentDuration / (words.length + 1); // +1 because we removed a word

        // Update segment end time to reflect the removed word
        segment.end -= wordDuration;

        // Update segments
        console.log('Setting updated segments');
        setSegments(updatedSegments);
        setSelectedWord(null);
    };

    // Handle key press for delete and backspace
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (selectedWord && (e.key === 'Delete' || e.key === 'Backspace')) {
                deleteSelectedWord();
                e.preventDefault();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [selectedWord]);

    // Undo function
    const handleUndo = () => {
        if (editHistory.length === 0) return;

        // Get the last state
        const lastState = editHistory[editHistory.length - 1];

        // Update segments to the previous state
        setSegments(lastState);

        // Remove the last state from history
        setEditHistory(editHistory.slice(0, -1));
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

                <div
                    className={`tab ${activeTab === 'labels' ? 'active' : ''}`}
                    onClick={() => setActiveTab('labels')}
                >
                    Custom Labels
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
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                        </div>

                        <div className="filter-item">
                            <div className="filter-header">
                                <span>Labels</span>
                                <svg className="filter-icon" viewBox="0 0 24 24">
                                    <path d="M7 10l5 5 5-5z" />
                                </svg>
                            </div>
                        </div>

                        {/* New custom labels section */}
                        {activeTab === 'labels' && (
                            <div className="label-management">
                                <h4>Auto-Labeling</h4>
                                {/* New user input field for labeling instructions */}
                                <div className="labeling-instruction">
                                    <TextField
                                        fullWidth
                                        size="small"
                                        value={labelingInstruction}
                                        onChange={(e) => setLabelingInstruction(e.target.value)}
                                        placeholder="E.g., label segments that are off-topic"
                                        margin="dense"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={searchSegmentsBasedOnInstruction}
                                                        edge="end"
                                                    >
                                                        <SearchIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <Typography variant="caption" sx={{ display: 'block', mb: 1, mt: 0.5 }}>
                                        Enter instructions like "label segments about weather" and click search
                                    </Typography>
                                </div>

                                <h4>Custom Labels</h4>
                                <div className="add-label-form">
                                    <TextField
                                        size="small"
                                        value={newLabelText}
                                        onChange={(e) => setNewLabelText(e.target.value)}
                                        placeholder="New label name"
                                        fullWidth
                                        margin="dense"
                                    />
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={handleAddCustomLabel}
                                        sx={{ mt: 1 }}
                                    >
                                        Add Label
                                    </Button>
                                </div>

                                <div className="custom-labels-list">
                                    <h4>Available Labels:</h4>
                                    <div className="label-chips">
                                        {customLabels.map((label, idx) => (
                                            <Chip
                                                key={idx}
                                                label={label}
                                                onClick={() => applyLabelToSelectedSegments(label)}
                                                color="primary"
                                                variant="outlined"
                                                sx={{ m: 0.5 }}
                                            />
                                        ))}
                                    </div>

                                    {selectedSegments.length > 0 && (
                                        <Typography variant="body2" sx={{ mt: 2 }}>
                                            {selectedSegments.length} segment(s) selected.
                                            Click a label above to apply.
                                        </Typography>
                                    )}

                                    {searchResults.length > 0 && (
                                        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                                            Found {searchResults.length} segments matching your search.
                                        </Typography>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="edit-controls">
                            <h3>Edit Controls</h3>
                            <div className="edit-instructions">
                                <Typography variant="body2">
                                    Click on any word to select it. Then click the × button to delete it.
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    You can also press Delete or Backspace to remove selected words.
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                    Deleted words will be removed from the audio when you save.
                                </Typography>
                            </div>

                            <div className="edit-actions" style={{ marginTop: '16px' }}>
                                <Tooltip title="Undo last edit">
                                    <span>
                                        <IconButton
                                            onClick={handleUndo}
                                            disabled={editHistory.length === 0}
                                            color="primary"
                                        >
                                            <UndoIcon />
                                        </IconButton>
                                    </span>
                                </Tooltip>
                                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                    {editHistory.length} {editHistory.length === 1 ? 'change' : 'changes'} in history
                                </Typography>
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
                        const isSelected = selectedSegments.includes(index);
                        const isSearchResult = searchResults.includes(index);

                        // Split segment text into words
                        const words = segment.text.split(/\s+/);

                        return (
                            <div
                                className={`segment ${isSelected ? 'selected' : ''} ${isSearchResult ? 'search-result' : ''}`}
                                key={index}
                                onClick={() => activeTab === 'labels' && toggleSegmentSelection(index)}
                            >
                                <div className="segment-header">
                                    <div className="voice-label">{voiceLabel}</div>
                                    <div className="time-label">{time}</div>
                                    {noiseLabel && (
                                        <div className={`noise-tag ${noiseLabel.toLowerCase().replace(' ', '-')}`}>
                                            {noiseLabel}
                                        </div>
                                    )}

                                    {/* Display custom labels for this segment */}
                                    {segment.labels && segment.labels.map((label, labelIdx) => (
                                        <div key={labelIdx} className="custom-label-tag">
                                            {label}
                                        </div>
                                    ))}
                                </div>
                                <div className="segment-text">
                                    {words.map((word, wordIndex) => (
                                        <span
                                            key={wordIndex}
                                            className={`editable-word ${selectedWord &&
                                                selectedWord.segmentIndex === index &&
                                                selectedWord.wordIndex === wordIndex
                                                ? 'selected-word'
                                                : ''
                                                }`}
                                            onClick={(e) => handleWordClick(index, wordIndex, word, e)}
                                        >
                                            {word}{' '}
                                            {selectedWord &&
                                                selectedWord.segmentIndex === index &&
                                                selectedWord.wordIndex === wordIndex && (
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        variant="outlined"
                                                        sx={{ ml: 1, py: 0, minWidth: '30px', height: '22px', fontSize: '10px' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteSelectedWord();
                                                        }}
                                                    >
                                                        ×
                                                    </Button>
                                                )}
                                        </span>
                                    ))}
                                </div>
                                <div className="segment-actions">
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteSegment(index);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </div>
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