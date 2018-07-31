import { createAction } from 'redux-actions';

const INSERT_ALL = '[SUBJECTLIST]insertAll';
const INSERT = '[SUBJECTLIST]insert';
const MODIFY = '[SUBJECTLIST]modify';
const MODIFY_STATE = '[SUBJECTLIST]modifyState';
const DELETE_ONE = '[SUBJECTLIST]deleteOne'
const DELETE_ALL = '[SUBJECTLIST]deleteAll';

export const insertAll = createAction(INSERT_ALL);
export const insert = createAction(INSERT);
export const modify = createAction(MODIFY);
export const modifyState = createAction(MODIFY_STATE);
export const deleteOne = createAction(DELETE_ONE);
export const deleteAll = createAction(DELETE_ALL);

const init = { list: [], reduxState: 'none' };

export const reducer = (state = init, action) => {
  switch (action.type) {
    case INSERT_ALL:
      return Object.assign( {}, state, 
                            { list: action.payload },
                            { reduxState: 'done' } );

    case INSERT:
      return Object.assign({}, state, 
                            { list: [...state.list, action.payload] },
                            { reduxState: 'done' });

    case MODIFY:
      const list = state.list.map(value => {
        if (value.historyId === action.payload.historyId) {
          return action.payload;
        }
        return value;
      });

      return Object.assign({}, state, { list: list });

    case MODIFY_STATE:
      return Object.assign({}, state, { reduxState: action.payload });

    case DELETE_ONE:
      const array = state.list.filter(value => {
        return value.historyId === action.payload ? false : true;
      })
      return Object.assign({}, state, { list: array });

    case DELETE_ALL:
      return init;
    
    default:
      return state;
  }

};
