import React, { useState } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '../drawer';
import AppBarComponent from '../appbar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import RfidBalance from './Info'; 
import RecentTransactions from './RecentTransactions'; 

const stripePromise = loadStripe('pk_test_51PiCtyRtQy7daTjtgRA577ArbsklkoxLFKoFYDtEgU6kAkNlYsABaumWebNSXUiSnoJY0oCRQ1r6k3m4xWEPVUyX00P8pVvZv7');

const defaultTheme = createTheme();

const RFID = () => {
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogOpenCheckout, setDialogOpenCheckout] = useState(false);
  const [amount, setAmount] = useState("");
  const [checkout, setCheckout] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleRechargeClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAmountClick = () => {
    setDialogOpenCheckout(true);
  };

  const handleAmountClose = () => {
    setDialogOpenCheckout(false);
  };

  const handleAmountSubmit = () => {
    setDialogOpenCheckout(true);
    setDialogOpen(false);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBarComponent open={open} toggleDrawer={toggleDrawer} />
        <Drawer open={open} toggleDrawer={toggleDrawer} />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                >
                  <RfidBalance />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {!checkout && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={handleRechargeClick}
                    sx={{ height: '50px', width: '200px', fontSize: '18px' }}
                  >
                    Recharge
                  </Button>
                )}
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: 1,
                    width: '100%', 
                  }}
                >
                  <RecentTransactions />
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      {/* Recharge Popup */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Enter Amount</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount"
            type="number"
            fullWidth
            variant="outlined"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAmountSubmit} color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
      {/* checkout Popup */}
      <Dialog open={dialogOpenCheckout} onClose={handleAmountClose}>
        <DialogTitle>Fill Card Information</DialogTitle>
        <DialogContent>
          <Elements stripe={stripePromise}>
              <CheckoutForm amount={amount} />
          </Elements>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAmountClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default RFID;
