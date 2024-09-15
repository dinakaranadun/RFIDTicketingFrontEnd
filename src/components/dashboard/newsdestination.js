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
import Slide from '@mui/material/Slide';
import Slider from 'react-slick'; // Importing Slider
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'; // Left arrow icon
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Right arrow icon

const useStyles = makeStyles((theme) => ({
  dialogImage: {
    width: '100%',
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(2),
  },
  dialogContent: {
    padding: theme.spacing(3),
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    
  },
  dialogTitle: {
    fontWeight: 'bold',
    fontSize: '1.8rem',
    color: theme.palette.primary.main,
  },
  dialogDescription: {
    fontSize: '1.1rem',
    lineHeight: 1.5,
    color: '#555',
    marginTop:'20px'
  },
  buttonBase: {
    maxWidth: '80%',
    transition: 'transform 0.3s, box-shadow 0.3s', 
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', 
    },
  },
  arrow: {
    display: 'block',
    backgroundColor: 'white',
    color: '#0096FF',
    borderRadius: '50%',
    padding: '15px',
    zIndex: 1,
    fontSize: '3rem', 
    '&:hover': {
      backgroundColor: 'white',
      color: '#0096FF',
    },
  },
  sliderCard: {
    paddingLeft: '50px', 
    paddingRight: '5px', 
  },
}));

const CustomPrevArrow = (props) => {
  const { className, onClick } = props;
  const classes = useStyles();
  return (
    <ArrowBackIosIcon className={`${className} ${classes.arrow}`} onClick={onClick} />
  );
};

const CustomNextArrow = (props) => {
  const { className, onClick } = props;
  const classes = useStyles();
  return (
    <ArrowForwardIosIcon className={`${className} ${classes.arrow}`} onClick={onClick} />
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const destinations = [
  {
    title: 'Kandy',
    duration: '3h',
    description: "Kandy is a city in Sri Lanka's Central Province and the country's second largest city.",
    imageUrl: '/images/kandy.jpg',
    images: ['/images/kandy.jpg', '/images/kandy.jpg', '/images/kandy.jpg'],
  },
  {
    title: 'Ella',
    duration: '6h 30m',
    description: 'Ella is a small village in the highlands of Sri Lanka...',
    imageUrl: '/images/ella.jpeg',
    images: ['/images/ella.jpeg', '/images/ella.jpeg', '/images/ella.jpeg'],
  },
  {
    title: 'Matara',
    duration: '3h 30m',
    description: 'Coastal city famous for its beaches and historical landmarks.',
    imageUrl: '/images/matara.jpeg',
    images: ['/images/matara.jpeg', '/images/matara.jpeg', '/images/matara.jpeg'],
  },
  {
    title: 'Jaffna',
    duration: '8h',
    description: 'Northern city known for its vibrant culture and delicious cuisine.',
    imageUrl: '/images/jaffna.jpeg',
    images: ['/images/jaffna.jpeg', '/images/jaffna.jpeg', '/images/jaffna.jpeg'],
  },
  
];

export default function Orders() {
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const theme = useTheme();

  const handleCardClick = (destination) => {
    setSelectedDestination(destination);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const dialogSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <React.Fragment>
      <Typography
        variant="h4"
        style={{ color:'#0096FF', fontWeight: 'bold', marginBottom: '20px' }}
      >
        Discover New Destinations
      </Typography>
      <Slider {...sliderSettings}>
        {destinations.map((destination, index) => (
          <div key={index} className={classes.sliderCard}>
            <ButtonBase
              focusRipple
              className={classes.buttonBase}
              onClick={() => handleCardClick(destination)}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="160"
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
          </div>
        ))}
      </Slider>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '20px',
            padding: '10px',
          },
        }}
      >
        <DialogTitle className={classes.dialogTitle}>
          {selectedDestination ? selectedDestination.title : ''}
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          {selectedDestination && (
            <Slider {...dialogSliderSettings}>
              {selectedDestination.images.map((image, idx) => (
                <CardMedia
                  key={idx}
                  className={classes.dialogImage}
                  component="img"
                  image={image}
                  alt={`${selectedDestination.title} image ${idx + 1}`}
                />
              ))}
            </Slider>
          )}
          <DialogContentText className={classes.dialogDescription}>
            {selectedDestination ? selectedDestination.description : ''}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="contained" style={{ borderRadius: '8px' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
