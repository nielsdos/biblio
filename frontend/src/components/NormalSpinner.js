import React from 'react';
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    marginTop: theme.spacing(5),
  },
}));

export default (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size="6rem" thickness={1} />
    </div>
  );
}
