let zoom = 1;
let panX = 0, panY = 0;

let lastMouseX = 0, lastMouseY = 0;
let isPanning = false;
let isDragging = false;

let offsetX = 0, offsetY = 0;
let pointX = 0, pointY = 0;

function screenToWorld(screenX, screenY) {
  let untranslatedX = screenX - width / 2;
  let untranslatedY = screenY - height / 2;

  let unPannedX = untranslatedX - panX;
  let unPannedY = untranslatedY - panY;

  let worldX = unPannedX / zoom;
  let worldY = unPannedY / zoom;

  return createVector(worldX, worldY);
}

function mousePressed() {
  let worldMouse = screenToWorld(mouseX, mouseY);
  let r_point = 10 / zoom;
  
  let d = dist(worldMouse.x, worldMouse.y, pointX, pointY);

  if (d < r_point) {
    isDragging = true;
    offsetX = pointX - worldMouse.x;
    offsetY = pointY - worldMouse.y;
    return;
  }

  isPanning = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

function mouseReleased() {
  isDragging = false;
  isPanning = false;
}

function drawUnitCircle(angleInDegrees, r) {
  noFill();
  stroke(225);
  strokeWeight(2 / zoom);
  circle(0, 0, r * 2);

  let theta_rad = degToRad(angleInDegrees);

  pointX = r * cos(theta_rad);
  pointY = r * sin(theta_rad);

  // Angle Arc Visualization ---
  noFill();
  stroke(255, 165, 0);
  strokeWeight(2 / zoom);
  arc(0, 0, r * 0.4, r * 0.4, 0, theta_rad);

  // Sine And Cosine
  stroke(50, 200, 50);
  fill(50, 200, 50, 50);
  strokeWeight(2 / zoom);

  line(0, 0, pointX, pointY); // Hypo
  line(0, 0, pointX, 0); // Adj
  line(pointX, 0, pointX, pointY); // Opp

  const minAngleOffset = 0.001;

  // Tangent and Secant
  if (abs(cos(theta_rad)) > minAngleOffset) {
    let tanX_end = r;
    let tanY_end = r * tan(theta_rad);

    if (abs(tanY_end) < 10000 * zoom){
      // Tangent
      stroke(0, 255, 255);
      strokeWeight(2 / zoom);
      line(tanX_end, 0,tanX_end, tanY_end);

      // Secant
      stroke(255, 0, 255);
      strokeWeight(2 / zoom);
      line(0, 0, tanX_end, tanY_end);

      // Circle
      stroke(255, 0, 255);
      strokeWeight(2 / zoom);
      fill(255, 0, 255);
      circle(tanX_end, tanY_end, 5 / zoom);
    }
  }

  // Cotangent And Cosecant
  if (abs(sin(theta_rad)) > minAngleOffset) {
    let cotX_end = r / tan(theta_rad);
    let cotY_end = r;
    
    if (abs(cotX_end) < 10000 * zoom){
      // Cotangent
      stroke(255, 255, 0);
      strokeWeight(2 / zoom);
      line(0, cotY_end, cotX_end, cotY_end);

      // Cosecant
      stroke(255, 140, 0);
      strokeWeight(2 / zoom);
      line(0, 0, cotX_end, cotY_end);

      stroke(255, 120, 0);
      strokeWeight(2 / zoom);
      fill(255, 120, 0);
      circle(cotX_end, cotY_end, 5 / zoom);
    }
  }

  // Draw The Triangle
  stroke(50, 200, 50);
  fill(50, 200, 50, 100);
  strokeWeight(2 / zoom);

  triangle(0, 0, pointX, 0, pointX, pointY);

  // Draw the point on the circle
  noStroke();
  fill(225, 50, 50);
  circle(pointX, pointY, 10 / zoom);

  fill(225);
  textSize(10 / zoom);
  text(`(${pointX.toFixed(2)}, ${pointY.toFixed(2)})` , pointX + (15 / zoom), pointY - (15 / zoom));
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

function drawGrid() {
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

  let startX = (-panX - width / 2) / zoom;
  let endX = (width / 2 - panX) / zoom;
  let startY = (-panY - height / 2) / zoom;
  let endY = (height / 2 - panY) / zoom;

  let firstX = Math.floor(startX / cellSize) * cellSize;
  let firstY = Math.floor(startY / cellSize) * cellSize;

  for (let x = firstX; x <= endX; x += cellSize) {
      stroke(225);
      line(x, startY, x, endY);

      fill(225);
      noStroke();
      text(x, x, 12 / zoom);
    }

    for (let y = firstY; y <= endY; y += cellSize) {
      stroke(225);
      line(startX, y, endX, y);

      fill(225);
      noStroke();
      text(y, 12 / zoom, y);
    }
}

function mouseWheel(event) {
  let zoomFactor = 0.05;

  if (event.delta > 0) zoom -= zoomFactor;
  else zoom += zoomFactor;

  zoom = constrain(zoom, 0.1, 5);

  return false;
}

function mouseDragged() {
  if (isPanning && !isDragging) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;

    panX += dx;
    panY += dy;

    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function setup() {
  createCanvas(windowWidth - 40, windowHeight - 40);
}

function draw() {
  background(0);

  let r = Number(select('#r').value());
  let theta = Number(select('#theta').value());

  push();
  translate(width / 2, height / 2);
  translate(panX, panY);
  scale(zoom);
  drawGrid();
  drawUnitCircle(theta, r);
  pop();

  if (isDragging) {
    let worldMouse = screenToWorld(mouseX, mouseY);

    pointX = worldMouse.x + offsetX;
    pointY = worldMouse.y + offsetY;

    let new_r = dist(0, 0, pointX, pointY);
    select('#r').value(new_r);

    let new_theta_rad = atan2(pointY, pointX);
    let new_theta_deg = new_theta_rad * (180 / Math.PI);

    if (new_theta_deg < 0) new_theta_deg += 360;

    select('#theta').value(new_theta_deg);
  }
}