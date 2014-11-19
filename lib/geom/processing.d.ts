/**
 * Created by kevin on 2014-11-13.
 */

/// <reference path="geom.ts"/>


declare class Processing {

    constructor(canvas: HTMLCanvasElement);

    // setup
    size(width: number, height: number);
    background(value: number);

    // misc
    random(max: number);

    // transforms
    translate(dx: number, dy: number);
    scale(sx: number, sy: number);
    pushMatrix();
    popMatrix();

    // setting stroke/fill
    fill(col: number);
    fill(r: number, g: number, b: number, a?: number);
    noFill();
    stroke(col: number);
    stroke(r: number, g: number, b: number, a?: number);
    noStroke();
    strokeWeight(value: number);
    color(r: number, g: number, b: number, a?: number): number;

    colorMode(mode: number);
    RGB: number;
    ARGB: number;
    HSB: number;
    ALPHA: number;
    CMYK: number;

    // drawing primitives
    point(x: number, y: number);
    line(x1: number, y1: number, x2: number, y2: number);
    ellipse(x: number, y: number, width: number, height: number);
    rect(x: number, y: number, width: number, height: number);
    text(text: string, x: number, y: number);

    // font properties
    textSize(size: number);
    textAlign(xalign: number, yalign: number);
    LEFT: number;
    CENTER: number;
    RIGHT: number;
    TOP: number;
    BOTTOM: number;
    BASELINE: number;

    // custom shapes
    beginShape();
    vertex(x: number, y: number, z?: number);
    endShape();

    // callbacks
    draw();
    mouseDragged();
    mouseClicked();
    mousePressed();
    mouseReleased();
    keyPressed();
    keyReleased();

    // variables
    mouseX: number;
    mouseY: number;
    pmouseX: number;
    pmouseY: number;
    key: string;

    // additions
    rotateMesh(mesh: geom.Mesh);
}
