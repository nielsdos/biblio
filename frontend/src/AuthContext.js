import React from 'react';

export const DEFAULT_STATE = Object.freeze({
  initialized: false, // True if this context can actually be used now and the CSRF etc has been setup
});

export const AuthContext = React.createContext(DEFAULT_STATE);
