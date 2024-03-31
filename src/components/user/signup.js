import * as React from 'react';
import { Link as RouterLink } from 'react-router-dom'; 
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { signupUser } from '../api'; 

function SignUp() {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    NIC: '',
    contactNumber: '',
  });

  const [errors, setErrors] = React.useState({});

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z]+$/;
    const nicRegex = /^\d{9}(?:v|V|\d{3})$/;
    const phoneRegex = /^\d{10}$/;
  
    // First Name Validation
    if (!formData.firstName.match(nameRegex)) {
      errors.firstName = true;
    }
  
    // Last Name Validation
    if (!formData.lastName.match(nameRegex)) {
      errors.lastName = true;
    }
  
    // Email Validation
    if (!formData.email.match(emailRegex)) {
      errors.email = true;
    }
  
    // Password Validation
    if (formData.password.length < 8 || formData.password.length > 20) {
      errors.password = true;
    }
  
    // NIC Validation
    if (!formData.NIC.match(nicRegex)) {
      errors.NIC = true;
    }
  
    // Contact Number Validation
    if (!formData.contactNumber.match(phoneRegex)) {
      errors.contactNumber = true;
    }
  
    return errors;
  };
  

  const handleBlur = (e) => {
    const { name } = e.target;
    const formErrors = validateForm();
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: formErrors[name],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formErrors = validateForm();

    if (Object.values(formErrors).some(error => error)) {
      setErrors(formErrors);
      return;
    }

    try {
      const response = await signupUser(formData);

      console.log('User signed up successfully:', response.data);
      // Redirect the user or show a success message
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle errors - show error message to the user, etc.
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
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  value={formData.firstName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.firstName}
                  helperText={errors.firstName && "Please enter a valid first name"}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.lastName}
                  helperText={errors.lastName && "Please enter a valid last name"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={formData.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={errors.email && "Please enter a valid email address"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.password}
                  helperText={errors.password && "Password must be 8-20 characters long"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="NIC"
                  label="NIC"
                  name="NIC"
                  value={formData.NIC}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.NIC}
                  helperText={errors.NIC && "Please enter a valid NIC (e.g., 123456789V)"}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.contactNumber}
                  helperText={errors.contactNumber && "Please enter a valid contact number (10 digits)"}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <RouterLink to="/signin" variant="body2">
                  Already have an account? Sign In
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignUp;
