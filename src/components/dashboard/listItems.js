import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ForumIcon from '@mui/icons-material/Forum';
import Button from '@mui/material/Button';
import styled from '@mui/material/styles/styled';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUserInfo, getRecentTrips } from '../api';

const StyledButton = styled(Button)({
  width: '200px',
  borderRadius: '20px',
  padding: '10px 20px',
  color: 'white',
  backgroundColor: '#0096FF',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: '#1434A4',
    color: 'white',
  },
});

// Main List Items Component (Menu Items)
export const mainListItems = (handleDashboardClick) => (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard" onClick={handleDashboardClick}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/trips">
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="My Trips" />
    </ListItemButton>
    <ListItemButton component={Link} to="/rfid">
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="RFID Balance" />
    </ListItemButton>
    <ListItemButton component={Link} to="/schedule">
      <ListItemIcon>
        <ScheduleIcon />
      </ListItemIcon>
      <ListItemText primary="Schedule" />
    </ListItemButton>
    <ListItemButton component={Link} to="/forum">
      <ListItemIcon>
        <ForumIcon />
      </ListItemIcon>
      <ListItemText primary="Forum" />
    </ListItemButton>
  </React.Fragment>
);

// Secondary List Items (Recent Trips)
export const SecondaryListItems = () => {
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    const fetchRecentTripData = async () => {
      try {
        // Check if recent trips are already stored in localStorage
        const storedTrips = localStorage.getItem('recentTrips');
        if (storedTrips) {
          // Use the stored trips from localStorage
          setRecentTrips(JSON.parse(storedTrips));
        } else {
          // Fetch new trips data from the API
          const token = localStorage.getItem('token');
          if (token) {
            const userInfo = await getUserInfo(token);
            const recentTrips = await getRecentTrips({ passenger_id: userInfo.id });

            // Save the fetched trips to both state and localStorage
            setRecentTrips(recentTrips);
            localStorage.setItem('recentTrips', JSON.stringify(recentTrips));
          }
        }
      } catch (error) {
        console.error('Error fetching Trip data:', error);
      }
    };

    fetchRecentTripData();
  }, []);

  return (
    <React.Fragment>
      <Box>
        <StyledButton component={Link} to="/bookticket" 
          variant="outlined"
          sx={{
            ml: 2,
            mb: 2,
          }}>
          Book Ticket
        </StyledButton>
      </Box>
      {recentTrips.slice(0, 3).map((trip) => (
        <ListItemButton key={trip.id} component={Link} to={trip.path}>
          <ListItemText secondary={`${trip.start_station.station_name} to ${trip.end_station.station_name}`} />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};

// Export the secondaryListItems as needed
export { SecondaryListItems as secondaryListItems };
