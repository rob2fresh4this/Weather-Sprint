import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from './localstorage.js';
import { APIKEY } from './envorimint.js';

navigator.geolocation.getCurrentPosition(success, error);// Get the user's location

function success(position) {
    console.log(position);
    console.log("Our latitude is: " + position.coords.latitude);
    console.log("Our longitude is: " + position.coords.longitude);
    console.log("Now we know where you are!");

    // Call the API with the obtained coordinates
    apiCall(position.coords.latitude, position.coords.longitude);
}

// simple error handling
function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}

function apiCall(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${APIKEY}&units=imperial`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            displayWeather(data);
            fetchForecast(data.name);
        });
}

function fetchForecast(cityName) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKEY}&units=imperial`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            displayForecast(data);
        });
}

function displayWeather(data) {
    const mainWeather = document.querySelector('.main-weather');
    mainWeather.innerHTML = `
        <div>
            <span><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}"></span>
            <h2>${data.weather[0].main}</h2>
        </div>
        <div class="temperature">${data.main.temp.toFixed(0)}&#176;F</div>
        <div>${data.main.temp_max.toFixed(0)}&#176;/${data.main.temp_min.toFixed(0)}&#176;</div>
        <div>${new Date().toLocaleDateString('en-US', { weekday: 'long' })}</div>
        <div>Wind: ${data.wind.speed} m/s</div>
        <div>Humidity: ${data.main.humidity}%</div>
        <div>&#9825; ${data.name}, ${data.sys.country}</div>
    `;
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast');
    forecastContainer.innerHTML = '';
    const forecastList = data.list.filter((item) => item.dt_txt.includes('12:00:00'));// Get the forecast for 12:00 PM
    forecastList.forEach((forecast) => {
        const day = new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short' });// Get the day of the week 
        const icon = forecast.weather[0].icon;// Get the weather icon
        const temp = forecast.main.temp.toFixed(0);// Get the temperature
        const tempMax = forecast.main.temp_max.toFixed(0);// Get the max temperature
        const tempMin = forecast.main.temp_min.toFixed(0);// Get the min temperature

        const forecastElement = document.createElement('div');
        forecastElement.className = 'day';
        forecastElement.innerHTML = `
            <div>${day}</div>
            <div><img src="https://openweathermap.org/img/wn/${icon}.png" alt="${forecast.weather[0].description}"></div>
            <div>${temp}&#176;F</div>
            <div>${tempMax}&#176;/${tempMin}&#176;</div>
        `;
        forecastContainer.appendChild(forecastElement);
    });
}

const inputField = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-button');
const storedValue = document.querySelector('.favorites');

searchButton.addEventListener('click', () => {
    const cityName = inputField.value.trim();
    if (cityName) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKEY}&units=imperial`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                saveToLocalStorage(data.name);
                displayFavorites();
                displayWeather(data);
                fetchForecast(data.name);
            })
    }
    else{
        alert("Please enter a city name");
    }
});

function displayFavorites() {
    const favorites = getFromLocalStorage();
    const favoritesContainer = storedValue;
    favoritesContainer.innerHTML = '<h2>Favorites</h2>';

    favorites.forEach((city) => {
        const cityElement = document.createElement('div');
        cityElement.className = 'city';
        cityElement.innerHTML = `
            <span>${city}</span>
            <button class="remove">Remove</button>
        `;
        cityElement.querySelector('.remove').addEventListener('click', () => {
            removeFromLocalStorage(city);
            displayFavorites();
        });

        favoritesContainer.appendChild(cityElement);
    });
}

displayFavorites();
