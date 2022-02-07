import React from 'react';
import { combineReducers } from 'redux';
import reducer from './reducer/reducer';
import childreducer from './reducer/childreducer';

const combineReducer = combineReducers({
  reducer,
  childreducer
});

const rootReducer = (state, action) => {
  // console.log('test');
  if (action.type === 'RESET_APP_STORE') {
    state = undefined;
  }
  return combineReducer(state, action);
};
export default rootReducer;
