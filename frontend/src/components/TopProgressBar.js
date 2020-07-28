import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './TopProgressBar.css';

export default (props) => {
  return props.visible && <LinearProgress className="topProgress" />;
};
