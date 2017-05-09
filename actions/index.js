import {v4 as generateId} from 'node-uuid';

import {queryWeather, queryByLatLon} from '../api';

export const ADD_LOCATION = 'ADD_LOCATION';
export const REMOVE_LOCATION = 'REMOVE_LOCATION';
export const SELECT_LOCATION = 'SELECT_LOCATION';

export const REQUEST_WEATHER = 'REQUEST_WEATHER';
export const RECEIVE_WEATHER = 'RECEIVE_WEATHER';
export const RECEIVE_CURRENT_POSITION = 'RECEIVE_CURRENT_POSITION';
export const RECEIVE_PEDOMETER_UPDATE = 'RECEIVE_PEDOMETER_UPDATE';
export const RECEIVE_BY_LATLON = 'RECEIVE_BY_LATLON';
export const STOPPED_PEDOMETER_UPDATES = 'RECEIVE_PEDOMETER_UPDATE';
export const FAILED_PEDOMETER_UPDATE = 'FAILED_PEDOMETER_UPDATE';
export const FAILED_STOPPED_PEDOMETER_UPDATES = 'FAILED_STOPPED_PEDOMETER_UPDATES';
export const ERROR_RECEIVE_CURRENT_POSITION = 'ERROR_RECEIVE_CURRENT_POSITION';
export const ERROR_RECEIVE_BY_LAT_LON_POSITION = 'ERROR_RECEIVE_BY_LAT_LON_POSITION';
export const SET_FETCH_ERROR = 'SET_FETCH_ERROR';
export const REFILL = 'REFILL';
export const RESET_PEDOMETER = 'RESET_PEDOMETER';

export const OPEN_DIALOG = 'OPEN_DIALOG';
export const CLOSE_DIALOG = 'CLOSE_DIALOG';

export const addLocation = (name) => ({
  type: ADD_LOCATION,
  id: generateId(),
  name
});

export const removeLocation = id => ({
  type: REMOVE_LOCATION,
  id
});

export const selectLocation = id => ({
  type: SELECT_LOCATION,
  id
});

export const requestWeather = (id) => ({
  type: REQUEST_WEATHER,
  id
});

export const receiveWeather = (id, data) => ({
  type: RECEIVE_WEATHER,
  id,
  ...data
});

export const setFetchError = id => ({
  type: SET_FETCH_ERROR,
  id
});

export const receiveCurrentPosition = data => ({
  type: RECEIVE_CURRENT_POSITION,
  ...data
});

export const receivedPedometerUpdate = data => ({
  type: RECEIVE_PEDOMETER_UPDATE,
  ...data
});

export const failedPedometerUpdate = data => ({
  type: FAILED_PEDOMETER_UPDATE,
  ...data
});
export const stoppedPedometerUpdates = data => ({
  type: STOPPED_PEDOMETER_UPDATES
});

export const failedToStopPedometerUpdates = data => ({
  type: FAILED_STOPPED_PEDOMETER_UPDATES
});

export const errorReceiveCurrentPosition = () => ({
  type: ERROR_RECEIVE_CURRENT_POSITION
});

export const setFetchByLatLonError = () => ({
  type: ERROR_RECEIVE_BY_LAT_LON_POSITION
});

export const receiveByLatLon = data => ({
  type: RECEIVE_BY_LATLON,
  ...data
});
export const fetchWeather = (id) => {
  /*
   * This function requests and receives the
   * weather data asynchronously.
   */
  return (dispatch, getState) => {
    const name = getState().locations[id].name;

    dispatch(requestWeather(id));
    queryWeather(name)
      .catch(() => dispatch(setFetchError(id)))
      .then((data) => dispatch(receiveWeather(id, data)));
  };
};

export const addLocationAndFetchWeather = name => {
  return (dispatch, getState) => {
    const id = dispatch(addLocation(name)).id;
    dispatch(fetchWeather(id));
  };
};

export const openDialog = () => ({
  type: OPEN_DIALOG
});

export const closeDialog = () => ({
  type: CLOSE_DIALOG
});

export const refill = () => ({
  type: REFILL
});

export const getGeoLocation = () => {
  const options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };
  return (dispatch, getState) => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('position', position);
      dispatch(receiveCurrentPosition(position));
      queryByLatLon(position.coords.latitude, position.coords.longitude)
        .then((data) => {
          console.log('receiveByLatLon', data);
          dispatch(receiveByLatLon(data));
        });
    }, () => {
      const position = {
        coords: {
          latitude: '55.6130201',
          longitude: '13.0027426'
        }
      };
      console.log('getState()', getState());
      dispatch(receiveCurrentPosition(position));
      queryByLatLon(position.coords.latitude, position.coords.longitude)
        .then((data) => {
          console.log('receiveByLatLon', data);
          dispatch(receiveByLatLon(data));
        });
    }, options);
  };
};

export const startPedometerUpdates = () => {
  return (dispatch, getState) => {
    console.log('startPedometerUpdates');
    if (!window.pedometer) {
      return;
    }
    window.pedometer.startPedometerUpdates((pedometerData) => {
      console.log('pedometerData', pedometerData);
      dispatch(receivedPedometerUpdate(pedometerData));
    }, () => {
      console.log('failedPedometerUpdate');
      dispatch(failedPedometerUpdate());
    });
  };
};

export const stopPedometerUpdates = () => {
  return (dispatch, getState) => {
    window.pedometer.stopPedometerUpdates(() => {
      dispatch(stoppedPedometerUpdates());
    }, () => {
      dispatch(failedToStopPedometerUpdates());
    });
  };
};

export const resetPedometerUpdates = () => ({
  type: RESET_PEDOMETER
});

export const fetchByLatLon = (lat, lon) => {
  return (dispatch, getState) => {
    queryByLatLon(lat, lon)
      .catch(() => dispatch(setFetchByLatLonError()))
      .then((data) => dispatch(receiveByLatLon(data)));
  };
};
