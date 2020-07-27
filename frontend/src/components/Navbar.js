import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Link, useHistory} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../AuthContext";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PersonIcon from '@material-ui/icons/Person';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';

const useStyles = makeStyles((theme) => ({
  flex: {
    flexGrow: 1,
  },
  mr: {
    marginRight: theme.spacing(1),
  },
}));

export default function Navbar() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();

  return (
    <AuthContext.Consumer>
      {authState => (
        <AppBar color="white" className="navbar" position="sticky">
          <Toolbar>
            <div className={classes.flex}>
              <Button className={classes.mr} startIcon={<LibraryBooksIcon />} color="primary" variant="outlined" to="/" component={Link}>{t('common:home')}</Button>
              {authState.loggedIn && (
                <>
                  <Button className={classes.mr} startIcon={<AssignmentIndIcon />} color="primary" variant="outlined" to="/borrowers" component={Link}>{t('manage:borrowers')}</Button>
                  <Button startIcon={<PersonIcon />} color="primary" variant="outlined" to="/users" component={Link}>{t('manage:users')}</Button>
                </>
              )}
            </div>
            {authState.loggedIn ? (
              <>
                <span className={classes.mr}>{authState.user.first_name} {authState.user.last_name}</span>
                <Button startIcon={<ExitToAppIcon />} variant="outlined" onClick={() => {
                  authState.actions.logOut().then(_ => history.replace('/login'));
                }}>Log out</Button>
              </>
            ) : (
              <>
                <Button startIcon={<LockOutlinedIcon />} color="primary" variant="outlined" to="/login" component={Link}>{t('common:login')}</Button>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
    </AuthContext.Consumer>
  );
}
