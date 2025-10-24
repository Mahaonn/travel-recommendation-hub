// Получение элементов
const searchInput = document.getElementById("searchInput");
const resultsContainer = document.getElementById("resultsContainer");

// Загрузка данных из JSON
let travelData = {};

fetch("travel_recommendation_api.json")
  .then((response) => response.json())
  .then((data) => {
    travelData = data;
    console.log("Travel data loaded:", travelData);
  })
  .catch((error) => {
    console.error("Error loading travel data:", error);
  });

// Обработка поиска
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  resultsContainer.innerHTML = "";

  if (!query) return;

  const matchedItems = [];

  // Фильтрация по ключевым словам
  if (["beach", "beaches"].includes(query)) {
    matchedItems.push(...travelData.beaches.slice(0, 2));
  } else if (["temple", "temples"].includes(query)) {
    matchedItems.push(...travelData.temples.slice(0, 2));
  } else if (["country", "countries"].includes(query)) {
    travelData.countries.forEach((country) => {
      matchedItems.push(...country.cities.slice(0, 2));
    });
  } else {
    // Поиск по описанию и названию
    ["beaches", "temples"].forEach((category) => {
      travelData[category].forEach((item) => {
        if (
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        ) {
          matchedItems.push(item);
        }
      });
    });

    travelData.countries.forEach((country) => {
      country.cities.forEach((city) => {
        if (
          city.name.toLowerCase().includes(query) ||
          city.description.toLowerCase().includes(query)
        ) {
          matchedItems.push(city);
        }
      });
    });
  }

  // Отображение результатов
  if (matchedItems.length > 0) {
    matchedItems.forEach((item) => {
      const card = document.createElement("div");
      card.classList.add("result-card");

      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.name;
      img.classList.add("result-image");

      const name = document.createElement("h3");
      name.textContent = item.name;
      name.classList.add("result-title");

      const desc = document.createElement("p");
      desc.textContent = item.description;
      desc.classList.add("result-description");

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(desc);
      resultsContainer.appendChild(card);
    });
  } else {
    resultsContainer.innerHTML = "<p>No recommendations found.</p>";
  }
}

// Очистка результатов
function handleReset() {
  searchInput.value = "";
  resultsContainer.innerHTML = "";
}

// Привязка событий к кнопкам
document.getElementById("searchButton").addEventListener("click", handleSearch);
document.getElementById("clearButton").addEventListener("click", handleReset);
