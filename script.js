const mainEl = document.querySelector("main");
const btnGroup = document.querySelector(".btn-group");
const btns = document.querySelectorAll(".btn");

let currentData = null; // To store fetched data

async function fetchData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    showError(error);
    return null;
  }
}

function showError(error) {
  mainEl.innerHTML = ""; // Clear existing content
  const errorText = document.createElement("p");
  errorText.classList.add("error");
  errorText.textContent = `${error.message}: Could not fetch the data, please try again!`;
  mainEl.appendChild(errorText);
}

function updateUI(timeframe, label) {
  const boards = document.querySelectorAll(".board");

  currentData.forEach((item, index) => {
    const current = item.timeframes[timeframe].current;
    const previous = item.timeframes[timeframe].previous;

    const currentEl = boards[index].querySelector(".current-hours");
    const prevTimeframeEl = boards[index].querySelector(".prev-timeframe");
    const prevHoursEl = boards[index].querySelector(".prev-hours");

    const currentSuffix = current <= 1 ? "hr" : "hrs";
    const prevSuffix = previous <= 1 ? "hr" : "hrs";

    currentEl.textContent = `${current}${currentSuffix}`;
    prevTimeframeEl.textContent = label;
    prevHoursEl.textContent = `${previous}${prevSuffix}`;
  });
}

// Run once on load
window.addEventListener("DOMContentLoaded", async () => {
  currentData = await fetchData();

  if (currentData) {
    btns.forEach((btn) => btn.classList.remove("btn-active"));
    document.querySelector(".daily").classList.add("btn-active"); // Default
    updateUI("daily", "Yesterday");
  }
});

// Button group click handling
btnGroup.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn") || !currentData) return;

  btns.forEach((btn) => btn.classList.remove("btn-active"));
  e.target.classList.add("btn-active");

  let timeframe, label;
  if (e.target.classList.contains("daily")) {
    timeframe = "daily";
    label = "Yesterday";
  } else if (e.target.classList.contains("weekly")) {
    timeframe = "weekly";
    label = "Last Week";
  } else if (e.target.classList.contains("monthly")) {
    timeframe = "monthly";
    label = "Last Month";
  }

  updateUI(timeframe, label);
});
