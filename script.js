const OPENWEATHER_API_KEY = "02935cddc892cbbc45a189ecc523152c";

const backgroundVideo         = document.getElementById("bg-video");
const backgroundVideoOverlay  = document.getElementById("bg-video-overlay");
const forecastContainer       = document.getElementById("forecast-container");
const searchBarInput          = document.getElementById("search-input");
const searchClearBtn          = document.getElementById("clear-btn");
const mainContainer           = document.getElementById("main-container");
const currentInformation      = document.getElementById("current-information");
const currentInformationIcons = document.getElementById("current-information-icons");
const currentCityEl           = document.getElementById("current-city");
const currentDegreesEl        = document.getElementById("current-degrees");
const highLowEl               = document.querySelector("#main-container h3");
const feelsLikeEl             = document.getElementById("feels-like");

const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const weatherIcons = {
    unknown: `fa-solid fa-question`,
    cloud: `fa-regular fa-cloud`,
    clouds: `fa-regular fa-clouds`,
    cloudFog: `fa-regular fa-cloud-fog`,
    cloudSun: `fa-regular fa-sun-cloud`,
    cloudBolt: `fa-regular fa-cloud-bolt`,
    cloudBoltSun: `fa-regular fa-cloud-bolt-sun`,
    cloudBoltMoon: `fa-regular fa-cloud-bolt-moon`,
    smog: `fa-regular fa-smog`,
    sun: `fa-regular fa-sun`,
    wind: `fa-regular fa-wind`,
    windWarning: `fa-regular fa-wind-warning`,
    tornado: `fa-regular fa-tornado`,
    bolt: `fa-regular fa-bolt-lightning`,
    snow: `fa-regular fa-cloud-snow`,
    umbrella: `fa-regular fa-umbrella`,
};

const preloadVideos = {
  cloudy: document.getElementById("preload-cloudy"),
  sunny: document.getElementById("preload-sunny"),
  rain: document.getElementById("preload-rain"),
  snow: document.getElementById("preload-snow")
};

main();
function main() {
    searchClearBtn.addEventListener('click', () => {
        searchBarInput.value = '';
        searchBarInput.focus();
    });
    createForecastCard();
}

function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    const diff = date - firstThursday;
    return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
}

// ALWAYS fetch either currentWeather, 3hourForecast, or both afterwards MANUALLY!
function updateURL(location, date = null) {
    const newUrl = `${window.location.pathname}?location=${encodeURIComponent(location)}&date=${encodeURIComponent(date)}`;
    history.pushState({}, "", newUrl);
}

function changeBackground(videoElementId, newSrc) {   
    const videoElement = document.getElementById(videoElementId);
    console.log(videoElement);
    if (!(videoElement instanceof HTMLVideoElement)) {
        console.warn("changeBackground: videoElement is not a valid HTMLVideoElement.");
        return;
    }

    if (!document.body.contains(videoElement)) {
        console.warn("changeBackground: videoElement is not in the DOM.");
        return;
    }

    const parent = videoElement.parentNode;
    if (!parent) {
        console.warn("changeBackground: videoElement has no parent node.");
        return;
    }

    if (videoElement.getAttribute("data-src") === newSrc) return;

    const clone = videoElement.cloneNode(true);
    clone.src = newSrc;
    clone.setAttribute("data-src", newSrc);
    clone.style.opacity = 0;

    parent.insertBefore(clone, videoElement);

    clone.addEventListener("canplay", () => {
        requestAnimationFrame(() => {
            clone.style.transition = "opacity 0.5s ease";
            clone.style.opacity = 1;

            setTimeout(() => {
                if (videoElement.parentNode) {
                    videoElement.remove();
                }
            }, 500);
        });
    });

    clone.load();
}

function stopOverlayVideo() {
    const backgroundVideoOverlay = document.getElementById("bg-video-overlay");
    backgroundVideoOverlay.style.pointerEvents = "none";
    backgroundVideoOverlay.style.zIndex = -3;

    backgroundVideoOverlay.style.transition = "opacity 0.5s ease";
    backgroundVideoOverlay.style.opacity = 0;

    setTimeout(() => {
        backgroundVideoOverlay.pause();
        backgroundVideoOverlay.removeAttribute("src");
        backgroundVideoOverlay.load();
        backgroundVideoOverlay.style.display = "none";
    }, 500);
}

