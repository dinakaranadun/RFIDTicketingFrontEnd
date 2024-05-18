import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ButtonBase from '@mui/material/ButtonBase';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  dialogImage: {
    width: '100%',
    borderRadius: theme.shape.borderRadius,
  },
}));

// Generate Data
const destinations = [
  {
    title: 'Kandy',
    duration: '3h',
    description: "Kandy is a city in Sri Lanka's Central Province and the country's second largest city. It's located in the Kandy plateau, surrounded by hills and tropical plantations, mainly tea. The city is at an elevation of 1,640 feet (500 meters) above sea level and is surrounded by the Knuckles and Hunnasgiriya Mountain Ranges",
    imageUrl: '/images/kandy.jpg',
  },
  {
    title: 'Ella',
    duration: '6h 30m',
    description: "Ella is a small village in the highlands of Sri Lanka which is filled with tea estates, mountains, waterfalls and of course with some good air to breath. Lots of people make Ella as one of their must visit destination just to witness the breathtaking views it creates",
    imageUrl: '/images/ella.jpeg',
  },
  {
    title: 'Matara',
    duration: '3h 30m',
    description: 'Coastal city famous for its beaches and historical landmarks.',
    imageUrl: '/images/matara.jpeg',
  },
  {
    title: 'Jaffna',
    duration: '8h',
    description: 'Northern city known for its vibrant culture and delicious cuisine.',
    imageUrl: '/images/jaffna.jpeg',
  },
];

export default function Orders() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const handleCardClick = (destination) => {
    setSelectedDestination(destination);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Typography variant="h4" style={{ color: 'black', fontWeight: 'bold', marginBottom: '20px' }}>
        Discover New Destinations
      </Typography>
      <Grid container spacing={15}>
        {destinations.map((destination, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <ButtonBase
              focusRipple
              style={{ maxWidth: '100%', transition: 'transform 0.3s' }}
              onClick={() => handleCardClick(destination)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={destination.imageUrl}
                  alt={destination.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {destination.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {destination.duration}
                  </Typography>
                </CardContent>
              </Card>
            </ButtonBase>
          </Grid>
        ))}
      </Grid>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedDestination ? selectedDestination.title : ''}</DialogTitle>
        <DialogContent>
          <CardMedia
            className={classes.dialogImage}
            component="img"
            image={selectedDestination ? selectedDestination.imageUrl : ''}
            alt={selectedDestination ? selectedDestination.title : ''}
          />
          <DialogContentText>{selectedDestination ? selectedDestination.description : ''}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
