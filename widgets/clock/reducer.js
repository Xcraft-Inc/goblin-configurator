import Shredder from 'xcraft-core-shredder';

const initialState = new Shredder({time: new Date()});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'TICK': {
      return state.set('time', new Date());
    }
  }
  return state;
};
