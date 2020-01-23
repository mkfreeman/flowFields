// Main script to construct the noise field

// "Global" variables
let X_START = 0;
const Y_START = 0;
let xoff = 0;
let yoff = 0;
let zoff = 0;
let particles = [];
let flowfield = [];
let canvas;
let nrow, ncol, rectWidth, rectHeight;
let xIncrementSlider, yIncrementSlider, zIncrementSlider, particleSlider, opacitySlider, strokeColorPicker, backgroundColorPicker;

function makeControls() {
  // Controls 
  let controlWrapper = createDiv().id("control-wrapper");
  let controlHeader = createDiv("<h2>Controls</h2>");
  controlHeader.parent(controlWrapper);
  nrowSlider = makeSlider("Vertical Anchors", minVal = 2, maxVal = 50, value = 30, step = 1, parent = controlWrapper, clearContent);
  ncolSlider = makeSlider("Horizontal Anchors", minVal = 2, maxVal = 50, value = 30, step = 1, parent = controlWrapper, clearContent);
  xIncrementSlider = makeSlider("Horizontal Smoothness", minVal = .0001, maxVal = .3, value = .05, step = .0001, parent = controlWrapper, clearContent);
  yIncrementSlider = makeSlider("Vertical Smoothness", minVal = .0001, maxVal = .3, value = .05, step = .0001, parent = controlWrapper, clearContent);
  zIncrementSlider = makeSlider("Fluctuations in Forces", minVal = 0, maxVal = .3, value = .01, step = .0001, parent = controlWrapper, clearContent);
  particleSlider = makeSlider("Number of Particles", minVal = 10, maxVal = 10000, value = 500, step = 10, parent = controlWrapper, clearContent);
  opacitySlider = makeSlider("Line Opacity", minVal = 0, maxVal = 1, value = .1, step = .01, parent = controlWrapper);
  strokeColorPicker = makeColorPicker("Line Color", startColor = "rgb(216, 60, 95)", parent = controlWrapper);
  backgroundColorPicker = makeColorPicker("Background Color", startColor = "white", parent = controlWrapper, (d) => setBackgroundColor(d));

  // Buttons
  makeButton("Pause", controlWrapper, noLoop);
  makeButton("Resume", controlWrapper, loop);
  makeButton("Clear&nbsp;&nbsp;", controlWrapper, clearContent);
  makeButton("Download", controlWrapper, download);
  makeButton("About", controlWrapper, () => {}, "modal");
  makeButton("GitHub", controlWrapper, () => {
    window.open("https://github.com/mkfreeman/flowFields", "_blank");
  });
  return controlWrapper;
}

// Function to set background color
function setBackgroundColor() {
  // Avoids clearing the content
  canvas.style("background-color", backgroundColorPicker.value())
}
// Create particles
function createEmptyParticles() {
  particles = [];
  for (let i = 0; i < particleSlider.value(); i++) {
    particles[i] = new Particle(rectWidth, rectHeight);
  }
}

// Clear content
function clearContent() {
  clear();  
  createEmptyParticles();
  flowfield = [];  
  xoff = X_START = random(100);
  yoff = random(100);
  zoff = random(100);
}

// Download canvas
function download() {
  noLoop(); // pause
  let link = document.createElement('a');
  link.download = 'noise_field.png';
  link.href = document.querySelector('canvas').toDataURL()
  link.click();
}

// Set up (elements only drawn once)
function setup() {
  // Get window size 
  let windowWidth = window.innerWidth - 270;
  let windowHeight = window.innerHeight - 180;

  // Container for everything
  let container = createDiv().class("container");

  // Create controls and canvas
  let controls = makeControls();
  controls.parent(container);
  let canvasContainer = createDiv();
  canvas = createCanvas(windowWidth, windowHeight).class("p5_canvas");
  canvasContainer.parent(container);
  canvas.parent(canvasContainer);

  // Set color mode to RGB percentages  
  colorMode(RGB, 100);
  
  // Create set of particles
  getSize();
  createEmptyParticles();
}

function getSize() {
  // Construct a grid of rectangles (rows/columns)
  nrow = nrowSlider.value();
  ncol = ncolSlider.value();
  rectWidth = width / ncol;
  rectHeight = height / nrow;
}

function draw() {  
  getSize();  
  // Iterate through grid and set vector forces
  for (let row = 0; row < nrow; row++) {
    for (let col = 0; col < ncol; col++) {
      let angle = noise(xoff, yoff, zoff) * 4 * PI;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);      
      flowfield.push([v.x, v.y]);
      xoff += xIncrementSlider.value();
    }
    xoff = X_START;
    yoff += yIncrementSlider.value();
  }

  // Position particles given field of vector forces
  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  zoff += zIncrementSlider.value(); // think of this as time!
}