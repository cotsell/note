import { combineReducers } from 'redux';

import { reducer as account } from './account';
import { reducer as projectList } from './projectList';
import { reducer as subjectList } from './subjectList';
import { reducer as itemList } from './itemList';
import { reducer as toolbar } from './toolbar';
import { reducer as subjectPage } from './subjectPage';
import { reducer as itemDetail } from './itemDetail';
// import { reducer as data } from './data';

export default combineReducers(
  { account, projectList, subjectList, itemList, toolbar, subjectPage, itemDetail }
);