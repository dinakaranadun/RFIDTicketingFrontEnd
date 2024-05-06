import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import ButtonBase from '@mui/material/ButtonBase';

// Generate Data
const destinations = [
  {
    title: 'Kandy',
    duration: '3h',
    imageUrl: 'https://via.placeholder.com/300',
  },
  {
    title: 'Ella',
    duration: '6h 30m',
    imageUrl: 'https://via.placeholder.com/300',
  },
  {
    title: 'Matara',
    duration: '3h 30m',
    imageUrl: 'https://via.placeholder.com/300',
  },
  {
    title: 'Jaffna',
    duration: '8h',
    imageUrl: 'https://via.placeholder.com/300',
  },
];

export default function Orders() {
  // Define preventDefault here
  const preventDefault = (event) => {
    event.preventDefault();
  };

  return (
    <React.Fragment>
      <Typography variant="h4" style={{ color: 'black', fontWeight: 'bold', marginBottom: '20px' }}>
        Discover New Destinations
      </Typography>
      <Grid container spacing={5}>
        {destinations.map((destination, index) => (
          <Grid item key={index} xs={12} sm={6} md={3}>
            <ButtonBase
              focusRipple
              style={{ maxWidth: '100%', transition: 'transform 0.3s' }}
              onClick={preventDefault}
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
    </React.Fragment>
  );
}
