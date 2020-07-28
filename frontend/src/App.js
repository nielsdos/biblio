import React, {useState, useEffect} from 'react';
import LoginPage from "./pages/LoginPage";
import ForgotPasswordRequestPage from "./pages/ForgotPasswordRequestPage";
import ForgotPasswordActionPage from "./pages/ForgotPasswordActionPage";
import InvitePage from "./pages/InvitePage";
import HomePage from "./pages/HomePage";
import BorrowerPage from "./pages/BorrowerPage";
import UserPage from './pages/UserPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import NotFoundPage from "./pages/NotFoundPage";
import CssBaseline from "@material-ui/core/CssBaseline";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import { ThemeProvider } from '@material-ui/core/styles';
import responsiveFontSizes from "@material-ui/core/styles/responsiveFontSizes";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import {Route, Switch} from "react-router-dom";
import Navbar from "./components/Navbar";
import {AuthContext, DEFAULT_STATE} from "./AuthContext";
import Api from "./Api";
import CircularProgress from "@material-ui/core/CircularProgress";
import {LoginRedirectedRoute, HomeRedirectedRoute} from "./helpers/routeHelpers";
import moment from "moment";
import nl from 'moment/locale/nl';
import './App.css';

moment.locale('nl', nl);

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: blue[600],
    },
    secondary: red,
  },
  shape: {
    borderRadius: 10,
  },
  props: {
    MuiTextField: {
      variant: 'outlined',
    },
    MuiRadio: {
      color: 'primary',
    },
    MuiCheckbox: {
      color: 'primary',
    },
  },
  typography: {
    button: {
      textTransform: 'none'
    }
  },
}));

function App() {
  const [authState, setAuthState] = useState(DEFAULT_STATE);
  const LoggedOutState = Object.freeze({
    initialized: true,
    loggedIn: false,
    actions: {
      _processAuthDataWrapper(promise) {
        return promise
          .then(user => {
            // State when authenticated
            setAuthState({
              initialized: true,
              loggedIn: true,
              user: user.data,
              actions: {
                logOut() {
                  return Api.post('auth/logout')
                    .then(_ => {
                      setAuthState(LoggedOutState);
                    })
                    .catch(e => {
                      console.error('Logout failed', e);
                    });
                }
              }
            })
          })
          .catch(e => {
            // console.log(_e.response.status);
            setAuthState(LoggedOutState);
            throw e; // allow chaining, do not remove or error handling in login etc will break
          });
      },

      tryLoadUser() {
        return this._processAuthDataWrapper(Api.get('user')).catch(_e => { /* ignore */ });
      },

      login(data) {
        return this._processAuthDataWrapper(Api.post('auth/login', data));
      },
    },
  });

  // CSRF & auth state
  useEffect(() => {
    // Request initial CSRF cookie.
    // While this request is busy, we need to wait.
    Api.get('t/csrf-cookie')
      .then(_ => {
        LoggedOutState.actions.tryLoadUser();
      })
      .catch(_e => alert('Connection issue'))
    // Silence false-positive
    // eslint-disable-next-line
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <AuthContext.Provider value={authState}>
        {authState.initialized ? (
          <>
            <Navbar />
            <Switch>
              <Route exact path="/" component={HomePage} />
              <HomeRedirectedRoute exact guard={!authState.loggedIn} path="/login" component={LoginPage} />
              <HomeRedirectedRoute exact guard={!authState.loggedIn} path="/forgot" component={ForgotPasswordRequestPage} />
              <Route exact path="/reset" component={ForgotPasswordActionPage} />
              <HomeRedirectedRoute exact guard={!authState.loggedIn} path="/invite" component={InvitePage} />
              <LoginRedirectedRoute exact guard={authState.loggedIn} path="/users" component={UserPage} />
              <LoginRedirectedRoute exact guard={authState.loggedIn} path="/borrowers" component={BorrowerPage} />
              <LoginRedirectedRoute exact guard={authState.loggedIn} path="/add-book" component={AddBookPage} />
              <LoginRedirectedRoute exact guard={authState.loggedIn} path="/books/:id/edit" component={EditBookPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </>
        ) : (
          <div className="centered">
            <CircularProgress size="8rem" thickness={1.8} />
          </div>
        )}
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
