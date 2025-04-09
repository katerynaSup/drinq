import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Slider,
    FormControl,
    FormLabel,
    FormGroup,
    Checkbox,
    FormControlLabel,
    Button,
    Paper,
    Chip
} from '@mui/material';
import '../styles/PreferenceForm.css'; // Create this file for custom styles

function PreferenceForm({ onSubmit }) {
    const [preferences, setPreferences] = useState({
        spirits: {
            vodka: false,
            rum: false,
            gin: false,
            whiskey: false,
            tequila: false,
            brandy: false,
            none: false,
        },
        flavors: {
            sweet: 0,
            sour: 0,
            bitter: 0,
            fruity: 0,
            herbal: 0,
            spicy: 0,
        },
        complexity: 3, // 1-5 scale
        occasion: null, // 'casual', 'party', 'dinner', 'date'
    });

    const handleSpiritChange = (event) => {
        setPreferences({
            ...preferences,
            spirits: {
                ...preferences.spirits,
                [event.target.name]: event.target.checked,
            },
        });
    };

    const handleFlavorChange = (flavor, value) => {
        setPreferences({
            ...preferences,
            flavors: {
                ...preferences.flavors,
                [flavor]: value,
            },
        });
    };

    const handleComplexityChange = (event, value) => {
        setPreferences({
            ...preferences,
            complexity: value,
        });
    };

    const handleOccasionSelect = (occasion) => {
        setPreferences({
            ...preferences,
            occasion,
        });
    };

    const handleSubmit = () => {
        onSubmit(preferences);
    };

    return (
        <div className="page-container preference-form-container">
            <Container maxWidth={false} className="full-width-container">
                <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4, width: '100%' }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        What would you like to drink today?
                    </Typography>

                    <Box my={4}>
                        <FormControl component="fieldset" fullWidth>
                            <FormLabel component="legend">Choose your preferred spirits</FormLabel>
                            <FormGroup row>
                                {Object.keys(preferences.spirits).map((spirit) => (
                                    <FormControlLabel
                                        key={spirit}
                                        control={
                                            <Checkbox
                                                checked={preferences.spirits[spirit]}
                                                onChange={handleSpiritChange}
                                                name={spirit}
                                            />
                                        }
                                        label={spirit.charAt(0).toUpperCase() + spirit.slice(1)}
                                    />
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Box>

                    <Box my={4}>
                        <Typography gutterBottom>Flavor Intensity</Typography>
                        {Object.keys(preferences.flavors).map((flavor) => (
                            <Box key={flavor} mb={2}>
                                <Typography id={`${flavor}-slider`}>
                                    {flavor.charAt(0).toUpperCase() + flavor.slice(1)}
                                </Typography>
                                <Slider
                                    value={preferences.flavors[flavor]}
                                    onChange={(e, val) => handleFlavorChange(flavor, val)}
                                    aria-labelledby={`${flavor}-slider`}
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={0}
                                    max={5}
                                />
                            </Box>
                        ))}
                    </Box>

                    <Box my={4}>
                        <Typography gutterBottom>Drink Complexity</Typography>
                        <Slider
                            value={preferences.complexity}
                            onChange={handleComplexityChange}
                            aria-labelledby="complexity-slider"
                            valueLabelDisplay="auto"
                            step={1}
                            marks
                            min={1}
                            max={5}
                        />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption">Simple</Typography>
                            <Typography variant="caption">Complex</Typography>
                        </Box>
                    </Box>

                    <Box my={4}>
                        <Typography gutterBottom>Occasion</Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                            {['casual', 'party', 'dinner', 'date'].map((occasion) => (
                                <Chip
                                    key={occasion}
                                    label={occasion.charAt(0).toUpperCase() + occasion.slice(1)}
                                    onClick={() => handleOccasionSelect(occasion)}
                                    color={preferences.occasion === occasion ? "primary" : "default"}
                                    clickable
                                />
                            ))}
                        </Box>
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleSubmit}
                        fullWidth
                    >
                        Find My Drinks
                    </Button>
                </Paper>
            </Container>
        </div>
    );
}

export default PreferenceForm;