import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Alert from '@material-ui/lab/Alert';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ListAltIcon from '@material-ui/icons/ListAlt';
import { useTranslation } from 'react-i18next';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import SearchIcon from '@material-ui/icons/Search';
import SaveIcon from '@material-ui/icons/Save';
import NormalSpinner from '../components/NormalSpinner';
import TopProgressBar from '../components/TopProgressBar';
import { Field, Formik } from 'formik';
import Api, { getErrorObjectFromResponse } from '../Api';
import BookResult, { postProcessResult } from '../components/BookResult';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  rootAddBook: {
    overflowY: 'hidden',
  },
  extraInfo: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  generalError: {
    paddingBottom: 0,
    marginBottom: 0,
  },
  dataSource: {
    margin: theme.spacing(1, 0),
  },
  description: {
    marginBottom: theme.spacing(2),
    whiteSpace: 'pre-line',
  },
}));

// TODO: adding should be nicer and allow own data source
export default function (props) {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const [isSearching, setIsSearching] = useState(false);
  const [searchErrorTexts, setSearchErrorTexts] = useState({});
  const [addErrorTexts, setAddErrorTexts] = useState({});
  const [bookData, setBookData] = useState(props.bookData);

  function searchData(isbn) {
    setBookData(undefined);
    setIsSearching(true);
    setSearchErrorTexts({});

    Api.post('books/lookup', { isbn: isbn.replace(/[- ]/g, '') })
      .then((res) => {
        const data = res.data;
        // TODO: maybe do this on the server if we ever decide to have links to publisher pages etc?
        data.publisher = { name: data.publisher };
        data.authors = data.authors.map((name) => ({ name }));
        setBookData(postProcessResult(data));
        setIsSearching(false);
      })
      .catch((e) => {
        setSearchErrorTexts(getErrorObjectFromResponse(e, t, 'isbn'));
        setIsSearching(false);
      });
  }

  return (
    <>
      {props.add && (
        <Paper className={classes.paper}>
          <Typography className={classes.description} variant="body1">
            {t('manage:addBookText')}
          </Typography>
          <Formik
            initialValues={{ isbn: '' }}
            onSubmit={(data) => searchData(data.isbn)}
          >
            {({ handleSubmit }) => (
              <>
                <form onSubmit={handleSubmit}>
                  <Field
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <MenuBookIcon />
                        </InputAdornment>
                      ),
                    }}
                    name="isbn"
                    type="text"
                    as={TextField}
                    required
                    margin="normal"
                    fullWidth
                    autoFocus
                    label={t('common:isbn')}
                    error={!!searchErrorTexts.isbn}
                    helperText={searchErrorTexts.isbn}
                  />
                  {/*<div className={classes.dataSource}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">{t('common:dataSource')}</FormLabel>
                      <RadioGroup required aria-label={t('common:dataSource')} name="data_source" value={values.data_source} onChange={handleChange}>
                        <FormControlLabel value="openlibrary" control={<Radio />} label="Open Library" />
                      </RadioGroup>
                    </FormControl>
                  </div>*/}
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={<SearchIcon />}
                  >
                    {t('manage:addBookSearch')}
                  </Button>
                </form>
              </>
            )}
          </Formik>
        </Paper>
      )}

      {isSearching && <NormalSpinner />}

      {bookData && (
        <Formik
          initialValues={props.initialAddValues}
          onSubmit={(data, { setSubmitting }) => {
            setSubmitting(true);
            setAddErrorTexts({});

            Api.post('books', {
              isbn: bookData.isbn13,
              number_of_copies: data.number_of_copies,
            })
              .then((_) => {
                setSubmitting(false);
                history.push({
                  pathname: '/',
                  search: '?q=' + bookData.isbn13,
                });
              })
              .catch((e) => {
                setSubmitting(false);
                setAddErrorTexts(getErrorObjectFromResponse(e, t, 'isbn'));
              });
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Paper className={classes.rootAddBook}>
              <TopProgressBar visible={isSubmitting} />
              {addErrorTexts.isbn && (
                <div className={`${classes.paper} ${classes.generalError}`}>
                  <Alert severity="error">{addErrorTexts.isbn}</Alert>
                </div>
              )}
              <BookResult item={bookData} showAvailability={false} />
              <div className={`${classes.paper} ${classes.extraInfo}`}>
                <form onSubmit={handleSubmit}>
                  <Field
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <ListAltIcon />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      min: '1',
                      max: '99999',
                    }}
                    name="number_of_copies"
                    type="number"
                    as={TextField}
                    required
                    margin="normal"
                    fullWidth
                    label={t('common:numberOfCopies')}
                    error={!!addErrorTexts.number_of_copies}
                    helperText={addErrorTexts.number_of_copies}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    startIcon={props.add ? <AddCircleIcon /> : <SaveIcon />}
                  >
                    {props.add ? t('manage:addBook') : t('common:save')}
                  </Button>
                </form>
              </div>
            </Paper>
          )}
        </Formik>
      )}
    </>
  );
}
