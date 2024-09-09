import React, { useState,useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate,useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { getUserInfo } from './api';

const drawerWidth = 240;

const CustomAppBar = styled(AppBar)(({ theme, open }) => ({
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

const AppBarComponent = ({ open, toggleDrawer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [profile, setProfile] = useState({});


  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userInfo = await getUserInfo(token);
          console.log('User info from appbar:', userInfo);
          setProfile(userInfo);
          console.log("profile" ,profile);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchData();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleMyProfile = () =>{
    navigate('/myprofile', { state: { from: location.pathname } });
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <CustomAppBar position="absolute" open={open}>
      <Toolbar sx={{ pr: '24px' }}>
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
        <Typography component="h1" variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Sri Lankan Railways
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <Avatar alt="User" src={profile.image_URL ?  `http://localhost:8000/${profile.image_URL}` : "/images/default-avatar.jpeg"} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMyProfile}>My Profile</MenuItem>
          <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
        </Menu>
      </Toolbar>
    </CustomAppBar>
  );
};

export default AppBarComponent;
