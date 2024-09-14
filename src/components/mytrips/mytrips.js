import React, { useEffect, useState } from 'react';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
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
import {getUserInfo, getRecentTrips, deleteBooking,requestRefund } from '../api';
import { CircularProgress } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import RefundDialog from './RefundDialog';

const defaultTheme = createTheme();

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#0096FF',
    },
    '&:hover fieldset': {
      borderColor: '#0096FF',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#0096FF',
    },
  },
});

const NoTripsFound = ({ message }) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
    <Typography variant="h6" color="textSecondary">{message}</Typography>
  </Box>
);

const MyTrips = () => {
  const [open, setOpen] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedMissedTrip, setSelectedMissedTrip] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [missedDialogOpen, setMissedDialogOpen] = useState(false);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [filteredUpcomingTrips, setFilteredUpcomingTrips] = useState([]);
  const [filteredRecentTrips, setFilteredRecentTrips] = useState([]);
  const [notUsedTrips, setNotUsedTrips] = useState([]);
  const [filteredNotUsedTrips, setFilteredNotUsedTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingCancelled, setBookingCancelled] = useState(false);
  

  const toggleDrawer = () => {
    setOpen(!open);
  };

  
  useEffect(() => {
    const fetchRecentTripData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
          const userInfo = await getUserInfo(token);
          const recentTrips = await getRecentTrips({ passenger_id: userInfo.id });
          const tripsOut = recentTrips.filter(trip => trip.status === 'out');
          const tripsNotUsed = recentTrips.filter(trip => trip.status === 'notused' || trip.status === 'refund requested');          const tripsUpcoming = recentTrips.filter(trip => trip.status === 'pending');
          setRecentTrips(tripsOut);
          setFilteredRecentTrips(tripsOut);
          setNotUsedTrips(tripsNotUsed);
          setFilteredNotUsedTrips(tripsNotUsed);
          setUpcomingTrips(tripsUpcoming);
          setFilteredUpcomingTrips(tripsUpcoming);
        }
      } catch (error) {
        console.error('Error fetching Trip data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentTripData();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredUpcomingTrips(upcomingTrips);
      setFilteredRecentTrips(recentTrips);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();

      const filterTrips = trips => trips.filter(trip =>
        trip.start_station.station_name.toLowerCase().includes(lowerCaseQuery) ||
        trip.end_station.station_name.toLowerCase().includes(lowerCaseQuery)
      );

      const filteredUpcomingTrips = filterTrips(upcomingTrips);
      const filteredRecentTrips = filterTrips(recentTrips);

      setFilteredUpcomingTrips(filteredUpcomingTrips);
      setFilteredRecentTrips(filteredRecentTrips);
    }
  }, [searchQuery, upcomingTrips, recentTrips,notUsedTrips]);

  const cancelBooking = async (bookingId) => {
    console.log('Cancelling booking:', bookingId);
    try {
      const response = await deleteBooking(bookingId);
      console.log(response);
      setBookingCancelled(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      console.log('Error cancelling booking');
    }
  };

  const requestRefunding = async (bookingId) => {
    try {
      const response = await requestRefund(bookingId);
      console.log(response);
      // setBookingCancelled(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      console.log('Error refund booking');
    }
  };

  const handleCardClick = (trip) => {
    setSelectedTrip(trip);
    setDialogOpen(true);
  };
  const handleCardClickMissed = (trip) => {
    setSelectedMissedTrip(trip);
    setMissedDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedTrip(null);
    setMissedDialogOpen(false);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

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
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <StyledTextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  value={searchQuery}
                  onChange={handleSearch}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" gutterBottom>Upcoming Trips</Typography>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                      <CircularProgress size={100} />
                    </Box>
                  ) : filteredUpcomingTrips.length === 0 ? (
                    <NoTripsFound message="No upcoming trips found." />
                  ) : (
                    <Grid container spacing={2}>
                      {filteredUpcomingTrips.map((trip) => (
                        <Grid item xs={12} sm={6} md={4} key={trip.id}>
                          <TripCard trip={trip} onClick={handleCardClick} isUpcoming={true} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" gutterBottom>Missed Trips 
                    <Typography  component="span" sx={{size:1,ml:1}}>(Request before 48 Hours)</Typography>
                  </Typography>
                  
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                      <CircularProgress size={100} />
                    </Box>
                  ) : filteredNotUsedTrips.length === 0 ? (
                    <NoTripsFound message="No upcoming trips found." />
                  ) : (
                    <Grid container spacing={2}>
                      {filteredNotUsedTrips.map((trip) => (
                        <Grid item xs={12} sm={6} md={4} key={trip.id}>
                          <TripCard trip={trip} onClick={handleCardClickMissed} isUpcoming={true} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} sx={{ mt: 4 }}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" gutterBottom>Recent Trips</Typography>
                  {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                      <CircularProgress size={100} />
                    </Box>
                  ) : filteredRecentTrips.length === 0 ? (
                    <NoTripsFound message="No recent trips found." />
                  ) : (
                    <Grid container spacing={2}>
                      {filteredRecentTrips.map((trip) => (
                        <Grid item xs={12} sm={6} md={4} key={trip.id}>
                          <TripCard trip={trip} onClick={handleCardClick} />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
      <TripDetailsDialog open={dialogOpen} handleClose={handleCloseDialog} trip={selectedTrip} isUpcoming={true} cancelBookingFunction={cancelBooking} />
      <RefundDialog open={missedDialogOpen} handleClose={handleCloseDialog} trip={selectedMissedTrip} isUpcoming={true} requestRefundFunction={requestRefunding} />
    </ThemeProvider>
  );
}

export default MyTrips;
