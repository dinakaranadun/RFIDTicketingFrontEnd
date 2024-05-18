// DrawerContent.js
import React from 'react';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { mainListItems, secondaryListItems } from './dashboard/listItems'; 
import Toolbar from '@mui/material/Toolbar'; 
import { styled } from '@mui/material/styles'; 

const drawerWidth = 240;

// Define the Drawer styled component with the styling logic
const Drawer = styled('div')(({ theme, open }) => ({
  position: 'relative',
  whiteSpace: 'nowrap',
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  boxSizing: 'border-box',
  ...(!open && {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  }),
}));

const DrawerContent = ({ open, toggleDrawer }) => {
  const handleDrawerClose = () => {
    toggleDrawer(); 
  };

  return (
    <Drawer open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">{mainListItems()}</List>
      <Divider sx={{ my: 1 }} />
      {secondaryListItems()}
    </Drawer>
  );
};

export default DrawerContent;
