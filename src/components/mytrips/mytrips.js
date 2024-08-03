import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Drawer from '../drawer';
import AppBarComponent from '../appbar';
import TripCard from './TripCard';
import TripDetailsDialog from './TripDetailsDialog';

const defaultTheme = createTheme();

const MyTrips = () => {
  const [open, setOpen] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleCardClick = (trip) => {
    setSelectedTrip(trip);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTrip(null);
  };

  const upcomingTrips = [
    { id: 1, title: 'Trip to the mountains', date: '2024-07-15', description: 'A refreshing journey to the mountains.', details: 'More details about the trip to the mountains.' },
    { id: 2, title: 'Beach vacation', date: '2024-08-01', description: 'Relaxing time at the beach.', details: 'More details about the beach vacation.' },
    { id: 2, title: 'Beach vacation', date: '2024-08-01', description: 'Relaxing time at the beach.', details: 'More details about the beach vacation.' },
    { id: 2, title: 'Beach vacation', date: '2024-08-01', description: 'Relaxing time at the beach.', details: 'More details about the beach vacation.' }


  ];

  const recentTrips = [
    { id: 3, title: 'City tour', date: '2024-06-10', description: 'Exploring the city.', details: 'More details about the city tour.' },
    { id: 4, title: 'Countryside adventure', date: '2024-05-20', description: 'An adventure in the countryside.', details: 'More details about the countryside adventure.' }
  ];

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
        <Drawer open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" gutterBottom>Upcoming Trips</Typography>
                  <Grid container spacing={2}>
                    {upcomingTrips.map((trip) => (
                      <Grid item xs={12} sm={6} md={4} key={trip.id}>
                        <TripCard trip={trip} onClick={handleCardClick} />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" gutterBottom>Recent Trips</Typography>
                  <Grid container spacing={2}>
                    {recentTrips.map((trip) => (
                      <Grid item xs={12} sm={6} md={4} key={trip.id}>
                        <TripCard trip={trip} onClick={handleCardClick} />
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <TripDetailsDialog open={dialogOpen} handleClose={handleCloseDialog} trip={selectedTrip} />
    </ThemeProvider>
  );
}

export default MyTrips;
