import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
  },
  horizontal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    margin: theme.spacing(2, 0, 3, 0),
  },
  socialLogo: {
    margin: theme.spacing(0, 1, 0, 0),
    width: '24px',
    height: '24px',
  },
  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  icon: {
    margin: theme.spacing(1),
    fontSize: '2.02rem',
  },
  submit: {
    margin: theme.spacing(2, 0, 1),
  },
}));
