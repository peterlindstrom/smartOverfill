import {combineReducers} from 'redux';
import selectedLocation from './selectedLocation';
import locations from './locations';
import dialog from './dialog';
import geolocation from './geolocation';
import pedometerReducer from './pedometerReducer';
import refill from './refill';
import place from './place';

const todoApp = combineReducers({
  locations,
  selectedLocation,
  dialog,
  geolocation,
  pedometerReducer,
  refill,
  place
});

export default todoApp;
