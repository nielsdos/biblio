import React from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import BookSearch from '../components/BookSearch';
import Title from '../components/Title';
import {AuthContext} from "../AuthContext";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { useTranslation } from 'react-i18next';
import ManageStyles from './ManageStyles';
import {Link} from "react-router-dom";

function Toolbar() {
  const {t} = useTranslation();
  const classes = ManageStyles();

  return (
    <div className={classes.toolbar}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        component={Link}
        to="/add-book"
      >
        {t('manage:addBook')}
      </Button>
    </div>
  );
}

export default function() {
  const {t} = useTranslation();

  return (
    <Container>
      <Title title={t('common:home')} />
      <AuthContext.Consumer>
        {authState => authState.loggedIn && (
          <Toolbar />
        )}
      </AuthContext.Consumer>
      <BookSearch />
    </Container>
  );
}
