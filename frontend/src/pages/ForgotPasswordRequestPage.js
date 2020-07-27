import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from '@material-ui/core/InputAdornment';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Field, Formik} from "formik";
import {Link} from "react-router-dom";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import { useTranslation } from 'react-i18next';
import TopProgressBar from "../components/TopProgressBar";
import AuthStyles from './AuthStyles';
import Api from '../Api';

const useStyles = AuthStyles;

export default (props) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [errorText, setErrorText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  return (
    <Container maxWidth="sm">
      <Card className={classes.paper}>
        <Formik
          initialValues={{email: ''}}
          onSubmit={(data, {setSubmitting}) => {
            setSubmitting(true);
            setErrorText('');

            Api.post('auth/forgot', data)
              .then(_ => {
                setSubmitting(false);
                setIsFinished(true);
              })
              .catch(e => {
                if (e.response) {
                  const {status} = e.response;
                  if (status === 429) {
                    setErrorText('error:throttled');
                  } else {
                    setErrorText('error:unknown');
                  }
                } else {
                  setErrorText('error:connection');
                }
                setSubmitting(false);
              });
          }}>
          {({isSubmitting, handleSubmit}) => (
            <>
              <TopProgressBar visible={isSubmitting} />
              <CardContent>
                <div className={classes.horizontal}>
                  <LockOutlinedIcon color="secondary" className={classes.icon}/>
                  <Typography component="h1" variant="h4">
                    {t('common:forgotPassword')}
                  </Typography>
                </div>
                {isFinished ? (
                  <p>{t('common:checkMail')}</p>
                ) : (
                  <form onSubmit={handleSubmit}>
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
                      margin="normal"
                      fullWidth
                      label={t('common:email')}
                      placeholder="email@example.com"
                      autoComplete="email"
                      autoFocus
                      error={!!errorText}
                      helperText={t(errorText)}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      className={classes.submit}
                      size="large"
                      fullWidth
                    >{t('common:requestPasswordRecoveryMail')}</Button>
                    <Button color="primary" to="/login" component={Link}>
                      {t('common:login')}
                    </Button>
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
