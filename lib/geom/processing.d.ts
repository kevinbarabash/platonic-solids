/**
 * Created by kevin on 2014-11-13.
 */

declare class Processing {

    size(width: number, height: number);
    background(value: number);
    translate(dx: number, dy: number);
    random(max: number);

    // setting stroke/fill
    fill(col: number);
    fill(r: number, g: number, b: number, a?: number);
    noFill();
    stroke(col: number);
    stroke(r: number, g: number, b: number, a?: number);
    noStroke();
    strokeWeight(value: number);
    color(r: number, g: number, b: number, a?: number): number;

    // basic shapes
    point(x: number, y: number);
    line(x1: number, y1: number, x2: number, y2: number);
    ellipse(x: number, y: number, width: number, height: number);
    rect(x: number, y: number, width: number, height: number);

    // custom shapes
    beginShape();
    vertex(x: number, y: number, z?: number);
    endShape();
}
