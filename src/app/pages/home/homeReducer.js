import { COUNT_CHANGE } from './homeAction';

const INITIAL_STATE = {
  count: 0,
};

const home = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COUNT_CHANGE: {
      return { ...state, count: action.payload.count };
    }
    default:
      return state;
  }
};

export default home;
