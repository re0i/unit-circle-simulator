let zoom = 1;
let panX = 0;
let panY = 0;

let lastMouseX = 0;
let lastMouseY = 0;
let isPanning = false;

function drawGrid(){
  const baseCellSize = 50;
  const cellSize = baseCellSize;
    
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
      line(x, startY, x, endX);

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
  pop();
}