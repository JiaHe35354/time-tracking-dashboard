const btnGroup = document.querySelector(".btn-group");
const btns = document.querySelectorAll(".btn");

async function fetchData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Could not fetch the data");

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

btnGroup.addEventListener("click", async function (e) {
  if (!e.target.classList.contains("btn")) return;

  btns.forEach((btn) => btn.classList.remove("btn-active"));

  e.target.classList.add("btn-active");

  const data = await fetchData();

  let timeframe;
  let label;

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

  const boards = document.querySelectorAll(".board");

  data.forEach((item, index) => {
    const current = item.timeframes[timeframe].current;
    const previous = item.timeframes[timeframe].previous;

    const currentEl = boards[index].querySelector(".current-hours");
    const prevTimeframeEl = boards[index].querySelector(".prev-timeframe");
    const prevHoursEl = boards[index].querySelector(".prev-hours");

    let currentSuffix = current <= 1 ? "hr" : "hrs";
    let prevSuffix = previous <= 1 ? "hr" : "hrs";

    currentEl.textContent = `${current}${currentSuffix}`;
    prevTimeframeEl.textContent = `${label}`;
    prevHoursEl.textContent = `${previous}${prevSuffix}`;
  });
});

document.querySelector(".daily").classList.add("btn-active");
