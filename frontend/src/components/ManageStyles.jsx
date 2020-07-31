import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  toolbar: {
    marginBottom: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(2),
    whiteSpace: 'pre-line',
  },
  tableIcon: {
    marginRight: theme.spacing(0.5),
    verticalAlign: 'text-bottom',
  },
}));
