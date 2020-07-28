import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Link, useHistory, useLocation} from "react-router-dom";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Tooltip from "@material-ui/core/Tooltip";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import {useTranslation} from "react-i18next";
import {AuthContext} from "../AuthContext";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import PersonIcon from '@material-ui/icons/Person';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import PanToolIcon from '@material-ui/icons/PanTool';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles((theme) => ({
  flex: {
    flexGrow: 1,
  },
  right: {
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    height: '100%',
    marginRight: theme.spacing(1),
    display: 'flex',
  },
  avatar: {
    cursor: 'pointer',
  },
}));

const PATH_MAP = new Map();
PATH_MAP.set('/add-book', '/');

/**
 * Translates a specific pathname to a more generic one.
 * This means it'll categorize stuff like "add-book" to "books".
 *
 * @param {string} path The pathname to translate
 * @return {string} The translated pathname
 */
function translatePathToKey(path) {
  let candidate = PATH_MAP.get(path);
  if(candidate) return candidate;
  return path;
}

export default function Navbar() {
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation(); // auto-updates for us, history.location doesn't
  const matches = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const path = translatePathToKey(location.pathname);

  return (
    <AuthContext.Consumer>
      {authState => (
        <Grid justify-content="space-between" className={'navbar ' + (matches ? 'navbar-bottom' : 'navbar-top')} container>
          <Grid item className={classes.flex}>
            <BottomNavigation value={path} showLabels>
              <BottomNavigationAction label={t('common:home')} value="/" to="/" component={Link} icon={<LibraryBooksIcon />} />
              {authState.loggedIn && <BottomNavigationAction label={t('manage:borrows')} value="/borrows" to="/borrows" component={Link} icon={<PanToolIcon />} />}
              {authState.loggedIn && <BottomNavigationAction label={t('manage:borrowers')} value="/borrowers" to="/borrowers" component={Link} icon={<AssignmentIndIcon />} />}
              {authState.loggedIn && <BottomNavigationAction label={t('manage:users')} value="/users" to="/users" component={Link} icon={<PersonIcon />} />}
            </BottomNavigation>
          </Grid>
          <Grid item className={classes.right}>
            {authState.loggedIn ? (
              <>
                <Tooltip title={authState.user.first_name + ' ' + authState.user.last_name}>
                  <Avatar
                    aria-controls="profile-menu"
                    aria-haspopup="true"
                    onClick={handleOpen}
                    className={classes.avatar}
                  >{authState.user.first_name[0]}{authState.user.last_name[0]}</Avatar>
                </Tooltip>
                <Menu
                  id="profile-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => {
                    authState.actions.logOut().then(_ => history.replace('/login'));
                    handleClose();
                  }}>
                    <ExitToAppIcon className="menu-icon" />Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <BottomNavigation value={path} showLabels>
                <BottomNavigationAction label={t('common:login')} value="/login" to="/login" component={Link} icon={<LockOutlinedIcon />} />
              </BottomNavigation>
            )}
          </Grid>
        </Grid>
      )}
    </AuthContext.Consumer>
  );
}
