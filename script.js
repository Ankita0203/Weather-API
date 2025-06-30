// Replace with your real OpenWeatherMap API key
const API_KEY = "8d0e0126b260522f16c971efa6ba5a53";

// Load history on page load
window.onload = () => {
  loadHistory();
};

function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const weatherCard = document.getElementById("weatherResult");
  const errorBox = document.getElementById("error");
  const spinner = document.getElementById("loadingSpinner");

  if (city === "") {
    errorBox.classList.remove("d-none");
    errorBox.textContent = "Please enter a city name.";
    weatherCard.classList.add("d-none");
    spinner.classList.add("d-none");
    return;
  }

  spinner.classList.remove("d-none");
  errorBox.classList.add("d-none");
  weatherCard.classList.add("d-none");

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(data => {
      // Fill in weather data
      document.getElementById("cityName").textContent = `${data.name}, ${data.sys.country}`;
      document.getElementById("weatherDescription").textContent = data.weather[0].description;
      document.getElementById("temperature").textContent = data.main.temp;
      document.getElementById("humidity").textContent = data.main.humidity;
      document.getElementById("wind").textContent = data.wind.speed;

      const iconCode = data.weather[0].icon;
      document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      weatherCard.classList.remove("d-none");
      saveToHistory(data.name);
    })
    .catch(error => {
      errorBox.classList.remove("d-none");
      errorBox.textContent = error.message;
    })
    .finally(() => {
      spinner.classList.add("d-none");
    });
}

function saveToHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.unshift(city);
    if (history.length > 5) history.pop();
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    loadHistory();
  }
}

function loadHistory() {
  const historyList = document.getElementById("historyList");
  const history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

  historyList.innerHTML = "";
  history.forEach(city => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "list-group-item-action");
    li.textContent = city;
    li.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    historyList.appendChild(li);
  });
}