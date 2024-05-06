// BookTicketPopup.js

import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const DialogContentStyled = styled(DialogContent)({
  padding: '20px',
  borderTop: '1px solid #ddd',
  borderBottom: '1px solid #ddd',
});

const ButtonStyled = styled(Button)({
  backgroundColor: '#4caf50',
  color: '#fff',
  padding: '10px 20px',
  borderRadius: '5px',
  textTransform: 'uppercase',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: '#3e8e41',
  },
});

const BookTicketPopup = ({ open, onClose, ticketCost, onBook, train, successMessage }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          borderRadius: '10px',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" sx={{ borderBottom: '1px solid #ddd', padding: '20px' }}>
        {successMessage ? "Booking successful!" : "Ticket Cost"}
      </DialogTitle>
      <DialogContentStyled>
        {successMessage ? (
          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
            Your ticket has been successfully booked.
          </Typography>
        ) : (
          <DialogContentText id="alert-dialog-description">
            Rs.{ticketCost}
          </DialogContentText>
        )}
      </DialogContentStyled>
      <DialogActions sx={{ padding: '20px' }}>
        {!successMessage && (
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
        )}
        <ButtonStyled onClick={successMessage ? onClose : onBook} color="primary" autoFocus>
          {successMessage ? "Close" : "Book Now"}
        </ButtonStyled>
      </DialogActions>
    </Dialog>
  );
};

export default BookTicketPopup;
