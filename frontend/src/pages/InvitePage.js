import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from '@material-ui/core/InputAdornment';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import Alert from "@material-ui/lab/Alert";
import {Field, Formik} from "formik";
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import { useTranslation } from 'react-i18next';
import Api, {getErrorObjectFromResponse} from "../Api";
import TopProgressBar from "../components/TopProgressBar";
import AuthStyles from './AuthStyles';

const useStyles = AuthStyles;

export default (props) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [errorTexts, setErrorTexts] = useState({});
  const [isFinished, setIsFinished] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);

  return (
    <Container maxWidth="sm">
      <Card className={classes.paper}>
        <Formik
          initialValues={{first_name: '', last_name: '', email: searchParams.get('email') || '', password: '', password_confirmation: ''}}
          onSubmit={(data, {setSubmitting}) => {
            setSubmitting(true);
            setErrorTexts({});

            const sentData = Object.assign({
              'token': searchParams.get('token') || '',
            }, data);

            Api.post('/auth/register', sentData)
              .then(_ => {
                setSubmitting(false);
                setIsFinished(true);
              })
              .catch(e => {
                setErrorTexts(getErrorObjectFromResponse(e, t, 'email'));
                setSubmitting(false);
              });
          }}>
          {({isSubmitting, handleSubmit}) => (
            <>
              <TopProgressBar visible={isSubmitting} />
              <CardContent>
                <div className={classes.horizontal}>
                  <PersonAddOutlinedIcon color="secondary" className={classes.icon}/>
                  <Typography component="h1" variant="h4">
                    {t('common:register')}
                  </Typography>
                </div>
                {isFinished ? (
                  <p>{t('common:accountHasBeenCreated')}</p>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {errorTexts.general && (<Alert severity="error">{errorTexts.general}</Alert>)}
                    <Field
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailOutlinedIcon />
                          </InputAdornment>
                        )
                      }}
                      name="email"
                      type="email"
                      as={TextField}
                      required
                      disabled
                      margin="normal"
                      fullWidth
                      label={t('common:email')}
                      autoComplete="email"
                      error={!!errorTexts.email}
                      helperText={errorTexts.email}
                    />
                    <Field
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PermIdentityOutlinedIcon />
                          </InputAdornment>
                        )
                      }}
                      name="first_name"
                      type="text"
                      as={TextField}
                      required
                      margin="normal"
                      fullWidth
                      label={t('common:firstName')}
                      placeholder={t('common:firstName')}
                      autoFocus
                      error={!!errorTexts.first_name}
                      helperText={errorTexts.first_name}
                    />
                    <Field
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PermIdentityOutlinedIcon />
                          </InputAdornment>
                        )
                      }}
                      name="last_name"
                      type="text"
                      as={TextField}
                      required
                      margin="normal"
                      fullWidth
                      label={t('common:lastName')}
                      placeholder={t('common:lastName')}
                      error={!!errorTexts.last_name}
                      helperText={errorTexts.last_name}
                    />
                    <Field
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyOutlinedIcon />
                          </InputAdornment>
                        )
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
                        )
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
                    >{t('common:register')}</Button>
                  </form>
                )}
              </CardContent>
            </>
          )}
        </Formik>
      </Card>
    </Container>
  );
};
