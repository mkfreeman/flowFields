// Noise
// const SIZE = 600;
let X_START = 0;
const Y_START = 0;
let xoff = 0;
let yoff = 0;
let zoff = 0;
let
  container,
  controlWrapper,
  nrowSlider,
  ncolSlider,
  ncol,
  nrow,
  rectWidth,
  rectHeight;

let particles = [];
let flowfield = [];

function makeControls() {
  // Controls 
  controlWrapper = createDiv().id("control-wrapper");
  nrowSlider = makeSlider("Vertical Anchors", min = 2, max = 50, value = 30, step = 1, parent = controlWrapper, clearContent);
  ncolSlider = makeSlider("Horizontal Anchors", min = 2, max = 50, value = 30, step = 1, parent = controlWrapper, clearContent);
  xIncrementSlider = makeSlider("Horizontal Smoothness", min = .0001, max = .3, value = .05, step = .0001, parent = controlWrapper, clearContent);
  yIncrementSlider = makeSlider("Vertical Smoothness", min = .0001, max = .3, value = .05, step = .0001, parent = controlWrapper, clearContent);
  zIncrementSlider = makeSlider("Fluctuations in Forces", min = 0, max = .3, value = .01, step = .0001, parent = controlWrapper, clearContent);
  particleSlider = makeSlider("Number of Particles", min = 10, max = 10000, value = 500, step = 10, parent = controlWrapper, clearContent);
  opacitySlider = makeSlider("Line Opacity", min = 0, max = 1, value = .1, step = .01, parent = controlWrapper);
  strokeColorPicker = makeColorPicker("Line Color", startColor = "rgb(216, 60, 95)", parent = controlWrapper);
  backgroundColorPicker = makeColorPicker("Background Color", startColor = "white", parent = controlWrapper, (d) => background(d));
  
  // Make buttons
  makeButton("Pause", controlWrapper, noLoop);
  makeButton("Resume", controlWrapper, loop);
  makeButton("Clear&nbsp;&nbsp;", controlWrapper, clearContent);
  makeButton("Download", controlWrapper, download);
  return controlWrapper;
}

function createEmptyParticles() {
  particles = [];
  for (let i = 0; i < particleSlider.value(); i++) {
    particles[i] = new Particle();
  }
}

function clearContent() {
  clear();
  createEmptyParticles();
  flowfield = [];
  background(backgroundColorPicker.value());
  xoff = X_START = random(100);
  yoff = random(100);
  zoff = random(100);
}

function download(){
  noLoop();
  var link = document.createElement('a');
  link.download = 'noise_field.png';
  link.href = document.querySelector('canvas').toDataURL()
  link.click();
}

// Elements only drawn once
function setup() {
  // Container for everything
  container = createDiv()
    .style("display", "inline-block")    
    .class("container");

  // Make controls
  let controls = makeControls();
  let canvasContainer = createDiv();
  let windowWidth = window.innerWidth - 300;
  let windowHeight = window.innerHeight - 200;
  let canvas = createCanvas(windowWidth, windowHeight).class("p5_canvas");

  controls.parent(container);
  canvasContainer.parent(container);
  canvas.parent(canvasContainer);

  // Set color mode to RGB percentages  
  colorMode(RGB, 100);

  background("white");
  // Create set of particles
  createEmptyParticles();
}

function draw() {  
  // Construct a grid of rectangles (rows/columns)
  nrow = nrowSlider.value();
  ncol = ncolSlider.value();
  rectWidth = width / ncol;
  rectHeight = height / nrow;
  for (let row = 0; row < nrow; row++) {
    for (let col = 0; col < ncol; col++) {
      let angle = noise(xoff, yoff, zoff) * 4 * PI;
      var v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      // Push the angle into the flow_field vector
      flowfield.push([v.x, v.y]);
      xoff += xIncrementSlider.value();
    }
    xoff = X_START;
    yoff += yIncrementSlider.value();
  }

  // Position particles given (updated) flow field
  for (var i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
  // xoff = X_START;
  // yoff = Y_START;
  zoff += zIncrementSlider.value(); // think of this as time!
  // noLoop();
}