import React from 'react';
import { Typography } from '@material-ui/core';
import GlobalStyles from '../pages/GlobalStyles';

export default (props) => {
  const classes = GlobalStyles();

  return (
    <Typography className={classes.titleSpacer} component="h1" variant="h4">
      {props.title}
    </Typography>
  );
};