function createForecastCard(amount = 6) {
    forecastContainer.innerHTML = "";
    const today = new Date();

    for (let i = 0; i < amount; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const isoDate = date.toLocaleDateString('sv-SE');

        const weekNumber = getWeekNumber(date);
        const jsDay = date.getDay();
        const weekdayIndex = jsDay === 0 ? 6 : jsDay - 1;

        const card = document.createElement("div");
        card.id = `forecast-card-${i + 1}`;
        card.classList.add("forecast-card");
        card.dataset.date = isoDate;

        const header = document.createElement("h3");
        header.classList.add("forecast-card-header");
        header.textContent = weekdays[weekdayIndex];

        const icon = document.createElement("i");
        icon.className = weatherIcons.unknown.trim() + " fa";

        const information = document.createElement("div");
        information.classList.add("forecast-card-information");

        const degrees = document.createElement("h2");
        degrees.classList.add("forecast-card-degrees");
        degrees.textContent = "-°C";

        const wind = document.createElement("h2");
        wind.classList.add("forecast-card-wind");
        wind.innerHTML = `- m/s <i class="fa-regular fa-wind"></i>`;

        const week = document.createElement("h5");
        week.textContent = `Week ${weekNumber}`;
        week.style.position = "absolute";
        week.style.bottom = "5px";
        week.style.left = "5px";

        forecastContainer.appendChild(card);
        card.append(header, icon, information, week);
        information.append(degrees, wind);

        card.addEventListener('mouseenter', () => {            
            const cardRect = card.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            const cardCenterX = cardRect.left + cardRect.width / 2;
            const containerCenterX = containerRect.left + containerRect.width / 2;

            const distanceFromCenter = containerCenterX - cardCenterX;
            const translateX = distanceFromCenter * 0.02;

            card.style.transform = `scale(1.15) translateX(${translateX}px)`;
            card.style.zIndex = 10;
        });

        card.addEventListener("click", () => {
            const params = new URLSearchParams(window.location.search);
            const location = params.get("location") || "Arendal";
            const date = card.dataset.date;
            updateURL(location, date);
            fetchWeatherData(location, date);
            highlightCardForDate(date);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.zIndex = 'auto';
        });
    }
}

function highlightCardForDate(dateString = null) {
    // Current date if not specified
    if (dateString == null) {
        dateString = new Date();
    }
    document.querySelectorAll(".forecast-card").forEach((card) => {
        if (card.dataset.date === dateString) {
            card.classList.add("selected");
        } else {
            card.classList.remove("selected");
        }
    });
}

function countryCodeToFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => 
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

