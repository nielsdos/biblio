import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import Paper from '@material-ui/core/Paper';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { InputBase } from '@material-ui/core';
import Api from '../Api';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1),
  },
  input: {
    flex: 1,
    marginLeft: theme.spacing(1),
  },
  iconButton: {
    padding: 10,
  },
}));

export default (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.inputValue) {
      let didCancel = false;
      setIsLoading(true);

      (async () => {
        // TODO: show '-' in output if it's found in input??
        const req = await Api.get(
          'books/suggest?q=' + encodeURIComponent(props.inputValue)
        );
        if (!didCancel) {
          const res = req.data.data;

          setIsLoading(false);
          setOptions(res);
        }
      })();

      return () => {
        didCancel = true;
      };
    } else {
      setOptions([]);
    }
  }, [props.inputValue]);

  function getOptionLabel(option) {
    if (typeof option === 'string') {
      return option;
    } else {
      return `${option.title} (${option.isbn13})`;
    }
  }

  return (
    <Autocomplete
      className={classes.root}
      getOptionSelected={(option, value) => option.isbn13 === value.isbn13}
      getOptionLabel={getOptionLabel}
      options={options}
      loading={isLoading}
      defaultValue={props.defaultValue}
      inputValue={props.inputValue}
      onInputChange={(_event, newInputValue) =>
        newInputValue && props.setInputValue(newInputValue)
      }
      onChange={(_event, newInputValue) => {
        if (newInputValue?.isbn13) {
          const option = getOptionLabel(newInputValue);
          props.onSearch(option);
        }
      }}
      freeSolo
      loadingText={t('common:loading')}
      renderInput={(params) => (
        <Paper
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            props.onSearch(props.inputValue);
          }}
          className={classes.paper}
        >
          <InputBase
            {...params}
            ref={params.InputProps.ref}
            className={classes.input}
            name="q"
            type="text"
            placeholder={t('common:isbn')}
            autoFocus
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isLoading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
          <IconButton
            type="submit"
            className={classes.iconButton}
            aria-label={t('common:search')}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      )}
    />
  );
};
