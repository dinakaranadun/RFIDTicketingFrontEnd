import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import Button from '@mui/material/Button';
import styled from '@mui/material/styles/styled';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';


const StyledButton = styled(Button)({
  width:'200px',
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

export const mainListItems = (handleDashboardClick) => (
  <React.Fragment>
    <ListItemButton component={Link} to="/dashboard" onClick={handleDashboardClick}
    >
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
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Schedule" />
    </ListItemButton>
    <ListItemButton component={Link} to="/forum">
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Forum" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems =()=> (
  <React.Fragment>
    <Box>
    <StyledButton component={Link} to="/bookticket" 
    ariant="outlined"
    sx={{
      ml: 2,
      mb:2,
    }}>
      Book Ticket
    </StyledButton>
    </Box>
    <ListItemButton component={Link} to="/colombo-to-kandy">
      <ListItemText primary="Colombo to Kandy" />
    </ListItemButton>
    <ListItemButton component={Link} to="/matara-to-colombo">
      <ListItemText primary="Matara to Colombo" />
    </ListItemButton>
  </React.Fragment>
);
