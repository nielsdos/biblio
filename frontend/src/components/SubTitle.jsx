import React from 'react';
import { Typography } from '@material-ui/core';
import GlobalStyles from '../pages/GlobalStyles';

export default (props) => {
  const classes = GlobalStyles();

  return (
    <Typography className={classes.subTitleSpacer} component="h2" variant="h6">
      {props.title}
    </Typography>
  );
};
