/**
 * Created by kevin on 2014-11-13.
 */

/// <reference path="processing.d.ts"/>
/// <reference path="lodash.d.ts"/>

module geom {

    function dot4(a: number[], b: number[]) {
        return a[0] * b[0]
             + a[1] * b[1]
             + a[2] * b[2]
             + a[3] * b[3];
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

        set(p: Vector3) {
            this.values[0] = p.values[0];
            this.values[1] = p.values[1];
            this.values[2] = p.values[2];
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
        vertices: Vector3[];
        indices: number[];

        constructor(vertices: Vector3[], indices: number[]) {
            this.vertices = vertices;
            this.indices = indices;
        }

        draw() {
            var p1 = viewMatrix.applyTransform(this.vertices[this.indices[0]]);
            var p2 = viewMatrix.applyTransform(this.vertices[this.indices[1]]);

            processing.stroke(0,0,0);
            processing.line(p1.x, p1.y, p2.x, p2.y);
        }
    }

    function randomColor() {
        var r = processing.random(255);
        var g = processing.random(255);
        var b = processing.random(255);
        return processing.color(r,g,b);
    }

    export class Face {
        vertices: Vector3[];
        indices: number[];
        color: number;

        constructor(vertices: Vector3[], indices: number[]) {
            this.vertices = vertices;
            this.indices = indices;
            this.color = randomColor();
        }

        normal() {
            if (this.indices.length < 3) {
                return;
            }

            var p1 = viewMatrix.applyTransform(this.vertices[this.indices[0]]);
            var p2 = viewMatrix.applyTransform(this.vertices[this.indices[1]]);
            var p3 = viewMatrix.applyTransform(this.vertices[this.indices[2]]);

            var v1 = p2.sub(p1);
            var v2 = p3.sub(p2);

            return v1.cross(v2).normalize();
        }

        draw() {
            processing.fill(this.color);

            if (this.normal().z > 0) {
                processing.noStroke();
                processing.beginShape();
                this.indices.forEach(index => {
                    var vertex = viewMatrix.applyTransform(this.vertices[index]);
                    processing.vertex(vertex.x, vertex.y, 0.0);
                });
                processing.endShape();
            }
        }
    }

    export class Mesh {
        vertices: Vector3[];
        edges: Edge[];
        faces: Face[];
//        vertices: { [id: number]: Vector3; };
//        edges: { [id: number]: Edge; };
//        faces: { [id: number]: Face; };

        constructor() {
            this.vertices = [];
            this.faces = [];
            this.edges = [];
        }

        addVertex(x: number, y: number, z: number)  {
            this.vertices.push(new Vector3(x, y, z));
        }

        addEdge(index1: number, index2: number) {
            this.edges.push(new Edge(this.vertices, [index1, index2]));
        }

        addFace(...indices: number[]) {
            this.faces.push(new Face(this.vertices, indices));
        }

        generateEdges() {
            var len = this.faces.length;
            for (var i = 0; i < len; i++) {
                for (var j = i + 1; j < len; j++) {
                    var sharedIndices = _.intersection(this.faces[i].indices, this.faces[j].indices);
                    if (sharedIndices.length === 2) {
                        this.addEdge(sharedIndices[0], sharedIndices[1]);
                    }
                }
            }
        }

        draw() {
            // draw faces
            this.faces.forEach(face => face.draw());

            // draw edges
            this.edges.forEach(edge => edge.draw());

            // draw vertices
            this.vertices.forEach(vertex => vertex.draw());
        }
    }
}