// Main Information
async function fetchWeatherData(cityName = "Arendal, NO", targetDate = null) {
    try {
        const isForecast = Boolean(targetDate);
        const encodedCity = encodeURIComponent(cityName);

        const url = isForecast
            ? `https://api.openweathermap.org/data/2.5/forecast?q=${encodedCity}&units=metric&appid=${OPENWEATHER_API_KEY}`
            : `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&units=metric&appid=${OPENWEATHER_API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not fetch data...");

        const data = await response.json();

        const weatherData = isForecast
            ? (() => {
                const dateStr = new Date(targetDate).toISOString().split("T")[0];
                const match = data.list.find(item => item.dt_txt.startsWith(dateStr));
                if (!match) throw new Error("No forecast available for this date.");
                return match;
            })()
            : data;

        const city = isForecast ? data.city.name : data.name;
        const country = isForecast ? data.city.country : data.sys.country;
        const flagEmoji = countryCodeToFlagEmoji(country);

        currentCityEl.innerHTML = `${city}<span>${country}${flagEmoji}</span> `;

        const temp = weatherData.main.temp;
        const feelsLike = weatherData.main.feels_like;
        currentDegreesEl.textContent = `${(+temp).toFixed(1)}°C`;
        feelsLikeEl.textContent = `Feels Like: ${(+feelsLike).toFixed(1)}°C`;

        const condition = weatherData.weather[0].main.toLowerCase();
        console.log(condition);
        backgroundVideoOverlay.style.display = "none";

        // Background video set-up
        if (condition.includes("rain") || condition.includes("thunderstorm")) {
            console.log("rainy");
            backgroundVideoOverlay.style.zIndex = -1;
            backgroundVideoOverlay.style.display = "block";
            changeBackground("bg-video-overlay", preloadVideos.rain.src);
        } else if (condition.includes("snow")) {
            console.log("snowy");
            backgroundVideoOverlay.style.zIndex = -1;
            backgroundVideoOverlay.style.display = "block";
            changeBackground("bg-video-overlay", preloadVideos.snow.src);
        } else {
            console.log("clear");
            stopOverlayVideo();
        }

        if (condition.includes("cloud") || condition.includes("drizzle")  || condition.includes("rain") || condition.includes("thunderstorm") || condition.includes("snow")) {
            changeBackground("bg-video", preloadVideos.cloudy.src);
        } else {
            changeBackground("bg-video", preloadVideos.sunny.src);
        }

        const uv = document.getElementById("uv");
        const ms = document.getElementById("ms");
        const mm = document.getElementById("mm");

        let precipitation = 0;
        if (weatherData.rain && weatherData.rain["3h"] !== undefined) {
            precipitation = weatherData.rain["3h"];
        } else if (weatherData.snow && weatherData.snow["3h"] !== undefined) {
            precipitation = weatherData.snow["3h"];
        }

        if (!weatherData.uvi && !weatherData.main.uvi) {
            uv.textContent = "N/A (UV)";
        } else {
            const uvi = weatherData.uvi ?? weatherData.main.uvi;
            uv.textContent = `${uvi} (UV)`;
        }

        const windSpeed = weatherData.wind.speed;
        ms.textContent = `${(+windSpeed).toFixed(1)} m/s`;
        mm.textContent = `${precipitation.toFixed(1)} mm`;
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

// Next Few Days Forecast
async function fetch3hourForecast(cityName = "Arendal, NO") {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            cityName
        )}&units=metric&appid=${OPENWEATHER_API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Forecast error: ${response.status}`);
        }

        const forecastData = await response.json();
        
        const items = forecastData.list.slice(0, 9);
        
        for (let i = 0; i < items.length; i++) {
            const slot = items[i];
            const card = document.getElementById(`forecast-card-${i + 1}`);

              /////////////////////////////////////////////
             // ??? UPDATE LATER (IF CONDITION ...) ??? //
            /////////////////////////////////////////////

            if (!card) continue;
            const condition = slot.weather[0].main.toLowerCase();
            let iconClass = weatherIcons.unknown;
            if (condition.includes("cloud")) iconClass = weatherIcons.clouds;
            if (condition.includes("rain")) iconClass  = weatherIcons.umbrella;
            if (condition.includes("snow")) iconClass  = weatherIcons.snow;
            if (condition.includes("clear")) iconClass = weatherIcons.sun;
            const iconEl = card.querySelector("i.fa");
            iconEl.className = iconClass.trim() + " fa";
            const degreesEl = card.querySelector(".forecast-card-degrees");
            degreesEl.textContent = `${(+slot.main.temp).toFixed(1)}°C`;

            const windEl = card.querySelector(".forecast-card-wind");
            windEl.innerHTML = `${(+slot.wind.speed).toFixed(1)} m/s <i class="fa-regular fa-wind"></i>`;

            let precip3h = 0;
            if (slot.rain && slot.rain["3h"] !== undefined) {
                precip3h = slot.rain["3h"];
            } else if (slot.snow && slot.snow["3h"] !== undefined) {
                precip3h = slot.snow["3h"];
            }
        }
    } catch (err) {
        console.error("Error fetching 3-hour forecast:", err);
    }
}

// Autocomplete Search Bar
function initAutocomplete() {
    let autocomplete = new google.maps.places.Autocomplete(searchBarInput, {
        types: ["(cities)"],
    });

    autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry) {
            alert("No details available for input: '" + place.name + "'");
            return;
        }
        
        const countryComponent = place.address_components.find(component => component.types.includes("country"));
        const country = countryComponent ? countryComponent.short_name : "";

        const location = `${place.name}, ${country}`;
        updateURL(location, null);

        fetchWeatherData(location);
        fetch3hourForecast(location);
    });
}

window.onload = initAutocomplete;

searchBarInput.addEventListener("keydown", (k) => {
    if (k.key === "Enter") {
        const cityName = searchBarInput.value.trim();
        if (cityName) {
            updateURL(cityName, null);
            fetchWeatherData(cityName);
            fetch3hourForecast(cityName);
        }
    }
});

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const location = params.get("location") || "Arendal";
    const date = params.get("date");

    fetchWeatherData(location, date);
    fetch3hourForecast(location);
    highlightCardForDate(date);
});

setTimeout(() => {
    console.log(`
    This is a free weather API from 'openweathermap.org'\n    Data may not be accurate.\n
    UV index needs a seperate API call, which is paid for.
    `);
    console.log(`
    Search API ["(cities)"] powered by Google Maps.
    `);
}, 1000);

function loadCreditsPage() {
    document.location.href = "http://127.0.0.1:3000/credits/index.html";
}