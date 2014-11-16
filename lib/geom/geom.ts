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
                    result.values[i * 4 + j] = dot4(this.row(i), other.col(j));
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

        static rotation(axis, angle) {
            var u_x = axis.x;
            var u_y = axis.y;
            var u_z = axis.z;
            var cos_a = Math.cos(angle);
            var sin_a = Math.sin(angle);

            var result = new Matrix4();
            result.values = [
                cos_a + u_x * u_x * (1 - cos_a),        u_x * u_y * (1 - cos_a) - u_z * sin_a,  u_x * u_z * (1 - cos_a) + u_y * sin_a,  0,
                u_y * u_x * (1 - cos_a) + u_z * sin_a,  cos_a + u_y * u_y * (1 - cos_a),        u_y * u_z * (1 - cos_a) - u_x * sin_a,  0,
                u_z * u_x * (1 - cos_a) - u_y * sin_a,  u_z * u_y * (1 - cos_a) + u_x * sin_a,  cos_a + u_z * u_z * (1 - cos_a),        0,
                0,                                      0,                                      0,                                      1
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
        faces: Face[];

        constructor(x = 0, y = 0, z = 0) {
            this.values = [x, y, z, 1];
            this.faces = [];
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
            var p = viewMatrix.applyTransform(this);
            if (this.faces.length > 0) {
                if (this.faces.some(face => face.normal().z > 0)) {
                    processing.noStroke();
                    processing.fill(0,0,0);
                    processing.ellipse(p.x, p.y, 8, 8);
                }
            } else {
                processing.noStroke();
                processing.fill(0,0,0);
                processing.ellipse(p.x, p.y, 8, 8);
            }
        }
    }


    export class Edge {
        vertices: Vector3[];
        indices: number[];
        faces: Face[];

        constructor(vertices: Vector3[], indices: number[]) {
            this.vertices = vertices;
            this.indices = indices;
        }

        draw() {
            if (this.faces.length === 2) {
                var n1 = this.faces[0].normal();
                var n2 = this.faces[1].normal();
            }
            if (n1.z > 0 || n2.z > 0) {
                var p1 = viewMatrix.applyTransform(this.vertices[this.indices[0]]);
                var p2 = viewMatrix.applyTransform(this.vertices[this.indices[1]]);

                processing.stroke(0,0,0);
                processing.line(p1.x, p1.y, p2.x, p2.y);
            }
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
            var face = new Face(this.vertices, indices);
            indices.forEach(index => this.vertices[index].faces.push(face));
            this.faces.push(face);
        }

        generateEdges() {
            var len = this.faces.length;
            for (var i = 0; i < len; i++) {
                for (var j = i + 1; j < len; j++) {
                    var sharedIndices = _.intersection(this.faces[i].indices, this.faces[j].indices);
                    if (sharedIndices.length === 2) {
                        var edge = new Edge(this.vertices, sharedIndices);
                        edge.faces = [this.faces[i], this.faces[j]];
                        this.edges.push(edge);
                    }
                }
            }
        }

        centroid() {
            var sum = this.vertices.reduce((accum, value) => accum.add(value), new Vector3());
            return sum.div(this.vertices.length);
        }

        center() {
            var centroid = this.centroid();
            this.vertices.forEach(function (p) {
                p.set(p.sub(centroid));
            });
            return this;
        }

        scale(k: number) {
            this.vertices.forEach(function (p) {
                p.set(p.mul(k));
            });
            return this;
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