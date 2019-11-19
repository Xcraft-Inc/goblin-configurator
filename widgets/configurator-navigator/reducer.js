import Shredder from 'xcraft-core-shredder';

const initialState = new Shredder({flow: 'closed', target: null});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'OPEN': {
      return state.set('flow', 'opened').state.set('target', null);
    }
    case 'CLOSE': {
      return state.set('flow', 'closed').state.set('target', null);
    }
    case 'SCOPE': {
      return state.set('flow', 'scoped').state.set('target', action.target);
    }
  }
  return state;
};
