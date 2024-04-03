import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';

import Title from './Title';



export default function Chart() {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>Main</Title>
    </React.Fragment>
  );
}
