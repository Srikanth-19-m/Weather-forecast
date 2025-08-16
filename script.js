const API_KEY = "f95cf22279ecc38c35ad0b4ba3fbefbe";
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const currentWeather = document.getElementById("currentWeather");
const forecastCards = document.getElementById("forecastCards");
const loader = document.getElementById("loader");

async function getWeather(city) {
    loader.classList.remove("hidden");
    currentWeather.innerHTML = "";
    forecastCards.innerHTML = "";

    try {
        // Current Weather API
        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!weatherRes.ok) throw new Error("City not found");
        const weatherData = await weatherRes.json();
        displayCurrentWeather(weatherData);

        // Forecast API (exact from OpenWeather)
        const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!forecastRes.ok) throw new Error("Forecast not available");
        const forecastData = await forecastRes.json();
        displayForecast(forecastData.list);
    } catch (error) {
        currentWeather.innerHTML = `<p class="error">${error.message}</p>`;
    } finally {
        loader.classList.add("hidden");
    }
}

function displayCurrentWeather(data) {
    currentWeather.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon" class="weather-icon">
        <h3>${data.main.temp.toFixed(1)}°C</h3>
        <p>${data.weather[0].description}</p>
        <p>Humidity: ${data.main.humidity}%</p>
    `;
}

function displayForecast(list) {
    forecastCards.innerHTML = "";
    // Take every day's forecast at 12:00:00
    const dailyData = list.filter(item => item.dt_txt.includes("12:00:00"));

    dailyData.forEach(day => {
        forecastCards.innerHTML += `
            <div class="forecast-card">
                <h4>${new Date(day.dt_txt).toLocaleDateString()}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" class="weather-icon" alt="icon">
                <p>${day.main.temp.toFixed(1)}°C</p>
                <p>${day.weather[0].description}</p>
                <p>Humidity: ${day.main.humidity}%</p>
            </div>
        `;
    });
}

searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) getWeather(city);
});
