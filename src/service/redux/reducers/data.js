import { createAction } from 'redux-actions';

const PROJ_INSERT_ALL = '[PROJECTLIST]insertAll';
const PROJ_INSERT = '[PROJECTLIST]insert';
const PROJ_MODIFY = '[PROJECTLIST]modify';
const PROJ_DELETE_ALL = '[PROJECTLIST]deleteAll';

export const projInsertAll = createAction(PROJ_INSERT_ALL);
export const projInsert = createAction(PROJ_INSERT);
export const projModify = createAction(PROJ_MODIFY);
export const projDeleteAll = createAction(PROJ_DELETE_ALL);

const init = { list: [], reduxState: 'none' };

export const reducer = (state = init, action) => {
  switch (action.type) {
    

    default:
      return state;
  }
};