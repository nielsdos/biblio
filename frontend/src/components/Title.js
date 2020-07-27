import React from 'react';
import { Typography } from '@material-ui/core';

export default (props) => {
  return (
    <Typography style={{marginTop: '0.5em', marginBottom: '0.5em'}} component="h1" variant="h4">
      {props.title}
    </Typography>
  );
};
