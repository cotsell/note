import { createAction } from 'redux-actions';

const INSERT_ALL = '[ITEMLIST]insertAll';
const ADD = '[ITEMLIST]add';
const ADD_LIST = '[ITEMLIST]addList';
const DELETE_ITEMS = '[ITEMLIST]deleteItems';
const DELETE_ALL = '[ITEMLIST]deleteAll';
const DELETE_ALL_WITH_SUBJ_ID = '[ITEMLIST]deleteAllWithSubjId';
const CHANGE_STATE = '[ITEMLIST]changeState';

export const insertAll = createAction(INSERT_ALL);
export const add = createAction(ADD);
export const addList = createAction(ADD_LIST);
export const deleteItems = createAction(DELETE_ITEMS);
export const deleteAll = createAction(DELETE_ALL);
export const deleteAllWithSubjId = createAction(DELETE_ALL_WITH_SUBJ_ID);
export const changeState = createAction(CHANGE_STATE);

const init = { list: [], reduxState: 'none' };

export const reducer = (state = init, action) => {
  switch (action.type) {
    case INSERT_ALL:
      return { list: action.payload, reduxState: 'done' };

    case ADD:
      return Object.assign( 
        {}, 
        state, 
        { list: [...state.list, action.payload] },
        { reduxState: 'done' });

    case ADD_LIST:
      return Object.assign( 
        {}, 
        state,
        { list: [...state.list, ...action.payload] },
        { reduxState: 'done' });

    // 입력된 아이템들을 itemList에서 제거해요. payload에는 id를 넣은 array를 주세요.
    // 이거로 하나도 제거 가능한데.. 통합해야 하나..
    case DELETE_ITEMS:
      const ids = action.payload;
      const itemList = state.list.filter(value => {
        for (let i = 0; i < ids.length; i++) {
          if (value.historyId === ids[i]) { 
            return false; 
          }
        }
        return true;
      });
      return Object.assign({}, state, { list: itemList });

    case DELETE_ALL:
      return init;

    case DELETE_ALL_WITH_SUBJ_ID:
      const array = state.list.filter(value => {
        return value.subjectId === action.payload ? false : true;
      });
      return Object.assign({}, state, { list: array });

    case CHANGE_STATE:
      return Object.assign({}, state, { reduxState: action.payload });

    default:
      return state;
  }
}



    // 입력된 아이템들을 itemList에서 제거해요. payload에는 id를 넣은 array를 주세요.
    // 이거로 하나도 제거 가능한데.. 통합해야 하나..
    // [REMOVE_ITEMS]: (state, action) => {
    //   const ids = action.payload;
    //   const itemList = state.itemList.filter(value => {
    //     // let swt = false;
    //     for (let i = 0; i < ids; i++) {
    //       if (value === ids[i]) { return false; } // { swt = true; }
    //     }
    //     // return swt ? false : true;
    //     return true;
    //   });

    //   return Object.assign({}, state, { itemList: itemList });
    // },