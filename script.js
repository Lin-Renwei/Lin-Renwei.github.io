const trips = [
  {
    id: "wanggan",
    title: "皖赣四日自驾",
    dates: "3.27 - 3.30",
    desc: "武汉出发，经过天柱山、景德镇、南昌，最后返回中国地质大学。",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=85",
    places: [
      {
        id: "tianzhu",
        title: "天柱山",
        desc: "山景民宿、景区初游，适合放松和拍照。",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=85",
        nodes: [
          ["08:00", "武汉出发", "中国地质大学西区出发，走武黄高速、沪渝高速到潜山出口。"],
          ["11:00", "归云居民宿", "抵达民宿停车，找饭店、办理住宿。"],
          ["下午", "天柱山初游", "民宿在景区内，可先轻松逛一段路线。"]
        ]
      },
      {
        id: "jingdezhen",
        title: "景德镇",
        desc: "陶瓷博物馆、三宝村、陶溪川，陶瓷文化的一天。",
        image: "https://images.unsplash.com/photo-1523419409543-a5e549c1faa8?auto=format&fit=crop&w=600&q=85",
        nodes: [
          ["10:00", "景德镇中国陶瓷博物馆", "免费，提前两天预约。重点看元代青花瓷、釉里红和无语佛。"],
          ["13:30", "三宝国际陶艺村", "建议租共享电动车，逛三宝蓬艺术聚落、陶艺村博物馆。"],
          ["15:30", "陶艺体验", "可预约拉坯或彩绘体验，适合慢慢玩。"],
          ["18:30", "陶溪川文创街区", "老瓷厂改造街区，晚上灯光好看，晚餐去回家吃饭。"]
        ]
      },
      {
        id: "nanchang",
        title: "南昌",
        desc: "八一广场、珠宝街、万寿宫、滕王阁、秋水广场。",
        image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=85",
        nodes: [
          ["10:30", "八一广场", "20 分钟左右，主要打卡拍照。"],
          ["11:00", "江西美术馆", "免费，提前公众号预约，带身份证。"],
          ["11:45", "珠宝街", "洪都大拇指、绿豆饼、瓦罐汤、拌粉。拥挤可转羊子巷。"],
          ["13:30", "万寿宫", "古风街区、糊羹、非遗店，步行游览比较方便。"],
          ["15:00", "滕王阁", "门票 50 元，学生半价。登 6 层看赣江。"],
          ["20:30", "秋水广场音乐喷泉", "周日 20:30 准时开始，西侧台阶视野好。"]
        ]
      }
    ]
  }
];

let activeTrip = trips[0];
let activePlace = activeTrip.places[0];
let photos = loadPhotos();

const screens = {
  trips: document.querySelector("#tripScreen"),
  places: document.querySelector("#placeScreen"),
  nodes: document.querySelector("#nodeScreen")
};

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderTrips() {
  document.querySelector("#tripCards").innerHTML = trips.map((trip) => `
    <button class="select-card" type="button" data-trip="${trip.id}">
      <img class="avatar" src="${trip.image}" alt="${trip.title}">
      <h3>${trip.title}</h3>
      <p>${trip.dates}<br>${trip.desc}</p>
    </button>
  `).join("");
}

function renderPlaces() {
  document.querySelector("#placeTripTitle").textContent = activeTrip.title;
  document.querySelector("#placeDates").textContent = activeTrip.dates;
  document.querySelector("#placeCards").innerHTML = activeTrip.places.map((place) => `
    <button class="select-card" type="button" data-place="${place.id}">
      <img class="avatar" src="${place.image}" alt="${place.title}">
      <h3>${place.title}</h3>
      <p>${place.desc}</p>
    </button>
  `).join("");
}

function renderNodes() {
  document.querySelector("#nodeTripTitle").textContent = activeTrip.title;
  document.querySelector("#nodePlaceTitle").textContent = activePlace.title;
  document.querySelector("#nodePlaceSummary").textContent = activePlace.desc;
  renderPhotos();
  document.querySelector("#nodeList").innerHTML = activePlace.nodes.map((node) => `
    <article class="node-card">
      <time>${node[0]}</time>
      <div>
        <h3>${node[1]}</h3>
        <p>${node[2]}</p>
      </div>
    </article>
  `).join("");
}

function loadPhotos() {
  const saved = localStorage.getItem("travel-place-photos");
  if (!saved) return {};

  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
}

function savePhotos() {
  localStorage.setItem("travel-place-photos", JSON.stringify(photos));
}

function renderPhotos() {
  const placePhotos = photos[activePlace.id] || [];
  const photoGrid = document.querySelector("#photoGrid");

  if (!placePhotos.length) {
    photoGrid.innerHTML = '<div class="photo-empty">还没有上传这个地点的图片。</div>';
    return;
  }

  photoGrid.innerHTML = placePhotos.map((photo, index) => `
    <figure class="photo-card">
      <img src="${photo}" alt="${activePlace.title} 旅行图片">
      <button type="button" data-photo-index="${index}" aria-label="删除图片">×</button>
    </figure>
  `).join("");
}

document.querySelector("#tripCards").addEventListener("click", (event) => {
  const card = event.target.closest("[data-trip]");
  if (!card) return;
  activeTrip = trips.find((trip) => trip.id === card.dataset.trip);
  renderPlaces();
  showScreen("places");
});

document.querySelector("#placeCards").addEventListener("click", (event) => {
  const card = event.target.closest("[data-place]");
  if (!card) return;
  activePlace = activeTrip.places.find((place) => place.id === card.dataset.place);
  renderNodes();
  showScreen("nodes");
});

document.querySelector("#backToTrips").addEventListener("click", () => showScreen("trips"));
document.querySelector("#backToPlaces").addEventListener("click", () => showScreen("places"));

document.querySelector("#photoInput").addEventListener("change", async (event) => {
  const files = [...event.target.files].filter((file) => file.type.startsWith("image/"));
  if (!files.length) return;

  const encodedPhotos = await Promise.all(files.map(readImageFile));
  photos[activePlace.id] = [...(photos[activePlace.id] || []), ...encodedPhotos];
  savePhotos();
  renderPhotos();
  event.target.value = "";
});

document.querySelector("#photoGrid").addEventListener("click", (event) => {
  const button = event.target.closest("[data-photo-index]");
  if (!button) return;

  const index = Number(button.dataset.photoIndex);
  photos[activePlace.id].splice(index, 1);
  savePhotos();
  renderPhotos();
});

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

renderTrips();
