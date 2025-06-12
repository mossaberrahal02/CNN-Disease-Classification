import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  LinearProgress,
} from '@mui/material';
import { CloudUpload, PhotoCamera } from '@mui/icons-material';
import axios from 'axios';
import PredictionChart from './PredictionChart';

const API_BASE_URL = 'http://localhost:8000';

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setPrediction(null);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: false
  });

  const handlePredict = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during prediction');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getClassColor = (className) => {
    switch (className) {
      case 'Healthy': return 'success';
      case 'Early Blight': return 'warning';
      case 'Late Blight': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed #ccc',
          backgroundColor: isDragActive ? '#f0f0f0' : '#fafafa',
          cursor: 'pointer',
          mb: 3,
          '&:hover': {
            backgroundColor: '#f0f0f0',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragActive ? 'Drop the image here' : 'Drag & drop an image here, or click to select'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Supported formats: JPEG, PNG, BMP, TIFF
        </Typography>
      </Paper>

      {preview && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={preview}
                alt="Preview"
                sx={{ objectFit: 'contain' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                </Typography>
                <Button
                  variant="contained"
                  onClick={handlePredict}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <PhotoCamera />}
                  sx={{ mt: 2 }}
                  fullWidth
                >
                  {loading ? 'Analyzing...' : 'Predict Disease'}
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {prediction && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Prediction Results
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={prediction.predicted_class}
                      color={getClassColor(prediction.predicted_class)}
                      size="large"
                      sx={{ mb: 2, fontSize: '1.1rem', fontWeight: 'bold' }}
                    />
                    
                    <Typography variant="body1" gutterBottom>
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </Typography>
                    
                    <LinearProgress
                      variant="determinate"
                      value={prediction.confidence * 100}
                      color={getConfidenceColor(prediction.confidence)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  <Typography variant="subtitle1" gutterBottom>
                    All Class Probabilities:
                  </Typography>
                  
                  <PredictionChart probabilities={prediction.class_probabilities} />
                  
                  <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                    Analyzed on: {new Date(prediction.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ImageUploader;
