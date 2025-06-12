import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Box, Tabs, Tab } from '@mui/material';
import './App.css';
import ImageUploader from './components/ImageUploader';
import BatchUploader from './components/BatchUploader';
import ApiTester from './components/ApiTester';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',
    },
    secondary: {
      main: '#ff6f00',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
      marginBottom: '1rem',
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">        <Box sx={{ py: 4 }}>
          <Typography variant="h4" component="h1" align="center" color="primary" gutterBottom>
            🥔 Système de Classification des Maladies de la Pomme de Terre
          </Typography>          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Téléchargez des images de feuilles de pomme de terre pour détecter le Mildiou Précoce, la Brûlure Tardive, ou les plantes Saines
          </Typography>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="onglets de navigation">
              <Tab label="Prédiction Image Unique" />
              <Tab label="Prédiction par Lot" />
              <Tab label="Testeur d'API" />
            </Tabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <ImageUploader />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <BatchUploader />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <ApiTester />
          </TabPanel>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
