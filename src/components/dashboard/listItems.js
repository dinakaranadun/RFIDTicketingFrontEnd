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
import { NavLink, Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUserInfo, getRecentTrips } from '../api';
import { StyledButton, StyledListItemButton } from './styles'; // Import your styles

// Menu Items
export const mainListItems = (handleDashboardClick) => (
  <React.Fragment>
    <StyledListItemButton
      component={NavLink} to="/dashboard" onClick={handleDashboardClick} active={window.location.pathname === '/dashboard'}
    >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </StyledListItemButton>

    <StyledListItemButton component={NavLink} to="/trips" active={window.location.pathname === '/trips'}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="My Trips" />
    </StyledListItemButton>

    <StyledListItemButton component={NavLink} to="/rfid" active={window.location.pathname === '/rfid'}>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="RFID Balance" />
    </StyledListItemButton>

    <StyledListItemButton component={NavLink} to="/schedule" active={window.location.pathname === '/schedule'}>
      <ListItemIcon>
        <ScheduleIcon />
      </ListItemIcon>
      <ListItemText primary="Schedule" />
    </StyledListItemButton>

    <StyledListItemButton component={NavLink} to="/forum" active={window.location.pathname === '/forum'}>
      <ListItemIcon>
        <ForumIcon />
      </ListItemIcon>
      <ListItemText primary="Forum" />
    </StyledListItemButton>
  </React.Fragment>
);

export const SecondaryListItems = () => {
  const [recentTrips, setRecentTrips] = useState([]);

  useEffect(() => {
    const fetchRecentTripData = async () => {
      try {
        const storedTrips = localStorage.getItem('recentTrips');
        if (storedTrips) {
          setRecentTrips(JSON.parse(storedTrips));
        } else {
          const token = localStorage.getItem('token');
          if (token) {
            const userInfo = await getUserInfo(token);
            const recentTrips = await getRecentTrips({ passenger_id: userInfo.id });

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
          sx={{ ml: 2, mb: 2 }}>
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

export { SecondaryListItems as secondaryListItems };
