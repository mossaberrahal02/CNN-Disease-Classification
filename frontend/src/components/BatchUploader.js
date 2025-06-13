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

const API_BASE_URL = 'http://172.189.136.13:8000';

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
      setError(err.response?.data?.detail || 'Une erreur s\'est produite lors de la prédiction par lot');
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
  const translateClassName = (className) => {
    switch (className) {
      case 'Healthy': return 'Saine';
      case 'Early Blight': return 'Mildiou Précoce';
      case 'Late Blight': return 'Brûlure Tardive';
      default: return className;
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case 'success': return 'succès';
      case 'error': return 'erreur';
      default: return status;
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
          {isDragActive ? 'Déposez les images ici' : 'Glissez-déposez plusieurs images ici, ou cliquez pour sélectionner'}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Maximum 10 fichiers. Formats supportés : JPEG, PNG, BMP, TIFF
        </Typography>
      </Paper>

      {files.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Fichiers Sélectionnés ({files.length}/10)
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
              {loading ? 'Traitement des Images...' : `Prédire Toutes les ${files.length} Images`}
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
              Résultats de Prédiction par Lot
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {results.total_files}
                  </Typography>
                  <Typography variant="body2">Total Fichiers</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="success.main">
                    {results.successful_predictions}
                  </Typography>
                  <Typography variant="body2">Réussis</Typography>
                </Paper>
              </Grid>
              <Grid item xs={4}>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {results.failed_predictions}
                  </Typography>
                  <Typography variant="body2">Échoués</Typography>
                </Paper>
              </Grid>
            </Grid>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nom du Fichier</TableCell>
                    <TableCell>Statut</TableCell>
                    <TableCell>Classe Prédite</TableCell>
                    <TableCell>Confiance</TableCell>
                    <TableCell>Détails</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.results.map((result, index) => (
                    <TableRow key={index}>
                      <TableCell>{result.filename}</TableCell>
                      <TableCell>
                        <Chip
                          label={translateStatus(result.status || (result.error ? 'error' : 'success'))}
                          color={getStatusColor(result.status || (result.error ? 'error' : 'success'))}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {result.predicted_class ? (
                          <Chip
                            label={translateClassName(result.predicted_class)}
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
                              <Typography variant="body2">Voir les Probabilités</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Box>
                                {Object.entries(result.class_probabilities).map(([className, prob]) => (
                                  <Typography key={className} variant="body2">
                                    {translateClassName(className)}: {(prob * 100).toFixed(1)}%
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
              Traité le : {new Date(results.timestamp).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BatchUploader;
