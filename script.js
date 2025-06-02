const forecastContainer = document.getElementById("forecast-container");
const mainContainer = document.getElementById("main-container");
const currentInformation = document.getElementById("current-information");
const currentInformationIcons = document.getElementById("current-information-icons");

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

function createForecastCard(amount, iconClass = weatherIcons.unknown) {
    const today = new Date();
    for (let i = 0; i < amount; i++) {
        const card = document.createElement("div");
        card.id = `forecast-card-${i + 1}`;
        card.classList.add("forecast-card");

        const header = document.createElement("h3");
        header.classList.add("forecast-card-header");
        header.textContent = weekdays[(today.getDay() + i) % weekdays.length];

        const icon = document.createElement("i");
        icon.className = iconClass.trim() + " fa";

        const information = document.createElement("div");
        information.classList.add("forecast-card-information");

        const degrees = document.createElement("h2");
        degrees.classList.add("forecast-card-degrees");
        degrees.textContent = "-°C / -°C";

        const wind = document.createElement("h2");
        wind.classList.add("forecast-card-wind");
        wind.innerHTML = `- m/s <i class="fa-regular fa-wind"></i>`;

        forecastContainer.appendChild(card);
        card.append(header, icon, information);
        information.append(degrees, wind);
    }
}

function main() {
    createForecastCard(20, weatherIcons.unknown);
}

main();