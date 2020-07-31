import React, { useState, useEffect } from 'react';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InputAdornment from '@material-ui/core/InputAdornment';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import ManageStyles from '../components/ManageStyles';
import NormalSpinner from '../components/NormalSpinner';
import { PartiallyRemoteTable } from '../components/RemoteTable';
import { renderDateTimeField } from '../helpers/renderHelpers';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';
import Api from '../Api';
import GlobalStyles from './GlobalStyles';
import SubTitle from '../components/SubTitle';

// TODO: split page

function PendingBorrows(props) {
  const { t } = useTranslation();
  const manageClasses = ManageStyles();

  return (
    <>
      <SubTitle title={t('manage:pendingBorrows')} />

      <PartiallyRemoteTable
        columns={[
          { title: t('common:title'), field: 'book.title' },
          { title: 'ISBN 13', field: 'book.isbn13' },
          {
            title: t('common:borrowStart'),
            field: 'borrow.start',
            render: (row) => renderDateTimeField(row.borrow.start),
          },
          {
            title: t('common:borrowEnd'),
            field: 'borrow.end',
            render: (row) => (
              <>
                {row.borrow.late && (
                  <AccessTimeIcon
                    className={manageClasses.tableIcon}
                    color="secondary"
                    fontSize="small"
                  />
                )}
                {renderDateTimeField(row.borrow.end)}
              </>
            ),
          },
        ]}
        components={{
          Toolbar: (_) => <></>,
          Container: (props) => <Paper {...props} elevation={0} />,
        }}
        data={props.data}
      />
    </>
  );
}

function ManualAdd(props) {
  const { t } = useTranslation();

  return (
    <>
      <SubTitle title={t('manage:manualAddBorrow')} />
    </>
  );
}

function PerBorrower() {
  const { t } = useTranslation();
  const manageClasses = ManageStyles();
  const [options, setOptions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState(null);
  const [borrowData, setBorrowData] = useState(null);

  useEffect(() => {
    let didCancel = false;
    setSuggestionsLoading(true);

    (async () => {
      const req = await Api.get(
        'borrowers/suggest?q=' + encodeURIComponent(inputValue)
      );
      if (!didCancel) {
        const res = req.data.data;
        setSuggestionsLoading(false);
        setOptions(res);
      }
    })();

    return () => {
      didCancel = true;
    };
  }, [inputValue]);

  return (
    <>
      <Paper className={manageClasses.paper}>
        <Typography className={manageClasses.description} variant="body1">
          {t('manage:borrowText')}
        </Typography>
        <Autocomplete
          inputValue={inputValue}
          onInputChange={(_event, newInputValue) =>
            setInputValue(newInputValue)
          }
          onChange={(_event, newValue) => {
            setValue(newValue);
            setBorrowData(null);
            if (newValue) {
              Api.get('borrows/by-borrower/' + newValue.id)
                .then((res) => {
                  const data = res.data.data;
                  setBorrowData(data);
                })
                .catch((e) => console.error(e)); // TODO
            }
          }}
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
                    {suggestionsLoading && (
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
      </Paper>

      {value &&
        (borrowData ? (
          <>
            <Paper className={manageClasses.paper}>
              <ManualAdd />
            </Paper>
            <Paper className={manageClasses.paper}>
              <PendingBorrows data={borrowData} />
            </Paper>
          </>
        ) : (
          <NormalSpinner />
        ))}
    </>
  );
}

function Stats() {
  return (
    <>
      <p>hi</p>
    </>
  );
}

export default function () {
  const { t } = useTranslation();
  const ROUTES = [
    {
      path: '/borrows/by-borrower',
      title: t('manage:borrowsPerBorrower'),
      component: PerBorrower,
    },
    {
      path: '/borrows/test2',
      title: t('manage:borrowsStats'),
      component: Stats,
    },
  ];
  const location = useLocation();
  const getIdx = () => {
    const idx = ROUTES.findIndex((item) => item.path === location.pathname);
    return idx > -1 ? idx : false;
  };

  const globalClasses = GlobalStyles();
  const history = useHistory();
  const [tabValue, setTabValue] = useState(getIdx);

  useEffect(() => {
    setTabValue(getIdx());
    // Silence false-positive
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <>
      <div className="navbar navbar-tabs">
        <Tabs
          value={tabValue}
          onChange={(_event, idx) => history.push(ROUTES[idx].path)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {ROUTES.map((item, idx) => (
            <Tab key={idx} label={item.title} />
          ))}
        </Tabs>
      </div>
      <Container>
        {/*<Title title={ROUTES[tabValue].title} />*/}
        <div className={globalClasses.titleSpacer} />
        <Switch>
          {ROUTES.map((item) => (
            <Route exact path={item.path} component={item.component} />
          ))}
        </Switch>
      </Container>
    </>
  );
}
