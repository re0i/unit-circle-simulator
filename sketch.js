let zoom = 1;
let panX = 0, panY = 0;

let lastMouseX = 0, lastMouseY = 0;
let isPanning = false, isDragging = false;

let offsetX = 0, offsetY = 0;
let pointX = 0, pointY = 0;

const COLORS = {
  // Background
  background: [5, 5, 5],

  // Grid & Axes
  grid: [40, 40, 40],
  gridText: [120, 120, 120],

  // Unit Circle
  circle: [200, 200, 200],
  // Point on Circle
  point: [225, 255, 255],

  // Angle
  arc: [255, 165, 0],

  // Main Triangle
  tri_stroke: [50, 200, 50],
  tri_fill: [50, 200, 50, 35],

  // Trigonometric Lines
  cos: [255, 99, 132],
  sin: [54, 162, 235],
  tan: [0, 255, 127],
  sec: [255, 255, 0],
  cot: [255, 150, 0],
  csc: [200, 100, 255],
  versin: [0, 255, 255],
  
  // Text Color
  text: [225, 225, 225],
};

const labelButton = document.getElementById('labels');
let showLabels = false;

labelButton.onclick = function(){
  showLabels = !showLabels;
  
  if (showLabels) {
    labelButton.textContent = 'hide labels';
  } else {
    labelButton.textContent = 'show labels';
  }
}

function screenToWorld(screenX, screenY) {
  let untranslatedX = screenX - width / 2;
  let untranslatedY = screenY - height / 2;

  let unPannedX = untranslatedX - panX;
  let unPannedY = untranslatedY - panY;

  let worldX = unPannedX / zoom;
  let worldY = unPannedY / zoom;

  return createVector(worldX, -worldY);
}

function degToRad(degrees) {
  return degrees * (Math.PI / 180);
}

