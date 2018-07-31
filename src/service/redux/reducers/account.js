import { createAction, handleActions } from 'redux-actions';

const SET = '[ACCOUNT]set';
const RESET = '[ACCOUNT]reset';
const LOGOUT = '[ACCOUNT]logout';

export const set = createAction(SET);
export const reset = createAction(RESET);
export const logout = createAction(LOGOUT);

const init = {
  loggedIn: false,
  accessToken: undefined,
  reduxState: 'none'
};

export const reducer = handleActions(
  {
    [SET]: (state, action) => {
      return Object.assign({}, state, action.payload);
    },
    [RESET]: (state, action) => {
      return init;
    },
    [LOGOUT]: (state, action) => {
      return { loggedIn: false, accessToken: undefined, reduxState: 'done' }; 
    }
  },
  init
);
