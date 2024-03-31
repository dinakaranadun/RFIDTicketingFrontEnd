import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function EnterMobileNumber({ onNext }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [mobileNumberError, setMobileNumberError] = useState('');

  const validateMobileNumber = () => {
    if (!mobileNumber) {
      setMobileNumberError('Mobile number is required');
      return false;
    }

    // Validate mobile number format
    const mobileNumberRegex = /^\d{10}$/;
    if (!mobileNumberRegex.test(mobileNumber)) {
      setMobileNumberError('Invalid mobile number format');
      return false;
    }

    setMobileNumberError('');
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isMobileNumberValid = validateMobileNumber();

    if (isMobileNumberValid) {
      onNext(mobileNumber);
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar style={{ m: 1, bgcolor: 'secondary.main' }}>
          </Avatar>
          <Typography component="h1" variant="h5">
            Enter Mobile Number
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="Mobile Number"
              name="mobile"
              autoComplete="mobile"
              autoFocus
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              onBlur={validateMobileNumber}
              error={!!mobileNumberError}
              helperText={mobileNumberError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ marginTop: '1rem' }}
            >
              Next
            </Button>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}

function EnterOTP({ onVerify }) {
  const [otp, setOTP] = useState('');
  const [otpError, setOTPError] = useState('');

  const validateOTP = () => {
    if (!otp) {
      setOTPError('OTP is required');
      return false;
    }

    // Validate OTP format here
    const otpRegex = /^\d{6}$/;
    if (!otpRegex.test(otp)) {
      setOTPError('Invalid OTP format');
      return false;
    }

    setOTPError('');
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const isOTPValid = validateOTP();

    if (isOTPValid) {
      // Verify the OTP logic 
      onVerify(otp);
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar style={{ m: 1, bgcolor: 'secondary.main' }}>
            {/* You can use an icon here */}
          </Avatar>
          <Typography component="h1" variant="h5">
            Enter OTP
          </Typography>
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="OTP"
              name="otp"
              autoComplete="otp"
              autoFocus
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              onBlur={validateOTP}
              error={!!otpError}
              helperText={otpError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              style={{ marginTop: '1rem' }}
            >
              Verify OTP
            </Button>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}

function EnterNewPassword() {
  // EnterNewPassword component
}

function ForgotPasswordFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState('');

  const handleNext = (mobile) => {
    setMobileNumber(mobile);
    setCurrentStep(currentStep + 1);
  };

  const handleVerifyOTP = (otp) => {
    //  OTP verification logic 
    setCurrentStep(currentStep + 1);
  };

  return (
    <>
      {currentStep === 1 && <EnterMobileNumber onNext={handleNext} />}
      {currentStep === 2 && <EnterOTP onVerify={handleVerifyOTP} />}
      {currentStep === 3 && <EnterNewPassword />}
    </>
  );
}

export default ForgotPasswordFlow;
