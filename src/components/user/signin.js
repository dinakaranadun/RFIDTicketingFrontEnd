import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom'; 
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { loginUser } from '../api';
import { useNavigate } from 'react-router-dom'; 

function SignIn({ message }) {
  const [NIC, setNIC] = useState('');
  const [password, setPassword] = useState('');
  const [nicError, setNicError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const validateNIC = () => {
    if (!NIC) {
      setNicError('NIC is required');
      return false;
    }
    setNicError('');
    return true;
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isNicValid = validateNIC();
    const isPasswordValid = validatePassword();

    if (!isNicValid || !isPasswordValid) return;

    try {
      const data = await loginUser(NIC, password);
      const token = data.token;
      console.log(token);

      // Store the token
      localStorage.setItem('token', token);

      navigate('/dashboard');
      console.log('Login successful');
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setLoginError('Invalid NIC or password');
        } else {
          setLoginError(error.response.data.message);
        }
      } else if (error.request) {
        console.error(error.request);
        setLoginError('Failed to connect to the server');
      } else {
        console.error('Error', error.message);
        setLoginError('An unexpected error occurred');
      }
    }
  };

  return (
    <ThemeProvider theme={createTheme()}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>

          {message && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="NIC"
              label="National Identity Card Number"
              name="NIC"
              autoComplete="NIC"
              autoFocus
              value={NIC}
              onChange={(e) => setNIC(e.target.value)}
              onBlur={validateNIC}
              error={!!nicError}
              helperText={nicError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              error={!!passwordError}
              helperText={passwordError}
            />
            
            {/* Display login error */}
            {loginError && (
              <Typography variant="body2" color="error">
                {loginError}
              </Typography>
            )}

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <RouterLink to="/forgetpassword">
                  Forgot password?
                </RouterLink>
              </Grid>
              <Grid item>
                <RouterLink to="/signup">
                  {"Don't have an account? Sign Up"}
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
