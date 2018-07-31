import { createAction } from 'redux-actions';

const SET = '[TOOLBAR]set';

export const set = createAction(SET);

const init = { 
  title: '',
  mode: '',
  parentUrl: '',
  showBackButton: false,
};

export const reducer = (state = init, action) => {
  switch (action.type) {
    case SET: 
      return Object.assign({}, state, 
                            { 
                              title: action.payload.title,
                              mode: action.payload.mode,
                              parentUrl: action.payload.parentUrl,
                              showBackButton: action.payload.showBackButton,
                            });

    default:
      return state;
  }
};

