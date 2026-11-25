let table;
let glyphs = [];
let minDist, maxDist;
let minTime, maxTime;

const COLS = 10;
const CELL_W = 110;
const CELL_H = 115;
const MARGIN_X = 40;
const MARGIN_Y = 30;

function preload() {
  table = loadTable('tdf_winners.csv', 'csv', 'header');
}

function setup() {
  let rowsCount = table.getRowCount();
  let gridRows = ceil(rowsCount / COLS);
  let canvasW = COLS * CELL_W + MARGIN_X * 2;
  let canvasH = gridRows * CELL_H + MARGIN_Y * 2;

  let canvas = createCanvas(canvasW, canvasH);
  canvas.parent('canvas-container');

  let distances = [];
  let times = [];

  for (let r = 0; r < rowsCount; r++) {
    let d = float(table.getString(r, 'distance_km'));
    let tStr = table.getString(r, 'overall_time_sec');
    if (!isNaN(d)) distances.push(d);
    if (tStr !== '' && !isNaN(float(tStr))) times.push(float(tStr));
  }

  minDist = min(distances);
  maxDist = max(distances);
  minTime = min(times);
  maxTime = max(times);

  for (let r = 0; r < rowsCount; r++) {
    let col = r % COLS;
    let row = floor(r / COLS);

    let x = MARGIN_X + col * CELL_W + CELL_W / 2;
    let y = MARGIN_Y + row * CELL_H + CELL_H / 2;

    let distKm = float(table.getString(r, 'distance_km'));
    let timeStr = table.getString(r, 'overall_time_sec');
    let hasTime = timeStr !== '' && !isNaN(float(timeStr));
    let timeSec = hasTime ? float(timeStr) : null;

    let barW = map(distKm, minDist, maxDist, 20, 80);
    let barH = hasTime ? map(timeSec, minTime, maxTime, 20, 80) : 15;

    glyphs.push({
      index: r,
      x: x,
      y: y,
      year: table.getString(r, 'year'),
      distKm: distKm,
      hasTime: hasTime,
      barW: barW,
      barH: barH
    });
  }
}

function draw() {
  background(18);


  for (let g of glyphs) {
    let isHover = dist(mouseX, mouseY, g.x, g.y) < 40;
    if (isHover) hovered = g;

    push();
    translate(g.x, g.y);

    rectMode(CENTER);
    noStroke();

    
    fill(isHover ? '#ffaa33' : '#ff8c00');
    rect(0, 0, g.barW, 7, 3);

    
    if (g.hasTime) {
      fill(isHover ? '#33d6ff' : '#00bfff');
      rect(0, 0, 7, g.barH, 3);
    } else {
      fill('#ff4d4d');
      rect(0, 0, 6, g.barH, 3);
    }

    fill(isHover ? 255 : 150);
    textAlign(CENTER, TOP);
    textSize(10);
    text(g.year, 0, 42);

    pop();
  }

}

function mousePressed() {
  for (let g of glyphs) {
    if (dist(mouseX, mouseY, g.x, g.y) < 40) {
      window.location.href = `detail.html?id=${g.index}`;
      break;
    }
  }
}