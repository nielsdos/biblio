import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import Title from '../components/Title';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import CheckIcon from '@material-ui/icons/Check';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ManageStyles from '../components/ManageStyles';
import Api from '../Api';

function BorrowerSearch() {
  const { t } = useTranslation();
  const manageClasses = ManageStyles();
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);

  useEffect(() => {
    let didCancel = false;
    setIsLoading(true);

    (async () => {
      const req = await Api.get(
        'borrowers/suggest?q=' + encodeURIComponent(inputValue)
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
  }, [inputValue]);

  return (
    <Paper className={manageClasses.paper}>
      <Typography className={manageClasses.description} variant="body1">
        {t('manage:borrowText')}
      </Typography>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          // Workaround issue where we can't set the autocomplete on required
          if (!value) {
            setInputValue('');
            setTimeout(() => e.target.reportValidity(), 1);
          } else {
            alert(value.id);
          }
        }}
      >
        <Autocomplete
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) =>
            setInputValue(newInputValue)
          }
          onChange={(_event, newValue) => setValue(newValue)}
          options={options}
          getOptionLabel={(option) =>
            `${option.first_name} ${option.last_name}`
          }
          getOptionSelected={(option, value) => option.id === value.id}
          name="borrower"
          loadingText={t('common:loading')}
          noOptionsText={t('common:noResults')}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t('common:borrower')}
              margin="normal"
              fullWidth
              autoFocus
              required
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading && (
                      <CircularProgress color="inherit" size={20} />
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <AssignmentIndIcon />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          startIcon={<CheckIcon />}
        >
          {t('manage:borrowerSelect')}
        </Button>
      </form>
    </Paper>
  );
}

export default function() {
  const { t } = useTranslation();

  return (
    <Container>
      <Title title={t('manage:borrows')} />
      <BorrowerSearch />
    </Container>
  );
}
