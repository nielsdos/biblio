import React, {useState} from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import InputAdornment from '@material-ui/core/InputAdornment';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import Card from "@material-ui/core/Card";
import {Field, Formik} from "formik";
import {Checkbox} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import {Link} from "react-router-dom";
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import { useTranslation } from 'react-i18next';
import {AuthContext} from '../AuthContext';
import TopProgressBar from "../components/TopProgressBar";
import AuthStyles from './AuthStyles';

const useStyles = AuthStyles;

export default (props) => {
  const classes = useStyles();
  const {t} = useTranslation();
  const [errorText, setErrorText] = useState('');

  return (
    <Container maxWidth="sm">
      <Card className={classes.paper}>
        <AuthContext.Consumer>
          {auth => (
            <Formik
              initialValues={{email: '', password: '', remember: false}}
              onSubmit={(data, {setSubmitting}) => {
                setSubmitting(true);
                setErrorText('');

                const sentData = {
                  email: data.email,
                  password: data.password,
                };
                if (data.remember) {
                  sentData.remember = true;
                }

                auth.actions.login(sentData)
                  .then(_ => {
                    setSubmitting(false);
                  })
                  .catch(e => {
                    if (e.response) {
                      const {status} = e.response;
                      if (status === 422) {
                        setErrorText('error:invalidCreds');
                      } else if (status === 429) {
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
                        {t('common:login')}
                      </Typography>
                    </div>
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
                        error={!!errorText}
                      />
                      <FormControlLabel
                        control={
                          <Field
                            name="remember"
                            as={Checkbox}
                            margin="normal"
                          />
                        }
                        label={t('common:rememberMe')}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.submit}
                        size="large"
                        fullWidth
                      >{t('common:login')}</Button>
                      <Button color="primary" to="/forgot" component={Link}>
                        {t('common:forgotPassword')}
                      </Button>
                    </form>
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
