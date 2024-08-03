import React from 'react';
import { ReactComponent as OneSvg } from './assets/number-one-round-icon.svg';
import { ReactComponent as TwoSvg } from './assets/number-two-round-icon.svg';
import { ReactComponent as ThreeSvg } from './assets/number-three-round-icon.svg';
import SvgIcon from '@mui/material/SvgIcon';

export const OneIcon = (props) => (
  <SvgIcon component={OneSvg} viewBox="0 0 120 120" {...props} />
);

export const TwoIcon = (props) => (
  <SvgIcon component={TwoSvg} viewBox="0 0 120 120" {...props} />
);

export const ThreeIcon = (props) => (
  <SvgIcon component={ThreeSvg} viewBox="0 0 120 120" {...props} />
);
