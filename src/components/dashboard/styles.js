// src/styles/styles.js

import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import ListItemButton from '@mui/material/ListItemButton';

export const StyledButton = styled(Button)(({theme}) => ({
  width: '200px',
  borderRadius: '20px',
  padding: '10px 20px',
  color: 'white',
  backgroundColor: '#0096FF	',
  transition: 'background-color 0.3s',
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    color: 'white',
  },
}));

export const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  backgroundColor: active ? '#0096FF' : 'transparent',
  color: active ? theme.palette.primary.contrastText : 'inherit',
  '&:hover': {
    backgroundColor: active ? theme.palette.primary.dark : theme.palette.action.hover,
  },
}));
