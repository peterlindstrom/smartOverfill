import {
  RECEIVE_PEDOMETER_UPDATE,
  FAILED_PEDOMETER_UPDATE,
  STOPPED_PEDOMETER_UPDATES,
  FAILED_STOPPED_PEDOMETER_UPDATES,
  RESET_PEDOMETER
} from '../actions';

const pedometerReducer = (state = {running: false, totalNumberOfSteps: 0, numberOfSteps: 0}, action) => {
  switch (action.type) {
    case RECEIVE_PEDOMETER_UPDATE:
      return {
        ...action,
        running: true
      };
    case STOPPED_PEDOMETER_UPDATES:
      return {
        running: false,
        numberOfSteps: 0
      };
    case RESET_PEDOMETER:
      return {
        totalNumberOfSteps: state.numberOfSteps + state.totalNumberOfSteps,
        numberOfSteps: 0
      };
    case FAILED_STOPPED_PEDOMETER_UPDATES:
      return {
        running: true
      };
    case FAILED_PEDOMETER_UPDATE:
      return {
        error: true
      };
    default:
      return state;
  }
};

export default pedometerReducer;
