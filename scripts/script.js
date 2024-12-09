import { APIKEY } from './envorimint.js';

navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
    console.log(position);
    console.log("Our latitude is: " + position.coords.latitude);
    console.log("Our longitude is: " + position.coords.longitude);
    console.log("Now we know where you are!");

    // Call the API with the obtained coordinates
    apiCall(position.coords.latitude, position.coords.longitude);
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function apiCall(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data);
        })
}