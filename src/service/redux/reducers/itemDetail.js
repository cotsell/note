import { createAction, handleActions } from 'redux-actions';

const INSERT = '[ITEMDETAIL]insert';
const DELETE_ALL = '[ITEMDETAIL]deleteAll';
const INSERT_CHECK_LIST = '[ITEMDETAIL]insertCheckList';
const MODIFY_CHECK_ONE = '{ITEMDETAIL}modifyCheckOne';
const INSERT_CHECK_ONE = '[ITEMDETAIL]insertCheckOne';
const DELETE_CHECK_ONE = '[ITEMDETAIL]deleteCheckOne';
const CHANGE_STATE = '[ITEMDETAIL]changeState';

export const insert = createAction(INSERT);
export const deleteAll = createAction(DELETE_ALL);
export const insertCheckList = createAction(INSERT_CHECK_LIST);
export const insertCheckOne = createAction(INSERT_CHECK_ONE);
export const modifyCheckOne = createAction(MODIFY_CHECK_ONE);
export const deleteCheckOne = createAction(DELETE_CHECK_ONE);
export const changeState = createAction(CHANGE_STATE);

const init = { itemDetail: undefined, reduxState: 'none'};

export const reducer = handleActions({
  [INSERT]: (state, action) => {
    return { itemDetail: action.payload, reduxState: 'changed' };
  },

  [DELETE_ALL]: (state, action) => {
    return init;
  },

  [INSERT_CHECK_LIST]: (state, action) => {
    return Object.assign(
      {}, 
      state, 
      { reduxState: 'changed' },
      { itemDetail: { ...state.itemDetail, checkBoxList: action.payload } });
  },

  [INSERT_CHECK_ONE]: (state, action) => {
    return Object.assign(
      {}, 
      state,
      { reduxState: 'changed' }, 
      { itemDetail: { ...state.itemDetail, checkBoxList: [...state.checkBoxList, action.payload] } }
    );
  },

  // checkBox의 상태를 바꿔요. _id는 payload에 필수로 넣어줘야 해요.
  // title을 바꿀 때 써도 되고, checked를 바꿀 때 써도 됨.
  [MODIFY_CHECK_ONE]: (state, action) => {
    const newList = state.itemDetail.checkBoxList.map(value => {
      return value._id === action.payload._id ? 
        Object.assign({}, value, {...action.payload}) : value;
    });
    return Object.assign(
      {}, 
      state, 
      { reduxState: 'changed' },
      { itemDetail: { ...state.itemDetail, checkBoxList: newList } })
  },

  [DELETE_CHECK_ONE]: (state, action) => {
    const array = state.itemDetail.checkBoxList.filter(value => {
      return value.id === action.id ? false : true;
    });

    return Object.assign(
      {}, 
      state, 
      { reduxState: 'changed' },
      { itemDetail: { ...state.itemDetail, checkBoxList: array } });
  },

  [CHANGE_STATE]: (state, action) => {
    return Object.assign({}, state, { reduxState: action.payload });
  }
}, init);