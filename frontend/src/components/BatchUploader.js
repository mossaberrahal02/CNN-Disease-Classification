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
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { CloudUpload, BatchPrediction, ExpandMore } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const BatchUploader = () => {
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    setResults(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: true,
    maxFiles: 10
  });

  const handleBatchPredict = async () => {
    if (files.length === 0) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${API_BASE_URL}/predict/batch`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during batch prediction');
    } finally {
      setLoading(false);
    }
  };

  const getClassColor = (className) => {
    switch (className) {
      case 'Healthy': return 'success';
      case 'Early Blight': return 'warning';
      case 'Late Blight': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    return status === 'success' ? 'success' : 'error';
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
          {isDragActive ? 'Drop the images here' : 'Drag & drop multiple images here, or click to select'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Maximum 10 files. Supported formats: JPEG, PNG, BMP, TIFF
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Selected Files ({files.length}/10)
            </Typography>
            <Grid container spacing={1} sx={{ mb: 2 }}>
              {files.map((file, index) => (
                <Grid item key={index}>
                  <Chip
                    label={file.name}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              ))}
            </Grid>
            <Button
              variant="contained"
              onClick={handleBatchPredict}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <BatchPrediction />}
              fullWidth
            >
              {loading ? 'Processing Images...' : `Predict All ${files.length} Images`}
            </Button>
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {results && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Batch Prediction Results
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {results.total_files}
                  </Typography>
                  <Typography variant="body2">Total Files</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {results.successful_predictions}
                  </Typography>
                  <Typography variant="body2">Successful</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {results.failed_predictions}
                  </Typography>
                  <Typography variant="body2">Failed</Typography>
                </Paper>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Filename</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Predicted Class</TableCell>
                    <TableCell>Confidence</TableCell>
                    <TableCell>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.filename}</TableCell>
                      <TableCell>
                        <Chip
                          label={result.status || (result.error ? 'error' : 'success')}
                          color={getStatusColor(result.status || (result.error ? 'error' : 'success'))}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {result.predicted_class ? (
                          <Chip
                            label={result.predicted_class}
                            color={getClassColor(result.predicted_class)}
                            size="small"
                          />
                        ) : (
                          result.error || 'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {result.confidence ? `${(result.confidence * 100).toFixed(1)}%` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {result.class_probabilities && (
                          <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                              <Typography variant="body2">View Probabilities</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box>
                                {Object.entries(result.class_probabilities).map(([className, prob]) => (
                                  <Typography key={className} variant="body2">
                                    {className}: {(prob * 100).toFixed(1)}%
                                  </Typography>
                                ))}
                              </Box>
                            </AccordionDetails>
                          </Accordion>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              Processed on: {new Date(results.timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BatchUploader;
