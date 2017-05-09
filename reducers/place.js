import {RECEIVE_BY_LATLON, ERROR_RECEIVE_BY_LAT_LON_POSITION} from '../actions';

const place = (state = {name: 'Alicante'}, action) => {
  switch (action.type) {
    case RECEIVE_BY_LATLON:
      return {
        ...action,
        ...state
      };
    case ERROR_RECEIVE_BY_LAT_LON_POSITION:
      return {
        error: true,
        ...state
      };
    default:
      return state;
  }
};

export default place;
