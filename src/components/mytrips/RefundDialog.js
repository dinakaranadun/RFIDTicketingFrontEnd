import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Box, Divider } from '@mui/material';

const TripDetailsDialog = ({ open, handleClose, trip,isUpcoming,bookingCancelled ,requestRefundFunction}) => {
  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth sx={{ "& .MuiDialog-paper": { borderRadius: '50px' }}}>
      <DialogTitle sx={{ backgroundColor: 'primary.main', color: 'white', py: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {trip?.start_station.station_name} to {trip?.end_station.station_name}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box my={2}>
          <Typography variant="subtitle1" color="textSecondary">
            Train: <Typography variant="body1" component="span" color="textPrimary">{trip?.train.name}</Typography>
          </Typography>
        </Box>
        <Divider />
        <Box my={2}>
          <Typography variant="subtitle1" color="textSecondary">
            Cost: <Typography variant="body1" component="span" color="textPrimary">Rs. {trip?.cost}</Typography>
          </Typography>
        </Box>
        <Divider />
        <Box my={2}>
          <Typography variant="subtitle1" color="textSecondary">
            Date: <Typography variant="body1" component="span" color="textPrimary">{trip?.date}</Typography>
          </Typography>
        </Box>
        <Divider />
        <Box my={2}>
          <Typography variant="subtitle1" color="textSecondary">
            Time: <Typography variant="body1" component="span" color="textPrimary">{trip?.time}</Typography>
          </Typography>
        </Box>
        <Divider />
        <Box my={2}>
        <Typography variant="subtitle1" color="textSecondary">
        Trip Status:{" "}
        <Typography variant="body1" component="span" color="textPrimary">
          {trip?.status === "notused" 
            ? "Not Used" 
            : trip?.status === "refund requested" 
            ? "Requested Refund" 
            : trip?.status}
        </Typography>
      </Typography>
        </Box>
        <Divider />
        <Box my={2}>
          <DialogContentText variant="body1">{trip?.details}</DialogContentText>
        </Box>
        
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Button onClick={handleClose} color="primary" variant="contained" sx={{ borderRadius: '20px', px: 4 }}>
          Close
        </Button>
          {isUpcoming && !bookingCancelled ? (
            <Button
              variant="contained"
              color="error"
              sx={{
                borderRadius: 20,
                textTransform: 'none',
                py: 0.9,
                px: 3.5,
              }}
              disabled={trip?.status === 'refund requested'}
              onClick={() => {
                if (window.confirm('Are you sure you want a refund for this booking?')) {
                  requestRefundFunction(trip?.id);
                }
              }}
            >
              {trip?.status === 'refund requested' ? 'Refund Requested' : 'Request Refund'}
            </Button>
          ) : (
            <Typography variant="primary" sx={{ color: 'red' }}>
              Booking cancelled successfully
            </Typography>
          )}

      </DialogActions>
    </Dialog>
  );
};

export default TripDetailsDialog;
