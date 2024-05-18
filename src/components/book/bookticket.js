import React, { useEffect, useState } from 'react';
import { Paper,  TextField, Button, Grid, MenuItem, CircularProgress, Card, CardContent, Divider, Box, CssBaseline,  Badge, Avatar } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { getStationData, searchTrains, fetchTicketCost, bookTicket, getUserInfo } from '../api';
import TicketBookingPopup from './BookTicketPopup';
import Drawer from '../drawer';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { ThemeProvider } from 'styled-components';
import { createTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import styled from 'styled-components';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'; 
import dayjs from 'dayjs';



const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'toggleDrawer', // Exclude toggleDrawer from forward props
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const ToolbarContent = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
}));
  

const defaultTheme = createTheme();

const BookTicketForm = () => {
  const [open, setOpen] = useState(true);
  const [departureOptions, setDepartureOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [classOptions, setClassOptions] = useState(["First Class", "Second Class", "Third Class"]);
  const [selectedDeparture, setSelectedDeparture] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [searchedTrains, setSearchedTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [ticketCost, setTicketCost] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false); 
  const navigate = useNavigate();


  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const fetchTrainData = async () => {
      try {
        const data = await getStationData();
        const departureSet = new Set(data.map(station => station.station_name));
        const destinationSet = new Set(data.map(station => station.station_name));
        const departures = Array.from(departureSet);
        const destinations = Array.from(destinationSet);
        setDepartureOptions(departures);
        setDestinationOptions(destinations);
      } catch (error) {
        console.error('Error fetching train data:', error);
      }
    };

    fetchTrainData();
  }, []);

  // useEffect(() => {
  //   console.log('Selected Date:', selectedDate ? selectedDate.format('YYYY-MM-DD') : 'No date selected');
  // }, [selectedDate]);

  const handleOpenCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const requestData = {
        departure: selectedDeparture,
        destination: selectedDestination,
        class: selectedClass,
        date: selectedDate,
      };
      const response = await searchTrains(requestData);
      setSearchedTrains(response);
    } catch (error) {
      console.error('Error fetching data from the backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookTicket = async (train) => {
    try {
      const data = {
        trainId: train.id,
        departure: train.departure_station_name,
        destination: train.destination_station_name,
        departure_id: train.departure_station_id,
        destination_id: train.destination_station_id,
        train_type: train.train_type,
        date: selectedDate,
        class: selectedClass,
      };
      console.log(data);

      // Fetch ticket cost
      setSelectedTrain(train);
      const response = await fetchTicketCost(data);
      setTicketCost(response.cost); 
      setOpenPopup(true); 
    } catch (error) {
      console.error('Error handling booking:', error);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleBookTicketNow = async () => {
    if (!selectedTrain) {
      console.error('No train selected.');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      console.log('Retrieved token:', token);
      if (token) {
        const userInfo = await getUserInfo(token);
        console.log('User info:', userInfo);

        const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');

        const data = {
          trainId: selectedTrain.id,
          departure: selectedTrain.departure_station_name,
          destination: selectedTrain.destination_station_name,
          departure_id: selectedTrain.departure_station_id,
          destination_id: selectedTrain.destination_station_id,
          train_type: selectedTrain.train_type,
          date: formattedDate,
          class: selectedClass,
          cost: ticketCost,
          passenger_id: userInfo.id,
        };

        try {
          console.log(data);
          const response = await bookTicket(data);
          setBookingSuccess(true); 
          setTimeout(function() {
            navigate('/dashboard');
        }, 1500);
        } catch (error) {
          console.error('Error booking ticket:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open} toggleDrawer={toggleDrawer}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <ToolbarContent>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    marginRight: '36px',
                    ...(open && { display: 'none' }),
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{ display: { xs: 'none', sm: 'block' } }} // Hide on extra-small screens
                >
                  Book Ticket
                </Typography>
              </div>
              <div>
                <IconButton color="inherit">
                  <Badge badgeContent={4} color="secondary">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
                <IconButton color="inherit">
                  <Avatar alt="User" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </div>
            </ToolbarContent>
          </Toolbar>
        </AppBar>
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
          <Paper sx={{ p: 4, borderRadius: '16px' }}>
      <Typography variant="h4" sx={{ marginBottom: '1rem', color: '#2979ff' }}>
        Book Your Train Ticket
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              id="departure"
              label="Departure"
              variant="outlined"
              fullWidth
              required
              value={selectedDeparture}
              onChange={(e) => setSelectedDeparture(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              {departureOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              id="destination"
              label="Destination"
              variant="outlined"
              fullWidth
              required
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              {destinationOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              id="class"
              label="Class"
              variant="outlined"
              fullWidth
              required
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              sx={{ borderRadius: '8px' }}
            >
              {classOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                inputVariant="outlined"
                value={selectedDate}
                onChange={(date) => {
                  console.log('Raw Date Object:', date);
                  setSelectedDate(date);
                }}
                renderInput={(params) => <TextField {...params} fullWidth sx={{ borderRadius: '8px' }} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, borderRadius: '8px', bgcolor: '#2979ff' }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </form>
      {searchedTrains.length > 0 && (
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {searchedTrains.map((train, index) => (
            <Grid item xs={12} key={index}>
              <Card sx={{ borderRadius: '16px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', transition: '0.3s', '&:hover': { boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)' } }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <strong>{train.name}</strong>
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    <strong>Start Station:</strong> {train.start_station.station_name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Destination:</strong> {train.end_station.station_name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Train Type:</strong> {train.train_type}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Working Days:</strong> {train.working_days || 'Not specified'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Special Notes:</strong> {train.special_note || 'None'}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Arrival Time at {train.departure_station_name}:</strong> {train.arrival_time}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Departure Time from {train.departure_station_name}:</strong> {train.departure_time}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleBookTicket(train)}
                    sx={{ mt: 2, borderRadius: '8px', bgcolor: '#f50057', '&:hover': { bgcolor: '#ff4081' } }}
                  >
                    Book
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <TicketBookingPopup
        open={openPopup}
        onClose={handleClosePopup}
        ticketCost={ticketCost}
        onBook={handleBookTicketNow}
        train={selectedTrain}
        successMessage={bookingSuccess} // Pass the booking success state
      />
    </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default BookTicketForm;
