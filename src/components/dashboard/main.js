import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import CloseIcon from '@mui/icons-material/Close'; 
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Slider from 'react-slick';
import { Card, CardContent, Button, Grid, Container, Modal, Stack, Fade, Backdrop } from '@mui/material';
import { getUserInfo, getUpcomingTrips, deleteBooking } from '../api';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const cardStyles = {
  borderRadius: 4,
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
  overflow: 'hidden',
  border: '1px solid #ddd',
  padding: '1rem',
  backgroundColor: '#fff',
  '&:hover': {
    boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
  },
};

const typographyStyles = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#333',
};

const buttonStyles = {
  borderRadius: 20,
  textTransform: 'none',
  py: 1,
  px: 2,
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
};

const modalStyles = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 10,
};

export default function Dashboard() {
  const theme = useTheme();
  const [greeting, setGreeting] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [upcomingTrips, setUpcomingTrips] = React.useState([]);
  const [selectedTrip, setSelectedTrip] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [bookingCancelled, setBookingCancelled] = React.useState(false);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        console.log('Retrieved token:', token);
        if (token) {
          const userInfo = await getUserInfo(token);
          console.log('User info:', userInfo);
          setUserName(userInfo.fName);
          // Fetch upcoming trips 
          const upcomingTrips = await getUpcomingTrips({ passenger_id: userInfo.id });
          setUpcomingTrips(upcomingTrips);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchData();
    setGreeting(determineGreeting());
  }, []);

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

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  const handleOpen = (trip) => {
    setSelectedTrip(trip);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" style={{ color: '#333', marginBottom: 20, fontWeight: 'bold' }}>
            {greeting}, <span style={{ fontWeight: 'bold' }}>{userName}</span>
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <TextField
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <IconButton style={{ color: theme.palette.text.secondary }}>
                    <SearchIcon />
                  </IconButton>
                ),
                endAdornment: (
                  <Button variant="contained" color="primary" style={{ backgroundColor: '#2979ff', color: '#fff', borderRadius: 5, textTransform: 'none' }}>
                    Search
                  </Button>
                )
              }}
              style={{ marginRight: 10, backgroundColor: '#f0f0f0', textTransform: 'capitalize' }}
            />
          </div>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 20 }}>
            Your Upcoming Trips
          </Typography>
          {upcomingTrips.length > 0 ? (
            <Slider {...sliderSettings}>
              {upcomingTrips.map((trip) => (
                <div key={trip.id} className="container" style={{ margin: '0 1rem' }}>
                  <Card sx={cardStyles}>
                    <CardContent sx={{ padding: '1rem' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={typographyStyles}>
                          {trip.start_station.station_name}
                        </Typography>
                        <Typography variant="body1" sx={{ mx: 1, fontSize: '1.5rem', fontWeight: 'bold' }}>
                          -
                        </Typography>
                        <Typography variant="body1" sx={typographyStyles}>
                          {trip.end_station.station_name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ mr: 1, fontSize: '1rem', fontWeight: 'bold' }}>
                          Date:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 1, fontSize: '1rem' }}>
                          {trip.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Typography variant="body1" sx={{ mr: 1, fontSize: '1rem', fontWeight: 'bold' }}>
                          Time:
                        </Typography>
                        <Typography variant="body1" sx={{ ml: 1, fontSize: '1rem' }}>
                          {trip.time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          sx={{
                            ...buttonStyles,
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#3e8e41',
                            },
                          }}
                          onClick={() => handleOpen(trip)}
                        >
                          View
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Slider>
          ) : (
            <Typography variant="h6" style={{ fontWeight: 'bold', marginBottom: 20 }}>
              No upcoming trips found.
            </Typography>
          )}
        </Grid>
      </Grid>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyles}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mb: 2 }}>
              <strong>Booking Details</strong>
            </Typography>
            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Train:</strong> {selectedTrip?.train.name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Class:</strong> {selectedTrip?.class}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Start Station:</strong> {selectedTrip?.start_station.station_name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Destination:</strong> {selectedTrip?.end_station.station_name}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Date:</strong> {selectedTrip?.date}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                <strong>Time:</strong> {selectedTrip?.time}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              {/* Conditional rendering based on whether the booking is cancelled */}
              {!bookingCancelled ? (
                <Button
                  variant="contained"
                  color="error"
                  sx={{
                    borderRadius: 20,
                    textTransform: 'none',
                    py: 1.5,
                    px: 4,
                  }}
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this booking?')) {
                      cancelBooking(selectedTrip.id);
                    }
                  }}
                >
                  Cancel Booking
                </Button>
              ) : (
                <Typography variant="body1" sx={{ color: 'red',fontWeight:'bold' }}>
                  Booking cancelled successfully
                </Typography>
              )}
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
}

function determineGreeting() {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  if (currentHour < 12) {
    return 'Good morning';
  } else if (currentHour < 15) {
    return 'Good afternoon';
  } else {
    return 'Good evening';
  }
}
