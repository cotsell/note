import { createAction, handleActions } from 'redux-actions';

const ADD_ITEM = '[SUBJPAGE]addItem';
const REMOVE_ITEM = '[SUBJPAGE]removeItem';
const REMOVE_ALL_ITEM = '[SUBJPAGE]deleteAllItem';
const ADD_SUBJ_STATE = '[SUBJPAGE]addSubjectState';
const MODIFY_SUBJ_MENU = '[SUBJPAGE]modifySubjMenu';
const RESET = '[SUBJPAGE]reset';
const TOGGLE_SUBJ_MODAL = '[SUBJPAGE]toggleSubjectModal';
const TOGGLE_ITEM_MODAL = '[SUBJPAGE]toggleItemModal';
const CLOSE_ALL_SUBJ_MENU = '[SUBJPAGE]closeAllMenu';
const TOGGLE_ITEM_CHOICE_MODE = '[SUBJPAGE]modifyItemDelMode';
const SET_FILTER = '[SUBJPAGE]setFilter';

export const addItem = createAction(ADD_ITEM);
export const removeItem = createAction(REMOVE_ITEM);
export const removeAllItem = createAction(REMOVE_ALL_ITEM);
export const addSubjState = createAction(ADD_SUBJ_STATE);
export const modifySubjMenu = createAction(MODIFY_SUBJ_MENU);
export const reset = createAction(RESET);
export const toggleSubjModal = createAction(TOGGLE_SUBJ_MODAL);
export const toggleItemModal = createAction(TOGGLE_ITEM_MODAL);
export const closeAllSubjMenu = createAction(CLOSE_ALL_SUBJ_MENU);
export const toggleItemChoiceMode = createAction(TOGGLE_ITEM_CHOICE_MODE);
export const setFilter = createAction(SET_FILTER);

const init = {
  subjectModal: {
    show: false,
    mode: false,
    subjHisId: '',
    projHisId: '',
    title: '',
    private: true,
  },
  itemModal: { show: false },
  itemList: [],
  eachArticleState: [], // eachArticleState: { id: '', menu: {show: boolean, mode: 'subject' or 'item'}, itemChoiceMode: false }
  filter: { show: true, value: '' },
}

export const reducer = handleActions(
  {
    [ADD_SUBJ_STATE]: (state, action) => {
      const article = { 
        id: action.payload, 
        menu: {
          show: false,
          mode: 'subject'
        },
        itemChoiceMode: false
      };
      return Object.assign(
        {}, state,
        { eachArticleState: [...state.eachArticleState, article] });
    },

    // { id, show, mode }를 모두 넣어줘야 id로 객체를 비교하고, 수정해요..
    [MODIFY_SUBJ_MENU]: (state, action) => {
      const array = state.eachArticleState.map(value => {
        if (value.id === action.payload.id) {
          return Object.assign({}, value, { menu: { 
            show: action.payload.show,
            mode: action.payload.mode
           } });
        }
        return value;
      });

      return Object.assign({}, state, { eachArticleState: array });
    },

    [ADD_ITEM]: (state, action) => {
      return Object.assign(
        {}, state, { itemList: [...state.itemList, action.payload] });
    },

    [REMOVE_ITEM]: (state, action) => {
      const itemList = state.itemList.filter(value => {
        return value === action.payload ? false : true;
      });

      return Object.assign({}, state, { itemList: itemList });
    },

    [REMOVE_ALL_ITEM]: (state, action) => {
      return Object.assign({}, state, { itemList: [] });
    },

    [RESET]: (state, action) => {
      return init;
    },

    [TOGGLE_SUBJ_MODAL]: (state, action) => {
      return Object.assign(
        {},
        state,
        {
          subjectModal: {
            ...state.subjectModal,
            ...action.payload
          }
        });
    },

    [TOGGLE_ITEM_MODAL]: (state, action) => {
      return Object.assign(
        {},
        state,
        { 
          itemModal: {
            ...state.itemModal,
            ...action.payload 
          }
        });
    },

    [CLOSE_ALL_SUBJ_MENU]: (state, action) => {
      const menuList = state.eachArticleState.map(value => {
        value.menu.show = false;
        return value;
      });

      return Object.assign(
        {},
        state,
        { eachArticleState: menuList }
      );
    },

    // Item Choice Mode 변경. payload에는 subjHisId와 itemChoiceMode만 넣어주세요.
    [TOGGLE_ITEM_CHOICE_MODE]: (state, action) => {
      const subjList = state.eachArticleState.map(value => {
        if (value.id === action.payload.id) {
          return Object.assign({}, value, { itemChoiceMode: action.payload.itemChoiceMode });
        }

        return value;
      });
      return Object.assign({}, state, { eachArticleState: subjList });
    },

    [SET_FILTER]: (state, action) => {
      return Object.assign({}, state, { filter: { ...state.filter, ...action.payload } });
    },
  },
  init
);
