// Noise
const SIZE = 600;
const X_START = 0;
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

// Write a function to create a slider
function makeSlider(label, min = 0, max = 50, value = 10, step = 1, parent = createDiv(), update = () => {}) {
  let wrapper = createDiv(label);
  wrapper.parent(parent);
  let slider = createSlider(min, max, value, step);
  slider.input(update); // function to do on update
  slider.class("form-control-range")
  slider.parent(wrapper);
  return (slider);
}

function makeButton(text, parent, callback) {
  let buttonWrapper = createDiv();
  let button = createButton(text);
  button.class("btn btn-info")
  button.parent(buttonWrapper)
  buttonWrapper.parent(parent);
  button.mousePressed(callback);
}

function makeColorPicker(label = "Pick a color", startColor = "red", parent = createDiv(), update = () => {}) {
  let wrapper = createDiv(label);
  wrapper.parent(parent)
  let picker = createColorPicker(startColor)
  picker.input(() => update(picker.value()));
  picker.parent(wrapper);
  picker.class("form-control-range")
  return (picker);
}

function makeControls() {
  // Controls 
  controlWrapper = createDiv().style("float", "left");
  nrowSlider = makeSlider("Vertical Anchors", min = 2, max = 50, value = 30, step = 1, parent = controlWrapper, clearContent);
  ncolSlider = makeSlider("Horizontal Anchors", min = 2, max = 50, value = 30, step = 1, parent = controlWrapper, clearContent);
  xIncrementSlider = makeSlider("Horizontal Smoothness", min = .0001, max = .3, value = .05, step = .0001, parent = controlWrapper, clearContent);
  yIncrementSlider = makeSlider("Vertical Smoothness", min = .0001, max = .3, value = .05, step = .0001, parent = controlWrapper, clearContent);
  zIncrementSlider = makeSlider("Fluctuations in Forces", min = 0, max = .3, value = .01, step = .0001, parent = controlWrapper, clearContent);
  opacitySlider = makeSlider("Line Opacity", min = 0, max = 1, value = .1, step = .01, parent = controlWrapper);
  strokeColorPicker = makeColorPicker("Line Color", startColor = "red", parent = controlWrapper);
  backgroundColorPicker = makeColorPicker("Background Color", startColor = "white", parent = controlWrapper, (d) => background(d));
  
  // Make buttons
  makeButton("Clear", controlWrapper, clearContent);
  makeButton("Pause", controlWrapper, noLoop);
  makeButton("Resume", controlWrapper, loop);
  makeButton("Download", controlWrapper, download);
  return controlWrapper;
}

function createEmptyParticles() {
  for (let i = 0; i < 300; i++) {
    particles[i] = new Particle();
  }
}

function clearContent() {
  clear();
  createEmptyParticles();
  xoff = X_START = random();
  yoff = random();
  zoff = random();
}

function download(){
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
    .style("width", "100%")
    .class("container");

  // Make controls
  let controls = makeControls();
  let canvasContainer = createDiv();
  let canvas = createCanvas(SIZE, SIZE).class("p5_canvas");

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
  rectWidth = SIZE / ncol;
  rectHeight = SIZE / nrow;
  for (let row = 0; row < nrow; row++) {
    for (let col = 0; col < ncol; col++) {
      let angle = noise(xoff, yoff, zoff) * 4 * PI;
      var v = p5.Vector.fromAngle(angle);

      // Push the angle into the flow_field vector
      flowfield.push([v.x, v.y]);
      v.setMag(1);
      // Start a new drawing context with `push()`
      // push();
      // translate(col * rectWidth, row * rectHeight);    
      // rotate(v.heading());
      // strokeWeight(.5);
      // stroke("#d3d3d3")            
      // let length = Math.sqrt(rectWidth ** 2 + rectHeight ** 2)
      // line(0, 0, length, 0)
      // pop();  
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