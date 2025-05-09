// Hours-scroll
const container = document.getElementById("hourContainer");

  const now = new Date();
  let startHour = now.getHours() + 1;
  let hours = [];

  // Populate until 04:00 next day
  for (let i = 0; i <= 24; i++) {
    let hour = (startHour + i) % 24;
    hours.push(hour);
    if (hour === 4) break;
  }

  hours.forEach(hour => {
    const hourDiv = document.createElement("div");
    hourDiv.className = "hour";

    const textElement = document.createElement("span");
    textElement.textContent = `${hour.toString().padStart(2, '0')}:00`;
  
    //const iconElement = document.createElement("img");
    //imgElement.src = `path/to/your/image${hour}.png`;

    hourDiv.appendChild(textElement);
    //hourDiv.appendChild(imgElement);

    container.appendChild(hourDiv);
  });