function drawLabel(txt, color, size, x, y, alignX = CENTER, alignY = CENTER, strk = false){
  push();
  scale(1, -1);
  fill(color);
  strk? stroke(COLORS.background) : noStroke();
  strokeWeight(2 / zoom);
  textAlign(alignX, alignY);
  textSize(size / zoom);
  text(txt, x, -y);
  pop();
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

function windowResized() {
  resizeCanvas(windowWidth - 25, windowHeight - 25);
}

function drawUnitCircle(angleInDegrees, r) {
  noFill();
  stroke(COLORS.circle);
  strokeWeight(2 / zoom);
  circle(0, 0, r * 2);

  let theta_rad = degToRad(angleInDegrees);

  pointX = r * cos(theta_rad);
  pointY = r * sin(theta_rad);

  // Angle Arc Visualization
  const arcRadius = Math.min(40, r * 0.3);
  noFill();
  stroke(COLORS.arc);
  strokeWeight(3 / zoom);
  arc(0, 0, arcRadius * 2, arcRadius * 2, 0, theta_rad);

  // Triangle
  stroke(COLORS.tri_stroke);
  fill(COLORS.tri_fill);
  strokeWeight(2 / zoom);
  triangle(0, 0, pointX, 0, pointX, pointY);

  line(0, 0, pointX, pointY); // Hyp
  line(0, 0, pointX, 0); // Adj
  line(pointX, 0, pointX, pointY);  // Opp

  if (showLabels) {
    drawLabel(`cos θ = ${(pointX / r).toFixed(2)}`, COLORS.cos, 15, pointX / 2, -14 / zoom, undefined, undefined, true);
    stroke(COLORS.cos)
    line(0, 0, pointX, 0);
    drawLabel(`sin θ = ${(pointY / r).toFixed(2)}`, COLORS.sin, 15, pointX, pointY / 2, LEFT, undefined, true);
    stroke(COLORS.sin)
    line(pointX, 0, pointX, pointY);
  }

  // Tangent and Secant
  const minAngleOffset = 0.001;

  if (abs(cos(theta_rad)) > minAngleOffset) {
    let tanValue = tan(theta_rad);
    let secValue = 1 / cos(theta_rad);

    let tanX_point = r;
    let tanY_point = r * tanValue;

    // Tangent
    stroke(COLORS.tan);
    strokeWeight(3 / zoom);
    line(tanX_point, 0,tanX_point, tanY_point);

    // Secant
    stroke(COLORS.sec);
    strokeWeight(2 / zoom);
    line(0, 0, tanX_point, tanY_point);

    if (showLabels) {
      drawLabel(`tan θ = ${tanValue.toFixed(2)}`, COLORS.tan, 14, tanX_point + 10 / zoom, tanY_point / 2, undefined, undefined, true);
      drawLabel(`sec θ = ${secValue.toFixed(2)}`, COLORS.sec, 14, tanX_point / 2, tanY_point / 2);
    }
  }

  // Cotangent And Cosecant
  if (abs(sin(theta_rad)) > minAngleOffset) {
    let cotValue = cos(theta_rad) / sin(theta_rad);
    let cscValue = 1 / sin(theta_rad);

    let cotX_point = r * cotValue;
    let cotY_point = r;

    // Cotangent
    stroke(COLORS.cot);
    strokeWeight(4 / zoom);
    line(0, r, cotX_point, r);

    // Cosecant
    stroke(COLORS.csc);
    strokeWeight(2 / zoom);
    line(0, 0, cotX_point, cotY_point);

    if (showLabels) {
      drawLabel(`cot θ = ${cotValue.toFixed(2)}`, COLORS.cot, 16, cotX_point / 2, cotY_point + 15 / zoom);
      drawLabel(`csc θ = ${cscValue.toFixed(2)}`, COLORS.csc, 16, cotX_point / 2, cotY_point / 2);
    }
  }

  // Versed Sine Visualization
  stroke(COLORS.versin);
  strokeWeight(4 / zoom);
  line(r * Math.cos(theta_rad), 0, r, 0);
  if (showLabels) {
    let versinValue = r * (1 - cos(theta_rad));
    drawLabel(`versin θ = ${(versinValue).toFixed(2)}`, COLORS.versin, 14, r - versinValue / 2, 12 / zoom);
  }

  // The Point on the Circle
  noStroke();
  fill(COLORS.point);
  circle(pointX, pointY, 10 / zoom);
  drawLabel(`(${pointX.toFixed(2)}, ${pointY.toFixed(2)})`, COLORS.text, 14, pointX + (18 / zoom), pointY + (18 / zoom));
  updateTrigList(theta_rad, r);
}

function updateTrigList(thetaRad, r) {
  const sinV = sin(thetaRad);
  const cosV = cos(thetaRad);
  const tanV = abs(cosV) > 0.001 ? tan(thetaRad) : Infinity;
  const cscV = abs(sinV) > 0.001 ? 1 / sinV : Infinity;
  const secV = abs(cosV) > 0.001 ? 1 / cosV : Infinity;
  const cotV = abs(sinV) > 0.001 ? cosV / sinV : Infinity;
  const versinV = 1 - cosV;

  const list = document.getElementById('trigList');
  list.innerHTML = `
    <li>sin θ = ${sinV.toFixed(4)}</li>
    <li>cos θ = ${cosV.toFixed(4)}</li>
    <li>tan θ = ${tanV === Infinity ? "∞" : tanV.toFixed(4)}</li>
    <li>csc θ = ${cscV === Infinity ? "∞" : cscV.toFixed(4)}</li>
    <li>sec θ = ${secV === Infinity ? "∞" : secV.toFixed(4)}</li>
    <li>cot θ = ${cotV === Infinity ? "∞" : cotV.toFixed(4)}</li>
    <li>versin θ = ${versinV.toFixed(4)}</li>
  `;
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
    
  textSize(10 / zoom);
  fill(1);
  textAlign(CENTER, CENTER);

  let startX = (-panX - width / 2) / zoom;
  let endX = (width / 2 - panX) / zoom;
  let startY = (-panY - height / 2) / zoom;
  let endY = (height / 2 - panY) / zoom;

  let firstX = Math.floor(startX / cellSize) * cellSize;
  let firstY = Math.floor(startY / cellSize) * cellSize;

  for (let x = firstX; x <= endX; x += cellSize) {
      stroke(COLORS.grid);
      line(x, startY, x, endY);

      fill(COLORS.gridText);
      noStroke();
      text(x, x, 12 / zoom);
    }

    for (let y = firstY; y <= endY; y += cellSize) {
      stroke(COLORS.grid);
      line(startX, y, endX, y);

      fill(COLORS.gridText);
      noStroke();
      text(-y, 12 / zoom, y);
    }
}

function setup() {
  createCanvas(windowWidth - 25, windowHeight - 25);
}

function draw() {
  background(COLORS.background);
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

  let r = Number(select('#r').value());
  let theta = Number(select('#theta').value());

  push();
  translate(width / 2, height / 2);
  translate(panX, panY);
  scale(zoom);
  drawGrid();
  scale(1, -1);
  drawUnitCircle(theta, r);
  pop();
}
