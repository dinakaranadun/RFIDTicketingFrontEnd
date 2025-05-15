// NotificationsMenu.js
import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { getNotifications } from './api';

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    width: '300px', 
    maxHeight: '500px', 
    overflowY: 'auto',  
    [theme.breakpoints.down('sm')]: {  
      width: '90vw',  
      maxHeight: '80vh',  
    },
  },
}));


const StyledMenuItem = styled(MenuItem)({
  whiteSpace: 'normal',  
  wordWrap: 'break-word',  
  padding: '10px',  
});

const NotificationsMenu = () => {
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const notifications = await getNotifications(token);
          setNotifications(notifications);

          // Check for unseen notifications 
          const seenNotifications = JSON.parse(localStorage.getItem('seenNotifications')) || [];
          const unseenCount = notifications.filter(notification => {
            const seenNotification = seenNotifications.find(
              seen => seen.id === notification.id && seen.updated_at === notification.updated_at
            );
            return !seenNotification;
          }).length;

          setUnreadCount(unseenCount); 
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
    fetchNotifications();
  }, []);

  const handleNotificationClick = (event) => {
    setNotificationAnchorEl(event.currentTarget);

    // notifications as seen
    const seenNotifications = notifications.map(notification => ({
      id: notification.id,
      updated_at: notification.updated_at,
    }));
    localStorage.setItem('seenNotifications', JSON.stringify(seenNotifications));

    setUnreadCount(0);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleNotificationClick}>
        <Badge badgeContent={unreadCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <StyledMenu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationClose}
      >
        {notifications.length === 0 ? (
          <StyledMenuItem>No new notifications</StyledMenuItem>
        ) : (
          notifications.map((notification, index) => (
            <StyledMenuItem key={index}>
              {notification.message}
            </StyledMenuItem>
          ))
        )}
      </StyledMenu>
    </>
  );
};

export default NotificationsMenu;
