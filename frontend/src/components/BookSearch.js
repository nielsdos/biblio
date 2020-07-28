import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import SearchBar from './SearchBar';
import NormalSpinner from './NormalSpinner';
import Api from '../Api';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import SearchResultsDisclaimer from './SearchResultsDisclaimer';
import BookResult, { postProcessResults } from './BookResult';
import DeleteDialog from './DeleteDialog';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(2),
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

function ManageBooks(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  return (
    <>
      <Menu
        id="item-menu"
        anchorEl={props.itemMenuAnchorEl}
        keepMounted
        open={Boolean(props.itemMenuAnchorEl)}
        onClose={props.handleItemMenuClose}
      >
        <MenuItem
          onClick={() => {
            props.handleItemMenuClose();
            history.push('/books/' + props.bookId + '/edit');
          }}
        >
          <CreateIcon className="menu-icon" />
          {t('common:edit')}
        </MenuItem>
        <MenuItem
          onClick={(_e) => {
            props.handleItemMenuClose();
            setDeleteDialogOpen(true);
          }}
        >
          <DeleteIcon className="menu-icon" />
          {t('common:delete')}
        </MenuItem>
      </Menu>

      <DeleteDialog
        title={t('manage:deleteBook')}
        text={t('manage:deleteBookText')}
        successText={t('manage:deleteBookSuccess')}
        submit={(data) => Api.delete('books/' + props.bookId, data)}
        open={deleteDialogOpen}
        onDelete={() => {
          // Remove from item list
          props.setResults(
            props.results.filter((item) => item.id !== props.bookId)
          );
        }}
        onClose={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}

export default function (props) {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const { t } = useTranslation();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [inputValue, setInputValue] = useState(getSearchFromQueryString());
  const [defaultValue] = useState(getSearchFromQueryString());

  // Management stuff
  const [itemMenuAnchorEl, setItemMenuAnchorEl] = useState(null);
  const [handlingBookId, setHandlingBookId] = useState(-1);

  const onSearch = (q) => {
    const search = '?q=' + encodeURIComponent(q);
    history.push({ search });
    setHasRequested(true);
    setIsLoading(true);
    return Api.get('books' + search)
      .then((res) => {
        const data = res.data.data;
        postProcessResults(data);
        setResults(data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        // TODO: error message
      });
  };

  useEffect(() => {
    const q = getSearchFromQueryString();
    if (q !== inputValue) {
      setInputValue(q);
      onSearch(q);
    }
    // Silence false-positive (we only want this actually on search string changes, not input changes)
    // eslint-disable-next-line
  }, [location.search]);

  useEffect(() => {
    if (inputValue) {
      onSearch(inputValue);
    }
    // Silence false-positive
    // eslint-disable-next-line
  }, []);

  const handleItemMenuOpen = (event, itemId) => {
    setHandlingBookId(itemId);
    setItemMenuAnchorEl(event.currentTarget);
  };

  const handleItemMenuClose = () => {
    setItemMenuAnchorEl(null);
  };

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
      ) : hasRequested ? (
        results.length === 0 ? (
          <p className={classes.errorMsg}>{t('common:noResults')}</p>
        ) : (
          <>
            <Paper className={classes.paper}>
              <List>
                {results.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && (
                      <Divider className={classes.divider} component="li" />
                    )}
                    <BookResult
                      item={item}
                      showAvailability
                      addendum={
                        <IconButton
                          aria-controls="item-menu"
                          aria-haspopup="true"
                          onClick={(e) => handleItemMenuOpen(e, item.id)}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      }
                    />
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

      <ManageBooks
        itemMenuAnchorEl={itemMenuAnchorEl}
        bookId={handlingBookId}
        results={results}
        setResults={setResults}
        handleItemMenuClose={handleItemMenuClose}
      />
    </>
  );
}
