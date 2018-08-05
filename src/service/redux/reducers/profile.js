import { createAction, handleActions } from 'redux-actions';

const SET_PASS_MODAL = '[PROFILE]setPassModal';

export const setPassModal = createAction(SET_PASS_MODAL);

const init = {
  passModal: { show: false },
};

export const reducer = handleActions({
  [SET_PASS_MODAL]: (state, action) => {
    return Object.assign({}, state, { passModal: {...state.passModal, ...action.payload } });
  },  
}, init);