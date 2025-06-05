const OPENWEATHER_API_KEY = "02935cddc892cbbc45a189ecc523152c";

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

main();
function main() {
    searchClearBtn.addEventListener('click', () => {
        searchBarInput.value = '';
        searchBarInput.focus();
    });
    createForecastCard();
    fetchCurrentWeather();
    fetch3hourForecast();
}

function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    const diff = date - firstThursday;
    return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
}

function createForecastCard(amount = 7) {
    forecastContainer.innerHTML = "";
    const today = new Date();

    for (let i = 0; i < amount; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const weekNumber = getWeekNumber(date);
        const jsDay = date.getDay();
        const weekdayIndex = jsDay === 0 ? 6 : jsDay - 1;

        const card = document.createElement("div");
        card.id = `forecast-card-${i + 1}`;
        card.classList.add("forecast-card");

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

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.zIndex = 'auto';
        });
    }
}

function countryCodeToFlagEmoji(countryCode) {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => 
      String.fromCodePoint(127397 + char.charCodeAt())
    );
}

// Main Information
async function fetchCurrentWeather(cityName = "Oslo, NO") {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            cityName
        )}&units=metric&appid=${OPENWEATHER_API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Could not fetch data...");
        }

        const data = await response.json();
        const flagEmoji = countryCodeToFlagEmoji(data.sys.country);
        currentCityEl.innerHTML = `${data.name}<span>${data.sys.country}${flagEmoji}</span> `;
        currentDegreesEl.textContent = `${(+data.main.temp).toFixed(1)}°C`;
        feelsLikeEl.textContent = `Feels Like: ${(+data.main.feels_like).toFixed(1)}°C`;

        const uv = document.getElementById("uv");
        const ms = document.getElementById("ms");
        const mm = document.getElementById("mm");

        let precipitation = 0;
        if (data.rain && data.rain["1h"] !== undefined) {
            precipitation = data.rain["1h"];
        } else if (data.snow && data.snow["1h"] !== undefined) {
            precipitation = data.snow["1h"];
        }

        if (data.main.uv === undefined) {
            uv.textContent = "N/A (UV)"
        } else {
            uv.textContent = `${data.main.uv} (UV)`;
        }
        
        ms.textContent = `${(+data.wind.speed).toFixed(1)} m/s`;
        mm.textContent = `${precipitation.toFixed(1)} mm`;

        logData = true;
        if (logData) console.log(data);
    } catch (err) {
        alert(err.message);
        console.error(err);
    }
}

// Next Few Days Forecast
async function fetch3hourForecast(cityName = "Oslo, NO") {
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
        fetchCurrentWeather(`${place.name}, ${country}`);
        fetch3hourForecast(`${place.name}, ${country}`);
    });
}

window.onload = initAutocomplete;

searchBarInput.addEventListener("keydown", (k) => {
    if (k.key === "Enter") {
        const cityName = searchBarInput.value.trim();
        if (cityName) {
            fetchCurrentWeather(cityName);
            fetch3hourForecast(cityName);
        }
    }
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
