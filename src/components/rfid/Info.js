import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { getUserInfo } from '../api'; 

function Info() {
  const [totalCredit, setTotalCredit] = useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userInfo = await getUserInfo(token);
          console.log('User info:', userInfo);
          setTotalCredit(userInfo.account_credits);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <React.Fragment>
      <Typography variant="subtitle2" color="text.secondary">
        Current RFID Balance
      </Typography>
      <Typography variant="h4" gutterBottom>
        {totalCredit !== null ? `Rs.${totalCredit}` : 'Loading...'}
      </Typography>
    </React.Fragment>
  );
}

export default Info;
