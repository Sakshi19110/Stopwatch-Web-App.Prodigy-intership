let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let running = false;

const display = document.getElementById('display');
const startStopBtn = document.getElementById('startStopBtn');
const lapBtn = document.getElementById('lapBtn');
const resetBtn = document.getElementById('resetBtn');
const lapsList = document.getElementById('lapsList');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Time Update
function updateTime() {
  elapsedTime = Date.now() - startTime;
  let time = new Date(elapsedTime);
  let min = String(time.getUTCMinutes()).padStart(2, '0');
  let sec = String(time.getUTCSeconds()).padStart(2, '0');
  let ms = String(Math.floor(time.getUTCMilliseconds() / 10)).padStart(2, '0');
  display.textContent = `${min}:${sec}:${ms}`;
}

// Start/Pause
startStopBtn.addEventListener('click', () => {
  if (!running) {
    running = true;
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTime, 10);
    startStopBtn.textContent = '⏸️ Pause';
  } else {
    running = false;
    clearInterval(timerInterval);
    startStopBtn.textContent = '▶️ Start';
  }
});

// Lap + Storage
lapBtn.addEventListener('click', () => {
  if (running) {
    const time = display.textContent;
    const li = document.createElement('li');
    li.textContent = time;
    lapsList.appendChild(li);
    saveLap(time);
  }
});

function saveLap(time) {
  let laps = JSON.parse(localStorage.getItem('laps')) || [];
  laps.push(time);
  localStorage.setItem('laps', JSON.stringify(laps));
}

function loadLaps() {
  let laps = JSON.parse(localStorage.getItem('laps')) || [];
  lapsList.innerHTML = ''; // clear old
  laps.forEach(lap => {
    const li = document.createElement('li');
    li.textContent = lap;
    lapsList.appendChild(li);
  });
}

// Reset
resetBtn.addEventListener('click', () => {
  running = false;
  clearInterval(timerInterval);
  elapsedTime = 0;
  display.textContent = '00:00:00';
  startStopBtn.textContent = '▶️ Start';
  lapsList.innerHTML = '';
  localStorage.removeItem('laps');
});

// Dark/Light Toggle
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeIcon();
});

function updateThemeIcon() {
  themeToggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

function loadTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark');
  } else {
    document.body.classList.remove('dark');
  }
  updateThemeIcon();
}

// Init
loadTheme();
loadLaps();
