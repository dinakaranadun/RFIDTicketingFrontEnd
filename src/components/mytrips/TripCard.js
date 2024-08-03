import React from 'react';
import { Card, CardContent, CardActions, Button, Typography, Box } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  cursor: 'pointer',
}));

const TripCard = ({ trip, onClick }) => {
  return (
    <StyledCard onClick={() => onClick(trip)}>
      <CardContent>
        <Typography variant="h6" gutterBottom>{trip.title}</Typography>
        <Typography color="textSecondary">{trip.date}</Typography>
        <Typography variant="body2" noWrap>{trip.description}</Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">Learn More</Button>
      </CardActions>
    </StyledCard>
  );
};

export default TripCard;
