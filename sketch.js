let zoom = 1;
let panX = 0;
let panY = 0;

let lastMouseX = 0;
let lastMouseY = 0;
let isPanning = false;

let r = 200;

function drawPointAndTriangle(angleInDegrees){
  let theta_rad = degToRad(angleInDegrees);

  let x = r * cos(theta_rad);
  let y = r * sin(theta_rad);

  stroke(50, 200, 50);
  fill(50, 200, 50, 100);
  strokeWeight(2 / zoom);

  triangle(0, 0, x, 0, x, y);

  // Draw the point on the circle
  noStroke();
  fill(225, 50, 50);
  circle(x, y, 10 / zoom);

  fill(225);
  textSize(10 / zoom);
  text(`(${x.toFixed(2)}, ${y.toFixed(2)})` , x + (15 / zoom), y - (15 / zoom));
}

function degToRad(degrees){
  return degrees * (Math.PI / 180);
}

function drawGrid(){
  noFill();
  stroke(225);
  strokeWeight(2 / zoom);
  circle(0, 0, r * 2);

  const idealPixelSize = 75; 
  const approxCellSize = idealPixelSize / zoom;

  let exponent = Math.floor(Math.log10(approxCellSize));
  let powerOf10 = Math.pow(10, exponent);
  let cellSize;

  if (approxCellSize / powerOf10 >= 5) {
      cellSize = powerOf10 * 5;
  } else if (approxCellSize / powerOf10 >= 2) {
      cellSize = powerOf10 * 2;
  } else {
      cellSize = powerOf10 * 1;
  }
    
  textSize(12 / zoom);
  fill(1);
  textAlign(CENTER, CENTER);

  let startX = (-panX) / zoom;
  let endX = (width - panX) / zoom;
  let startY = (-panY) / zoom;
  let endY = (height - panY) / zoom;

  let firstX = Math.floor(startX / cellSize) * cellSize;
  let firstY = Math.floor(startY / cellSize) * cellSize;

  for (let x = firstX; x <= endX; x += cellSize){
      stroke(225);
      line(x, startY, x, endY);

      fill(225);
      noStroke();
      text(x, x, 12 / zoom);
    }

    for (let y = firstY; y <= endY; y += cellSize){
      stroke(225);
      line(startX, y, endX, y);

      fill(225);
      noStroke();
      text(y, 12 / zoom, y);
    }
}

function mouseWheel(event){
  let zoomFactor = 0.05;

  if (event.delta > 0) zoom -= zoomFactor;
  else zoom += zoomFactor;

  zoom = constrain(zoom, 0.1, 5);

  return false;
}

function mousePressed() {
  isPanning = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  isPanning = false;
}

function mouseDragged() {
  if (isPanning) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;

    panX += dx;
    panY += dy;

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function setup(){
  createCanvas(windowWidth - 40, windowHeight - 40);
  // background(111);
}

function draw(){
  background(0)
  push();
  translate(panX, panY);
  scale(zoom);
  drawGrid();
  drawPointAndTriangle(20);
  pop();
}