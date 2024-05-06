
import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Box from '@mui/material/Box';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';

let activeItem = '';

export const mainListItems = (handleDashboardClick) => (
  <React.Fragment>
    <ListItemButton onClick={() => { handleDashboardClick(); activeItem = 'dashboard'; }} style={activeItem === 'dashboard'? { backgroundColor: '#2979ff', color: 'white' } : {}}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <ShoppingCartIcon />
      </ListItemIcon>
      <ListItemText primary="Overview" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Upcoming Trips" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="RFID Balance" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Schedule" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <LayersIcon />
      </ListItemIcon>
      <ListItemText primary="Forum" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = ({ handleBookTicketClick }) => (
  <React.Fragment>
    <Box display="flex" flexDirection="column" marginTop={20} marginBottom={5}>
      <ListItemButton
        sx={{
          backgroundColor: '#2979ff',
          color: 'white',
          borderRadius: '10px',
          margin: '0 10px',
          '&:hover': {
            backgroundColor: 'lightblue',
            borderRadius: '10px',
          },
        }}
        onClick={() => {
          activeItem = '';
          handleBookTicketClick();
        }}
      >
        <ListItemText primary="Book Ticket" sx={{ textAlign: 'center' }} />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Colombo to Kandy" />
      </ListItemButton>
      <ListItemButton>
        <ListItemText primary="Matara to Colombo" />
      </ListItemButton>
    </Box>
  </React.Fragment>
);

export const useDashboard = () => {
  const [activeItem, setActiveItem] = React.useState('dashboard');

  const handleDashboardClick = () => {
    setActiveItem('dashboard');
  };

  const handleBookTicketClick = () => {
    setActiveItem('');
  };

  return {
    activeItem,
    handleDashboardClick,
    handleBookTicketClick,
  };
};