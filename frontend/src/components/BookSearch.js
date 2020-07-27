import React, {useState, useEffect} from 'react';
import {useHistory} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import {makeStyles} from "@material-ui/core/styles";
import SearchBar from './SearchBar';
import NormalSpinner from './NormalSpinner';
import Api from "../Api";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import SearchResultsDisclaimer from './SearchResultsDisclaimer';
import BookResult, {postProcessResults} from './BookResult';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
  },
  errorMsg: {
    textAlign: 'center',
  },
  divider: {
    marginLeft: theme.spacing(21),
  },
  paper: {
    marginBottom: theme.spacing(1),
  },
}));

function getSearchFromQueryString() {
  const search = new URLSearchParams(window.location.search);
  return search.get('q') || '';
}

export default (props) => {
  const history = useHistory();
  const classes = useStyles();
  const {t} = useTranslation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [inputValue, setInputValue] = useState(getSearchFromQueryString());
  const [defaultValue] = useState(getSearchFromQueryString());

  const onSearch = q => {
    const search = '?q=' + encodeURIComponent(q);
    history.push({search});
    setHasRequested(true);
    setIsLoading(true);
    return Api.get('books' + search)
      .then(res => {
        const data = res.data.data;
        postProcessResults(data);
        setResults(data);
        setIsLoading(false);
      })
      .catch(e => {
        setIsLoading(false);
        // TODO: error message
      });
  };

  useEffect(() => {
    const q = getSearchFromQueryString();
    if(q !== inputValue) {
      setInputValue(q);
      onSearch(q);
    }
    // Silence false-positive
    // eslint-disable-next-line
  }, [window.location.search]);

  useEffect(() => {
    if(inputValue) {
      onSearch(inputValue);
    }
    // Silence false-positive
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className={classes.root}>
        <Grid xs={9} sm={9} md={6}>
          <SearchBar
            onSearch={onSearch}
            inputValue={inputValue}
            setInputValue={setInputValue}
            defaultValue={defaultValue}
          />
        </Grid>
      </div>
      {isLoading ? (
        <NormalSpinner />
      ) : hasRequested ? (results.length === 0 ? (
          <p className={classes.errorMsg}>{t('common:noResults')}</p>
        ) : (
          <>
            <Paper className={classes.paper}>
              <List>
                {results.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && (<Divider className={classes.divider} component="li" />)}
                    <BookResult item={item} showAvailability />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
            <SearchResultsDisclaimer />
          </>
        )
      ) : (
        <></>
      )}
    </>
  );
}
