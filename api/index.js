import fetch from 'isomorphic-fetch';
import Promise from 'promise';

const API_KEY = '9434007eb468359535d9b9a1b48eed78';
const API_URL = 'http://api.openweathermap.org/data/2.5';

const FLICKR_API_KEY = 'a94499db7611d252ddd3504c489833fd';
const FLICKR_API_SIG = '75f304a18890c030';
const FLICKR_API_URL = 'https://api.flickr.com/services/rest/';

// http://api.openweathermap.org/data/2.5/forecast/daily?id=524901&cnt=5&appid=9434007eb468359535d9b9a1b48eed78

const kelvinToCelsius = (kelvin) => kelvin - 273.15;

const round = (value, decimals = 1) => {
  const x = Math.pow(10, decimals);
  return Math.round(x * value) / x;
};

const apiCall = (url) => {
  return fetch(url)
    .then(response => {
      if (response.status >= 400) {
        return Promise.reject('Invalid response');
      }

      return response.json();
    })
    .then(json => {
      if (parseInt(json.cod) !== 200) {
        return Promise.reject('Invalid response');
      }

      return json;
    });
};

export const queryWeather = (city) => {
  let data;

  return apiCall(`${API_URL}/weather?q=${city.trim()}&appid=${API_KEY}`)
    .then(json => {
      data = {
        temperature: round(kelvinToCelsius(json.main.temp), 0),
        humidity: json.main.humidity,
        icon: json.weather[0].id,
        name: json.name,
        country: json.sys.country.toLowerCase()
      };

      return apiCall(`${API_URL}/forecast/daily?id=${json.id}&cnt=5&appid=${API_KEY}`);
    })
    .then(json => {
      return {
        ...data,
        forecast: json.list.map((d) => ({
          weekday: (new Date(d.dt * 1000)).getDay(),
          icon: d.weather[0].id,
          maxTemp: round(kelvinToCelsius(d.temp.max), 0),
          minTemp: round(kelvinToCelsius(d.temp.min), 0)
        }))
      };
    });
};

export const queryByLatLon = (lat, lon) => {
  let data;

  return apiCall(`${FLICKR_API_URL}?method=flickr.places.findByLatLon&api_key=${FLICKR_API_KEY}&lat=${lat}&lon=${lon}&format=json&nojsoncallback=1&${FLICKR_API_SIG}=80a443d2f11ec7564a6bb84d0bc49dc5`)
    .then(json => {
      console.log('json', json);
      data = {
        placeId: json.places.place[0].place_id,
        name: json.places.place[0].woe_name
      };
      return {
        ...data
      };
      /* return apiCall(`${FLICKR_API_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&place_id=${data.placeId}&per_page=1&format=json&nojsoncallback=1&auth_token=72157683010720896-c802943e1ed98456&api_sig=8927ec39b81b3b435c83be7b04b920ac`); */
    });
};
