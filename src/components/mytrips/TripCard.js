import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.12)',
  },
  borderRadius: '16px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  padding: theme.spacing(2),
}));

const TripCard = ({ trip, onClick }) => {
  return (
    <StyledCard onClick={() => onClick(trip)}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {trip.start_station.station_name} to {trip.end_station.station_name}
        </Typography>
        <Typography color="textSecondary">
          {trip.date}
        </Typography>
        <Typography variant="body2" noWrap>
          {trip.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          View Details
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default TripCard;
