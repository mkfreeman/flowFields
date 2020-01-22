
// Write a function to create a slider
function makeSlider(label, minVal = 0, maxVal = 50, value = 10, step = 1, parent = createDiv(), update = () => {}) {
    let wrapper = createDiv(label);
    wrapper.parent(parent);
    wrapper.class("slider");
    let slider = createSlider(minVal, maxVal, value, step);
    slider.input(update); // function to do on update
    slider.class("form-control-range")
    slider.parent(wrapper);
    return (slider);
  }
  
  // Function to make a button
  function makeButton(text, parent, callback, type = "not_modal") {
    let buttonWrapper = createDiv();
    buttonWrapper.class("button-wrapper");
    let button = createButton(text);
    button.class("btn")
    if(type === "modal") {
        button.attribute("data-toggle", "modal")
        button.attribute("data-target", "#exampleModal")
    }
    button.parent(buttonWrapper)
    buttonWrapper.parent(parent);
    button.mousePressed(callback);
  }
  
  // Function to make a color picker
  function makeColorPicker(label = "Pick a color", startColor = "red", parent = createDiv(), update = () => {}) {
    let wrapper = createDiv(label);
    wrapper.class("color-picker");
    wrapper.parent(parent)
    let picker = createColorPicker(startColor)
    picker.input(() => update(picker.value()));
    picker.parent(wrapper);
    picker.class("form-control-range")
    return (picker);
  }