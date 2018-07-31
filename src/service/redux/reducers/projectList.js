import { createAction } from 'redux-actions';

const INSERT_ALL = '[PROJECTLIST]insertAll';
const INSERT = '[PROJECTLIST]insert';
const MODIFY = '[PROJECTLIST]modify';
const DELETE_ALL = '[PROJECTLIST]deleteAll';
const SET_STATE = '[PROJECTLIST]setState';

export const insertAll = createAction(INSERT_ALL);
export const insert = createAction(INSERT);
export const modify = createAction(MODIFY);
export const deleteAll = createAction(DELETE_ALL);
export const setState = createAction(SET_STATE);

const init = { list: [], reduxState: 'none' };

export const reducer = (state = init, action) => {
  switch (action.type) {
    case INSERT_ALL: 
      return Object.assign({}, state, 
                            { list: action.payload },
                            { reduxState: 'done' });

    case MODIFY:
      // TODO
      break;

    case INSERT:
      return Object.assign( {}, state, 
                            { list: [ ...state.list , action.payload ] }, 
                            { reduxState: 'done'});

    case DELETE_ALL:
      return init;

    case SET_STATE:
      return Object.assign( {}, state, 
                            { reduxState: action.payload });

    default:
      return state;
  }
};