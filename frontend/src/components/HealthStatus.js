import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Refresh, CheckCircle, Error, Warning } from '@mui/icons-material';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const HealthStatus = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_BASE_URL}/health`);
      setHealth(response.data);
      setLastChecked(new Date());
    } catch (err) {
      setError('Unable to connect to the API server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle color="success" />;
      case 'unhealthy':
        return <Error color="error" />;
      default:
        return <Warning color="warning" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'unhealthy':
        return 'error';
      default:
        return 'warning';
    }
  };

  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ mb: 3 }}
        action={
          <IconButton
            color="inherit"
            size="small"
            onClick={fetchHealth}
          >
            <Refresh />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" justifyContent="between" alignItems="center" mb={2}>
          <Typography variant="h6">
            System Health Status
          </Typography>
          <Tooltip title="Refresh status">
            <IconButton onClick={fetchHealth} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={2}>
            <CircularProgress size={24} />
          </Box>
        ) : health ? (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                {getStatusIcon(health.status)}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <Chip
                    label={health.status}
                    color={getStatusColor(health.status)}
                    size="small"
                  />
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  API Status
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                {health.model_loaded ? (
                  <CheckCircle color="success" />
                ) : (
                  <Error color="error" />
                )}
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <Chip
                    label={health.model_loaded ? 'Loaded' : 'Not Loaded'}
                    color={health.model_loaded ? 'success' : 'error'}
                    size="small"
                  />
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Model Status
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="body1" fontWeight="bold">
                  {health.tensorflow_version}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  TensorFlow Version
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Box textAlign="center">
                <Typography variant="body1" fontWeight="bold">
                  {health.supported_classes?.length || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Classes
                </Typography>
              </Box>
            </Grid>
          </Grid>
        ) : null}

        {lastChecked && (
          <Typography variant="caption" color="textSecondary" display="block" textAlign="center" mt={2}>
            Last checked: {lastChecked.toLocaleTimeString()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default HealthStatus;
