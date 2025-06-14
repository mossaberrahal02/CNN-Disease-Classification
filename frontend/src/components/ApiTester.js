import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Send, Code } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://172.189.136.13';

const API_ENDPOINTS = [
  { path: '/', method: 'GET', description: 'Point d\'entrée principal' },
  { path: '/ping', method: 'GET', description: 'Test de ping' },
  { path: '/health', method: 'GET', description: 'Vérification de santé' },
  { path: '/classes', method: 'GET', description: 'Classes disponibles' },
];

const ApiTester = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/ping');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const startTime = Date.now();
      const result = await axios.get(`${API_BASE_URL}${selectedEndpoint}`);
      const endTime = Date.now();
      
      setResponse({
        data: result.data,
        status: result.status,
        statusText: result.statusText,
        responseTime: endTime - startTime,
        headers: result.headers,
      });
    } catch (err) {
      setError({
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>        <CardContent>
          <Typography variant="h6" gutterBottom>
            Testeur de Point d'Accès API
          </Typography>
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
                <InputLabel>Sélectionner un Point d'Accès</InputLabel>
                <Select
                  value={selectedEndpoint}
                  label="Sélectionner un Point d'Accès"
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                >
                  {API_ENDPOINTS.map((endpoint) => (
                    <MenuItem key={endpoint.path} value={endpoint.path}>
                      {endpoint.method} {endpoint.path} - {endpoint.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                onClick={handleTest}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Send />}
                fullWidth
              >
                {loading ? 'Test en cours...' : 'Tester le Point d\'Accès'}
              </Button>
            </Grid>
          </Grid>
          
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Testez les points d'accès API individuels pour vérifier leur fonctionnement
          </Typography>
        </CardContent>
      </Card>      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">
            Erreur {error.status}: {error.statusText || error.message}
          </Typography>
          {error.data && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {JSON.stringify(error.data, null, 2)}
            </Typography>
          )}
        </Alert>
      )}

      {response && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Réponse
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={3}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main">
                    {response.status}
                  </Typography>                  <Typography variant="caption">Statut</Typography>
                </Paper>
              </Grid>
              <Grid item xs={3}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.main">
                    {response.responseTime}ms
                  </Typography>
                  <Typography variant="caption">Temps de Réponse</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper sx={{ p: 1, textAlign: 'center' }}>
                  <Typography variant="body2" fontWeight="bold">
                    {response.statusText}
                  </Typography>
                  <Typography variant="caption">Texte de Statut</Typography>
                </Paper>
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              <Code sx={{ verticalAlign: 'middle', mr: 1 }} />
              Données de Réponse :
            </Typography>
            
            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="body2" component="pre" sx={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'monospace',
                maxHeight: '400px',
                overflow: 'auto'
              }}>
                {JSON.stringify(response.data, null, 2)}
              </Typography>
            </Paper>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ApiTester;
