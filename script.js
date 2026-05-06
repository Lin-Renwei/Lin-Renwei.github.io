const storageKey = "travel-discipline-nodes";

const titleInput = document.querySelector("#tripTitle");
const dateInput = document.querySelector("#tripDate");
const placeInput = document.querySelector("#tripPlace");
const statusInput = document.querySelector("#tripStatus");
const noteInput = document.querySelector("#tripNote");
const addTripButton = document.querySelector("#addTrip");
const addNodeTopButton = document.querySelector("#addNodeTop");
const clearAllButton = document.querySelector("#clearAll");
const timeline = document.querySelector("#timeline");
const totalTrips = document.querySelector("#totalTrips");
const doneTrips = document.querySelector("#doneTrips");
const latestPlace = document.querySelector("#latestPlace");

const statusText = {
  planned: "计划中",
  done: "已完成",
  memory: "值得回味"
};

let trips = loadTrips();

function loadTrips() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) {
    return [
      {
        id: crypto.randomUUID(),
        title: "第一次旅行记录",
        date: new Date().toISOString().slice(0, 10),
        place: "待定目的地",
        status: "planned",
        note: "写下这次行程的预算、路线、想看的风景，以及回来后想保留的记忆。"
      }
    ];
  }

  try {
    return JSON.parse(saved);
  } catch {
    return [];
  }
}

function saveTrips() {
  localStorage.setItem(storageKey, JSON.stringify(trips));
}

function renderTrips() {
  const sortedTrips = [...trips].sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  totalTrips.textContent = trips.length;
  doneTrips.textContent = trips.filter((trip) => trip.status === "done").length;
  latestPlace.textContent = sortedTrips[0]?.place || "暂无";

  if (!sortedTrips.length) {
    timeline.innerHTML = '<div class="empty">还没有行程节点，先添加一次旅行吧。</div>';
    return;
  }

  timeline.innerHTML = sortedTrips.map((trip) => `
    <article class="trip-card">
      <h3>${escapeHtml(trip.title)}</h3>
      <div class="trip-meta">
        <span>${escapeHtml(trip.date || "未填写日期")}</span>
        <span>${escapeHtml(trip.place || "未填写地点")}</span>
        <span class="badge">${statusText[trip.status] || "计划中"}</span>
      </div>
      <p class="trip-note">${escapeHtml(trip.note || "暂无备注")}</p>
      <button class="delete-button" type="button" data-id="${trip.id}">删除节点</button>
    </article>
  `).join("");
}

function addTrip() {
  const title = titleInput.value.trim();
  const date = dateInput.value;
  const place = placeInput.value.trim();
  const note = noteInput.value.trim();

  if (!title) {
    titleInput.focus();
    return;
  }

  trips.push({
    id: crypto.randomUUID(),
    title,
    date,
    place,
    status: statusInput.value,
    note
  });

  saveTrips();
  renderTrips();
  titleInput.value = "";
  dateInput.value = "";
  placeInput.value = "";
  statusInput.value = "planned";
  noteInput.value = "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

addTripButton.addEventListener("click", addTrip);
addNodeTopButton.addEventListener("click", () => titleInput.focus());

timeline.addEventListener("click", (event) => {
  if (!event.target.matches(".delete-button")) {
    return;
  }

  trips = trips.filter((trip) => trip.id !== event.target.dataset.id);
  saveTrips();
  renderTrips();
});

clearAllButton.addEventListener("click", () => {
  if (!trips.length || !confirm("确定清空所有旅行记录吗？")) {
    return;
  }

  trips = [];
  saveTrips();
  renderTrips();
});

renderTrips();
