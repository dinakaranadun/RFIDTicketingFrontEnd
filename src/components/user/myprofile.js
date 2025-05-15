import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Grid, Avatar, Typography, Tabs, Tab, TextField, Paper, Button, IconButton } from '@mui/material';
import { ArrowBack, VerifiedUser } from '@mui/icons-material';
import AppBarComponent from '../appbar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getUserInfo, updateUser, updateUserPassword, changeUserPicture } from '../api';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [tabIndex, setTabIndex] = useState(0);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); 
    const [errors, setErrors] = useState({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const navigate = useNavigate();
    const location = useLocation();

    const themeColors = {
        primary: '#2979ff',
        background: '#f7f9fc',
        text: '#333333',
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const userInfo = await getUserInfo(token);
                    setProfile(userInfo);
                }
            } catch (error) {
                console.error('Error loading profile', error);
            }
        };

        loadProfile();
    }, []);

    const handleProfileFieldChange = (field, value) => {
        setProfile((prevProfile) => ({
            ...prevProfile,
            [field]: value,
        }));
    };

    const handlePasswordFieldChange = (field, value) => {
        if (field === 'newPassword') {
            setNewPassword(value);
        } else if (field === 'confirmPassword') {
            setConfirmPassword(value);
        }
    };

    useEffect(() => {
        if (selectedImage) {
            handleImageUpload();
        }
    }, [selectedImage]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);

        }
       
    };
    

    const handleImageUpload = async () => {
        if (selectedImage) {
            const formData = new FormData();
            formData.append('image', selectedImage);
    
            try {
                const response = await changeUserPicture(profile.id, formData);
                if (response.success) {
                    setSnackbarMessage('Profile picture updated successfully!');
                    setSeverity('success');
                    setOpenSnackbar(true);
                    
                    setSelectedImage(null);
                    
                    // document.getElementById('contained-button-file').value = null;
                    
                    setTimeout(() => {
                        window.location.reload();
                    }, 2000);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                setSnackbarMessage('Failed to upload image.');
                setSeverity('error');
                setOpenSnackbar(true);
            }
        }
    };

    const handleProfileUpdate = async () => {
        if (Object.keys(errors).length > 0) {
            setSnackbarMessage('Please fix the errors before submitting.');
            setSeverity('error');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await updateUser(profile.id, profile);

            if (response.success) {
                setSnackbarMessage('Profile updated successfully!');
                setSeverity('success');
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            setSnackbarMessage('Error updating profile');
            setSeverity('error');
            console.error('Error updating profile:', error);
        } finally {
            setOpenSnackbar(true);
        }
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBarComponent />
            <Grid container sx={{ mt: 10 }}>
                <Grid item md={3}>
                    <Paper
                        sx={{
                            height: '115vh',
                            pt: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: themeColors.background,
                        }}
                    >
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Box sx={{ p: 4 }}>
                        <Paper sx={{ p: 3, mb: 3, backgroundColor: themeColors.background }}>
                            <Grid container alignItems="center" spacing={3}>
                                <Grid item xs={1}>
                                    <IconButton color="primary" onClick={() => navigate(location.state?.from || '/dashboard')}>
                                        <ArrowBack />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={1}>
                                    <Box 
                                        sx={{ 
                                            position: 'relative', 
                                            width: 80, 
                                            height: 80, 
                                            '&:hover .update-btn': {
                                                display: 'block',
                                                backgroundColor: 'white',
                                            } 
                                        }}
                                    >
                                        <Avatar
                                            src={profile.image_URL ?  `http://localhost:8000/${profile.image_URL}` : "/images/default-avatar.jpeg"}
                                            sx={{ width: '100%', height: '100%', mb: 2 }}
/>
                                        <input
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="contained-button-file"
                                            type="file"
                                            onChange={handleImageChange}
                                        />
                                        <label htmlFor="contained-button-file">
                                            <Button
                                                component="span"
                                                className="update-btn"
                                                sx={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    color: themeColors.primary,
                                                    backgroundColor: 'white',
                                                    padding: '2px 2px',
                                                    borderRadius: '2px',
                                                    display: 'none',
                                                }}
                                               
                                            >
                                                Update
                                            </Button>
                                        </label>
                                    </Box>
                                </Grid>
                                <Grid item xs={9}>
                                    <Typography variant="h5" sx={{ color: themeColors.primary, m: 1 }}>
                                        My Profile
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        <VerifiedUser fontSize="small" sx={{ mr: 1 }} />
                                        Account {profile.status}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper sx={{ p: 3, backgroundColor: themeColors.background }}>
                            <Tabs
                                value={tabIndex}
                                onChange={(event, newValue) => setTabIndex(newValue)}
                                indicatorColor="primary"
                                textColor="primary"
                                sx={{ mb: 3 }}
                            >
                                <Tab label="Personal details" />
                                <Tab label="Change Password" />
                            </Tabs>

                            {tabIndex === 0 && (
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        First name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={profile.fName || ''}
                                        sx={{ mb: 2 }}
                                        error={!!errors.firstName}
                                        helperText={errors.firstName}
                                        onChange={(e) => handleProfileFieldChange('fName', e.target.value)}
                                    />

                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Last name
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={profile.lName || ''}
                                        sx={{ mb: 2 }}
                                        error={!!errors.lastName}
                                        helperText={errors.lastName}
                                        onChange={(e) => handleProfileFieldChange('lName', e.target.value)}
                                    />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="body1"
                                                sx={{ fontWeight: 'bold', mb: 1 }}
                                            >
                                                Identity Card Number
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                value={profile.NIC || ''}
                                                sx={{ mb: 2 }}
                                                error={!!errors.NIC}
                                                helperText={errors.NIC}
                                                disabled
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Typography
                                                variant="body1"
                                                sx={{ fontWeight: 'bold', mb: 1 }}
                                            >
                                                Phone number
                                            </Typography>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                value={profile.contact_number || ''}
                                                sx={{ mb: 2 }}
                                                error={!!errors.contact_number}
                                                helperText={errors.contact_number}
                                                onChange={(e) => handleProfileFieldChange('contact_number', e.target.value)}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Email address
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        variant="outlined"
                                        value={profile.email || ''}
                                        sx={{ mb: 2 }}
                                        error={!!errors.email}
                                        helperText={errors.email}
                                        onChange={(e) => handleProfileFieldChange('email', e.target.value)}
                                    />

                                    <Button variant="contained" color="primary" onClick={handleProfileUpdate}>
                                        Update
                                    </Button>
                                </Box>
                            )}

                            {tabIndex === 1 && (
                                <Box>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Current Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        variant="outlined"
                                        value={currentPassword}
                                        sx={{ mb: 2 }}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                    />

                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        New Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        variant="outlined"
                                        value={newPassword}
                                        sx={{ mb: 2 }}
                                        onChange={(e) => handlePasswordFieldChange('newPassword', e.target.value)}
                                    />

                                    <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        Confirm New Password
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        type="password"
                                        variant="outlined"
                                        value={confirmPassword}
                                        sx={{ mb: 2 }}
                                        onChange={(e) => handlePasswordFieldChange('confirmPassword', e.target.value)}
                                    />

                                    <Button variant="contained" color="primary">
                                        Change Password
                                    </Button>
                                </Box>
                            )}
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={() => setOpenSnackbar(false)} severity={severity} >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfilePage;
