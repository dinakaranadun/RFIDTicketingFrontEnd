import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Box } from '@mui/material';

const TripDetailsDialog = ({ open, handleClose, trip }) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5">{trip?.title}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box my={2}>
          <Typography color="textSecondary">{trip?.date}</Typography>
        </Box>
        <DialogContentText variant="body1">{trip?.description}</DialogContentText>
        <Box my={2}>
          <DialogContentText>{trip?.details}</DialogContentText>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TripDetailsDialog;
