import React from 'react';

const initialization = {};
export default function childreducer(state = initialization, action) {
  switch (action.type) {
    case 'All':
      return {
        cdata: 'All vehicle'
      };
    default:
      return state;
  }
}
