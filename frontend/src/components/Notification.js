import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';

export default (props) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={props.open}
      autoHideDuration={3000}
      onClose={props.handleClose}
    >
      <Alert onClose={props.handleClose} severity="success">
        {props.text}
      </Alert>
    </Snackbar>
  );
}
