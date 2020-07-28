import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputAdornment from '@material-ui/core/InputAdornment';
import Alert from '@material-ui/lab/Alert';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import { Field, Formik } from 'formik';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import { useTranslation } from 'react-i18next';
import TopProgressBar from '../components/TopProgressBar';
import AuthStyles from './AuthStyles';
import { AuthContext } from '../AuthContext';
import Api, { getErrorObjectFromResponse } from '../Api';

const useStyles = AuthStyles;

export default (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [errorTexts, setErrorTexts] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  return (
    <Container maxWidth="sm">
      <Card className={classes.paper}>
        <AuthContext.Consumer>
          {(auth) => (
            <Formik
              initialValues={{ password: '', password_confirmation: '' }}
              onSubmit={(data, { setSubmitting }) => {
                setSubmitting(true);
                setErrorTexts({});

                const params = new URLSearchParams(window.location.search);
                const sentData = Object.assign(
                  {
                    email: params.get('email') || '',
                    token: params.get('token') || '',
                  },
                  data
                );

                Api.post('auth/reset', sentData)
                  .then(async (_) => {
                    setSubmitting(false);
                    await auth.actions.tryLoadUser();
                    setIsFinished(true);
                  })
                  .catch((e) => {
                    setErrorTexts(getErrorObjectFromResponse(e, t, 'general'));
                    setSubmitting(false);
                  });
              }}
            >
              {({ isSubmitting, handleSubmit }) => (
                <>
                  <TopProgressBar visible={isSubmitting} />
                  <CardContent>
                    <div className={classes.horizontal}>
                      <LockOutlinedIcon
                        color="secondary"
                        className={classes.icon}
                      />
                      <Typography component="h1" variant="h4">
                        {t('common:resetPassword')}
                      </Typography>
                    </div>
                    {isFinished ? (
                      <p>{t('common:passwordHasBeenReset')}</p>
                    ) : (
                      <form onSubmit={handleSubmit}>
                        {errorTexts.general && (
                          <Alert severity="error">{errorTexts.general}</Alert>
                        )}
                        <Field
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <VpnKeyOutlinedIcon />
                              </InputAdornment>
                            ),
                          }}
                          name="password"
                          type="password"
                          as={TextField}
                          required
                          margin="normal"
                          fullWidth
                          label={t('common:password')}
                          placeholder={t('common:password')}
                          autoComplete="current-password"
                          error={!!errorTexts.password}
                          helperText={errorTexts.password}
                        />
                        <Field
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <VpnKeyOutlinedIcon />
                              </InputAdornment>
                            ),
                          }}
                          name="password_confirmation"
                          type="password"
                          as={TextField}
                          required
                          margin="normal"
                          fullWidth
                          label={t('common:passwordRepeat')}
                          placeholder={t('common:passwordRepeat')}
                          autoComplete="current-password"
                          error={!!errorTexts.password_confirmation}
                          helperText={errorTexts.password_confirmation}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          className={classes.submit}
                          size="large"
                          fullWidth
                        >
                          {t('common:resetPassword')}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </>
              )}
            </Formik>
          )}
        </AuthContext.Consumer>
      </Card>
    </Container>
  );
};
