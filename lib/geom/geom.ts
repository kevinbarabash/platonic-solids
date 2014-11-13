/**
 * Created by kevin on 2014-11-13.
 */

/// <reference path="processing.d.ts"/>

//declare var processing: Processing;

module geom {

    function dot4(a: number[], b: number[]) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }

    export class Matrix4 {
        values: number[];

        constructor() {
            this.values = [
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0
            ];
        }

        multiply(other: Matrix4) {
            var result = new Matrix4();
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    result[i * 4 + j] = dot4(this.row(i), other.col(j));
                }
            }

            return result;
        }

        applyTransform(p: Vector3) {
            var x = dot4(this.row(0), p.values);
            var y = dot4(this.row(1), p.values);
            var z = dot4(this.row(2), p.values);
            return new Vector3(x, y, z);
        }

        col(n): number[] {
            var a = this.values;
            return [a[n], a[n+4], a[n+8], a[n+12]];
        }

        row(m): number[] {
            var a = this.values;
            var i = 4 * m;
            return [a[i], a[i+1], a[i+2], a[i+3]];
        }

        static identity() {
            var result = new Matrix4();
            result.values = [
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ];
            return result;
        }
    }

    module gen {
        var i = 0;
        export function next() {
            return i++;
        }
    }

    export var processing: Processing;

    export var viewMatrix = Matrix4.identity();

    export class Vector3 {
        values: number[];

        constructor(x = 0, y = 0, z = 0) {
            this.values = [x, y, z, 1];
        }

        get x() { return this.values[0]; }
        get y() { return this.values[1]; }
        get z() { return this.values[2]; }

        add(p: Vector3) {
            return new Vector3(this.x + p.x, this.y + p.y, this.z + p.z);
        }

        sub(p: Vector3) {
            return new Vector3(this.x - p.x, this.y - p.y, this.z - p.z);
        }

        mul(k: number) {
            return new Vector3(k * this.x, k * this.y, k * this.z);
        }

        div(k: number) {
            return new Vector3(this.x / k, this.y / k, this.z / k);
        }

        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        dist(p: Vector3) {
            return this.sub(p).length();
        }

        normalize() {
            return this.div(this.length());
        }

        dot(p: Vector3) {
            return this.x * p.x + this.y * p.y + this.z * p.z;
        }

        cross(p: Vector3) {
            return new Vector3(this.y * p.z - this.z * p.y,
                               this.z * p.x - this.x * p.z,
                               this.x * p.y - this.y * p.x);
        }

        toString() {
            return "(" + this.x + ", " + this.y + ", " + this.z + ")";
        }

        draw() {
            // TODO: apply viewMatrix before drawing
            processing.noStroke();
            processing.fill(0,0,0);
            processing.ellipse(this.x, this.y, 8, 8);
        }

        static sum(points: Vector3[]) {
            return points.reduce((accum, value) => accum.add(value), new Vector3());
        }

        static average(points: Vector3[]) {
            return Vector3.sum(points).div(points.length);
        }
    }


    export class Edge {
        p1: Vector3;
        p2: Vector3;

        constructor(p1: Vector3, p2: Vector3) {
            this.p1 = p1;
            this.p2 = p2;
        }

        length() {
            return this.p1.dist(this.p2);
        }

        draw() {
            // TODO: apply viewMatrix before drawing
            processing.stroke(0,0,0);
            processing.line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
        }
    }

    export class Face {
        color: number;
        points: Vector3[];

        constructor(...points: Vector3[]) {
            this.points = points;
            this.color = processing.color(255,255,255);
        }

        addPoint(Vector3: Vector3) {
            this.points.push(Vector3);
        }

        isPlanar() {
            // TODO: implement me
        }

        normal() {
            if (this.points.length < 3) {
                return;
            }
            var v1 = this.points[1].sub(this.points[0]);
            var v2 = this.points[2].sub(this.points[1]);
            return v1.cross(v2).normalize();
        }

        draw() {
            processing.fill(this.color);
            // TODO: check normal after applying the transform
            if (this.normal().z > 0) {
                processing.noStroke();
                processing.beginShape();
                this.points
                    .map(p => viewMatrix.applyTransform(p))
                    .forEach(p => processing.vertex(p.x, p.y, 0.0));
                processing.endShape();
            }
        }

        edges(): Edge[] {
            var result = [];
            for (var i = 0, len = this.points.length; i < len; i++) {
                var p = this.points[i];
                var q = this.points[(i + 1) % len];
                result.push(new Edge(p, q));
            }
            return result;
        }
    }

    export class Mesh {
        points: { [id: number]: Vector3; };
        edges: { [id: number]: Edge; };
        faces: { [id: number]: Face; };

        constructor() {
            this.points = {};
            this.faces = {};
            this.edges = {};
        }

    }
}