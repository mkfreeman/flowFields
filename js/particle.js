// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

function Particle() {
    this.pos = createVector(random(SIZE), random(SIZE));
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxspeed = 2;
    this.h = 0;

    this.prevPos = this.pos.copy();

    this.update = function () {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    };

    this.follow = function (vectors) {
        var x = floor(this.pos.x / rectWidth);
        var y = floor(this.pos.y / rectHeight);
        var index = x + y * ncol;        
        var force = vectors[index];        
        this.applyForce(force);
    };

    this.applyForce = function (force) {
        this.acc.add(force);
    };

    this.getColor = function() {
        let color = strokeColorPicker.color()._array.slice(0, 3)
            .concat(opacitySlider.value())
            .map((d) => d * 100);
        return(color);
    }
    this.show = function () {        
        // stroke(this.h, 0, 0, 25);        
        stroke(this.getColor());
        
        strokeWeight(.3);
        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.updatePrev();
    };

    this.updatePrev = function () {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    };

    this.edges = function () {
        if (this.pos.x > SIZE | this.pos.x < 0 | this.pos.y > SIZE | this.pos.y < 0) {
            this.pos = createVector(random(SIZE), random(SIZE));
            this.updatePrev();
        }
    };
}