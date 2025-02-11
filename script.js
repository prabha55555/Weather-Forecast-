const API_KEY = '814b9aee5027d24acb47833744ae2cb0'; 
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const currentWeatherElement = document.getElementById('current-weather');
const forecastElement = document.getElementById('forecast');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        fetchWeather(city);
    }
});

async function fetchWeather(city) {
    showLoading();
    try {
        const [weatherData, forecastData] = await Promise.all([
            fetch(`${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`).then(res => res.json()),
            fetch(`${API_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`).then(res => res.json())
        ]);

        if (weatherData.cod === '404' || forecastData.cod === '404') {
            throw new Error('City not found');
        }

        displayCurrentWeather(weatherData);
        displayForecast(forecastData);
        hideLoading();
    } catch (error) {
        showError(error.message);
    }
}

function showLoading() {
    loadingElement.classList.remove('hidden');
    errorElement.classList.add('hidden');
    currentWeatherElement.classList.add('hidden');
    forecastElement.classList.add('hidden');
}

function hideLoading() {
    loadingElement.classList.add('hidden');
    currentWeatherElement.classList.remove('hidden');
    forecastElement.classList.remove('hidden');
}

function showError(message) {
    errorElement.textContent = message;
    errorElement.classList.remove('hidden');
    loadingElement.classList.add('hidden');
    currentWeatherElement.classList.add('hidden');
    forecastElement.classList.add('hidden');
}

function displayCurrentWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('current-temp').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('current-description').textContent = data.weather[0].description;
    document.getElementById('current-humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('current-wind').textContent = `${data.wind.speed} m/s`;

    const iconElement = document.getElementById('current-weather-icon');
    iconElement.setAttribute('data-lucide', getWeatherIcon(data.weather[0].main));
    lucide.createIcons();
}

function displayForecast(data) {
    const forecastContainer = document.querySelector('.forecast-container');
    forecastContainer.innerHTML = '';

    const dailyForecasts = data.list.filter((item, index) => index % 8 === 0);

    dailyForecasts.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const icon = getWeatherIcon(day.weather[0].main);
        const maxTemp = Math.round(day.main.temp_max);
        const minTemp = Math.round(day.main.temp_min);

        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <p>${dayName}</p>
            <i data-lucide="${icon}"></i>
            <p>${maxTemp}°C / ${minTemp}°C</p>
        `;

        forecastContainer.appendChild(forecastItem);
    });

    lucide.createIcons();
}

function getWeatherIcon(condition) {
    switch (condition.toLowerCase()) {
        case 'clear':
            return 'sun';
        case 'clouds':
            return 'cloud';
        case 'rain':
            return 'cloud-rain';
        case 'snow':
            return 'cloud-snow';
        case 'thunderstorm':
            return 'cloud-lightning';
        default:
            return 'cloud';
    }
}


lucide.createIcons();

