let table;
let rowIndex = 0;
let barW = 100;
let barH = 100;
let distKm = 0;
let formattedTime = '';
let hasTime = false;

function preload() {
  table = loadTable('tdf_winners.csv', 'csv', 'header');
}

function setup() {
  let canvas = createCanvas(280, 280);
  canvas.parent('detail-canvas');

  const params = new URLSearchParams(window.location.search);
  const idParam = parseInt(params.get('id'));
  if (!isNaN(idParam) && idParam >= 0 && idParam < table.getRowCount()) {
    rowIndex = idParam;
  }

  let distances = [];
  let times = [];
  for (let r = 0; r < table.getRowCount(); r++) {
    distances.push(float(table.getString(r, 'distance_km')));
    let t = table.getString(r, 'overall_time_sec');
    if (t !== '' && !isNaN(float(t))) times.push(float(t));
  }

  let minDist = min(distances);
  let maxDist = max(distances);
  let minTime = min(times);
  let maxTime = max(times);

  let year = table.getString(rowIndex, 'year');
  let cyclist = table.getString(rowIndex, 'cyclist');
  let country = table.getString(rowIndex, 'country');
  distKm = float(table.getString(rowIndex, 'distance_km'));
  let timeStr = table.getString(rowIndex, 'overall_time_sec');

  hasTime = timeStr !== '' && !isNaN(float(timeStr));
  let timeSec = hasTime ? float(timeStr) : null;

  barW = map(distKm, minDist, maxDist, 60, 220);
  barH = hasTime ? map(timeSec, minTime, maxTime, 60, 220) : 30;

  if (hasTime) {
    let hrs = floor(timeSec / 3600);
    let mins = floor((timeSec % 3600) / 60);
    let secs = floor(timeSec % 60);
    formattedTime = `${hrs}h ${nf(mins, 2)}m ${nf(secs, 2)}s`;
  } else {
    formattedTime = 'Non disponibile (classifica a punti)';
  }

  document.getElementById('edition-year').textContent = `Edizione ${year}`;
  document.getElementById('winner-name').textContent = cyclist;
  document.getElementById('winner-country').textContent = country;
  document.getElementById('race-distance').textContent = `${distKm} km`;
  document.getElementById('race-time').textContent = formattedTime;
}

function draw() {
  background(18);

  push();
  translate(width / 2, height / 2);

  rectMode(CENTER);
  noStroke();

  fill('#ff8c00');
  rect(0, 0, barW, 14, 4);


  if (hasTime) {
    fill('#00bfff');
    rect(0, 0, 14, barH, 4);
  } else {
    fill('#ff4d4d');
    rect(0, 0, 10, barH, 4);
  }

  pop();
}