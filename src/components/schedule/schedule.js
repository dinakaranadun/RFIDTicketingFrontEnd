import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Paper, TextField, Button, Grid, MenuItem, Card, CardContent, Box, CssBaseline, Typography,CircularProgress } from '@mui/material';
import Container from '@mui/material/Container';
import CardActions from '@mui/material/CardActions';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '../drawer';
import AppBarComponent from '../appbar';
import { OneIcon, TwoIcon, ThreeIcon } from './customicons';
import { blue } from '@mui/material/colors';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getStationData, searchScheduale } from '../api';
import { useNavigate } from 'react-router-dom'; 

const customTheme = createTheme({
  palette: {
    primary: {
      main: blue[700],
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
  },
});

const defaultTheme = createTheme();

const Schedule = () => {
  const [open, setOpen] = useState(true);
  const [searchParams, setSearchParams] = useState({
    startStation: '',
    endStation: '',
    date: '',
  });
  const [departureOptions, setDepartureOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [selectedDeparture, setSelectedDeparture] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      const requestData = {
        departure: selectedDeparture,
        destination: selectedDestination,
        date: formattedDate,
      };
      console.log(requestData);
      const response = await searchScheduale(requestData);
      setFilteredTrains(response);
    } catch (error) {
      console.error('Error fetching data from the backend:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookNow = (departure_station_name, destination_station_name, date) => {
    navigate('/bookticket', { state: { departure_station_name, destination_station_name } });
    console.log(departure_station_name, destination_station_name, date);
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
            <Paper sx={{ p: 4, mb: 4, backgroundColor: customTheme.palette.background.default }}>
              <Typography variant="h4" gutterBottom>
                Search Trains
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
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Select Date"
                        inputVariant="outlined"
                        value={selectedDate}
                        onChange={(date) => {
                          console.log('Raw Date Object:', date);
                          setSelectedDate(date);
                        }}
                        minDate={dayjs()}
                        renderInput={(params) => <TextField {...params} fullWidth sx={{ borderRadius: '8px' }} />}
                      />
                    </LocalizationProvider>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2,mb:2, borderRadius: '8px', bgcolor: '#2979ff' }}
                      disabled={isLoading}
                    >
                      {isLoading ? <CircularProgress size={20} /> : 'Search'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            
            <Grid container spacing={3}>
              {filteredTrains.length > 0 ? (
                filteredTrains.map((train) => (
                  <Grid item xs={12} key={train.train_name}>
                    <Card sx={{ borderRadius: '16px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', transition: '0.3s', '&:hover': { boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)' } }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom color={blue[700]}>
                          {train.train_name} - {train.train_type}
                        </Typography>
                        <Typography variant="body1">
                          <strong> From:</strong> {train.departure_station_name} 
                        </Typography>
                        <Typography variant="body1">
                          <strong>To:</strong> {train.destination_station_name}
                        </Typography>
                        <Typography variant="body1" >
                          <strong> Working Days:</strong> {train.working_days}
                        </Typography>
                        <Box sx={{ mt: 2}}>
                          <Typography sx={{ mb:2 }} variant="body2" color="textSecondary">
                            Available classes :
                          </Typography>
                          {train.classes.includes('First Class') && <OneIcon sx={{ mr: 1, color: blue[700],height:32,width:32 }} />}
                          {train.classes.includes('Second Class') && <TwoIcon sx={{ mr: 1, color: blue[700],height:32,width:32 }} />}
                          {train.classes.includes('Third Class') && <ThreeIcon sx={{ mr: 1, color: blue[700],height:32,width:32 }} />}
                        </Box>
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          sx={{ mt: 2, borderRadius: '8px', bgcolor: '#f50057', '&:hover': { bgcolor: '#ff4081' } }}
                          onClick={() => handleBookNow(train.departure_station_name, train.destination_station_name, selectedDate)}
                        >
                          Book Now
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    minHeight: '100px',
                  }}
                >
                  <Typography variant="h6" color="textSecondary">
                    No trains available
                  </Typography>
                </Box>
              )}
            </Grid>
            </Paper>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Schedule;
