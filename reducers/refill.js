import {REFILL} from '../actions';

const refill = (state = {nbrOfRefills: 0}, action) => {
  switch (action.type) {
    case REFILL:
      return {
        nbrOfRefills: state.nbrOfRefills + 1,
        timeLastRefill: new Date().getTime()
      };
    default:
      return state;
  }
};

export default refill;
