import {RECEIVE_CURRENT_POSITION, ERROR_RECEIVE_CURRENT_POSITION} from '../actions';

const geolocation = (state = {coords: false}, action) => {
  switch (action.type) {
    case RECEIVE_CURRENT_POSITION:
      return {
        ...action,
        ...state
      };
    case ERROR_RECEIVE_CURRENT_POSITION:
      return {
        error: true,
        ...state
      };
    default:
      return state;
  }
};

export default geolocation;
