/**
 * Created by kevin on 2014-11-13.
 */
/// <reference path="processing.d.ts"/>
/// <reference path="lodash.d.ts"/>
var geom;
(function (geom) {
    function dot4(a, b) {
        return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
    }
    var Matrix4 = (function () {
        function Matrix4() {
            this.values = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ];
        }
        Matrix4.prototype.mul = function (other) {
            var result = new Matrix4();
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 4; j++) {
                    result.values[i * 4 + j] = dot4(this.row(i), other.col(j));
                }
            }
            return result;
        };
        Matrix4.prototype.mulVec = function (p) {
            var x = dot4(this.row(0), p.values);
            var y = dot4(this.row(1), p.values);
            var z = dot4(this.row(2), p.values);
            return new Vector3(x, y, z);
        };
        Matrix4.prototype.col = function (n) {
            var a = this.values;
            return [a[n], a[n + 4], a[n + 8], a[n + 12]];
        };
        Matrix4.prototype.row = function (m) {
            var a = this.values;
            var i = 4 * m;
            return [a[i], a[i + 1], a[i + 2], a[i + 3]];
        };
        Matrix4.identity = function () {
            var result = new Matrix4();
            result.values = [
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                1
            ];
            return result;
        };
        Matrix4.rotation = function (axis, angle) {
            var u_x = axis.x;
            var u_y = axis.y;
            var u_z = axis.z;
            var cos_a = Math.cos(angle);
            var sin_a = Math.sin(angle);
            var result = new Matrix4();
            result.values = [
                cos_a + u_x * u_x * (1 - cos_a),
                u_x * u_y * (1 - cos_a) - u_z * sin_a,
                u_x * u_z * (1 - cos_a) + u_y * sin_a,
                0,
                u_y * u_x * (1 - cos_a) + u_z * sin_a,
                cos_a + u_y * u_y * (1 - cos_a),
                u_y * u_z * (1 - cos_a) - u_x * sin_a,
                0,
                u_z * u_x * (1 - cos_a) - u_y * sin_a,
                u_z * u_y * (1 - cos_a) + u_x * sin_a,
                cos_a + u_z * u_z * (1 - cos_a),
                0,
                0,
                0,
                0,
                1
            ];
            return result;
        };
        return Matrix4;
    })();
    geom.Matrix4 = Matrix4;
    var gen;
    (function (gen) {
        var i = 0;
        function next() {
            return i++;
        }
        gen.next = next;
    })(gen || (gen = {}));
    geom.processing;
    geom.viewMatrix = Matrix4.identity();
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.values = [x, y, z, 1];
            this.faces = [];
        }
        Object.defineProperty(Vector3.prototype, "x", {
            get: function () {
                return this.values[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
            get: function () {
                return this.values[1];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
            get: function () {
                return this.values[2];
            },
            enumerable: true,
            configurable: true
        });
        Vector3.prototype.add = function (p) {
            return new Vector3(this.x + p.x, this.y + p.y, this.z + p.z);
        };
        Vector3.prototype.sub = function (p) {
            return new Vector3(this.x - p.x, this.y - p.y, this.z - p.z);
        };
        Vector3.prototype.mul = function (k) {
            return new Vector3(k * this.x, k * this.y, k * this.z);
        };
        Vector3.prototype.div = function (k) {
            return new Vector3(this.x / k, this.y / k, this.z / k);
        };
        Vector3.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.dist = function (p) {
            return this.sub(p).length();
        };
        Vector3.prototype.normalize = function () {
            return this.div(this.length());
        };
        Vector3.prototype.dot = function (p) {
            return this.x * p.x + this.y * p.y + this.z * p.z;
        };
        Vector3.prototype.cross = function (p) {
            return new Vector3(this.y * p.z - this.z * p.y, this.z * p.x - this.x * p.z, this.x * p.y - this.y * p.x);
        };
        Vector3.prototype.set = function (p) {
            this.values[0] = p.values[0];
            this.values[1] = p.values[1];
            this.values[2] = p.values[2];
        };
        Vector3.prototype.toString = function () {
            return "(" + this.x + ", " + this.y + ", " + this.z + ")";
        };
        Vector3.prototype.draw = function () {
            var p = geom.viewMatrix.mulVec(this);
            if (this.faces.length > 0) {
                if (this.faces.some(function (face) { return face.normal().z > 0; })) {
                    geom.processing.noStroke();
                    geom.processing.fill(0, 0, 0);
                    geom.processing.ellipse(p.x, p.y, 8, 8);
                }
            }
            else {
                geom.processing.noStroke();
                geom.processing.fill(0, 0, 0);
                geom.processing.ellipse(p.x, p.y, 8, 8);
            }
        };
        Vector3.prototype.drawLabel = function (label) {
            var p = geom.viewMatrix.mulVec(this);
            if (this.faces.length > 0) {
                if (this.faces.some(function (face) { return face.normal().z > 0; })) {
                    geom.processing.pushMatrix();
                    geom.processing.scale(1, -1);
                    geom.processing.fill(0, 0, 0);
                    geom.processing.text(label, p.x + 10, -p.y);
                    geom.processing.popMatrix();
                }
            }
            else {
                geom.processing.pushMatrix();
                geom.processing.scale(1, -1);
                geom.processing.fill(0, 0, 0);
                geom.processing.text(label, p.x + 10, -p.y);
                geom.processing.popMatrix();
            }
        };
        return Vector3;
    })();
    geom.Vector3 = Vector3;
    var Edge = (function () {
        function Edge(vertices, indices) {
            this.vertices = vertices;
            this.indices = indices;
        }
        Edge.prototype.draw = function () {
            if (this.faces.length === 2) {
                var n1 = this.faces[0].normal();
                var n2 = this.faces[1].normal();
            }
            if (n1.z > 0 || n2.z > 0) {
                var p1 = geom.viewMatrix.mulVec(this.vertices[this.indices[0]]);
                var p2 = geom.viewMatrix.mulVec(this.vertices[this.indices[1]]);
                geom.processing.stroke(0, 0, 0);
                geom.processing.line(p1.x, p1.y, p2.x, p2.y);
            }
        };
        return Edge;
    })();
    geom.Edge = Edge;
    function randomColor() {
        var r = geom.processing.random(255);
        var g = geom.processing.random(255);
        var b = geom.processing.random(255);
        return geom.processing.color(r, g, b);
    }
    var Face = (function () {
        function Face(vertices, indices) {
            this.vertices = vertices;
            this.indices = indices;
            this.color = randomColor();
        }
        Face.prototype.normal = function () {
            if (this.indices.length < 3) {
                return;
            }
            var p1 = geom.viewMatrix.mulVec(this.vertices[this.indices[0]]);
            var p2 = geom.viewMatrix.mulVec(this.vertices[this.indices[1]]);
            var p3 = geom.viewMatrix.mulVec(this.vertices[this.indices[2]]);
            var v1 = p2.sub(p1);
            var v2 = p3.sub(p2);
            return v1.cross(v2).normalize();
        };
        Face.prototype.centroid = function () {
            var _this = this;
            var sum = this.indices.reduce(function (accum, index) { return accum.add(_this.vertices[index]); }, new Vector3());
            return sum.div(this.indices.length);
        };
        Face.prototype.draw = function () {
            var _this = this;
            geom.processing.fill(this.color);
            if (this.normal().z > 0) {
                geom.processing.noStroke();
                geom.processing.beginShape();
                this.indices.forEach(function (index) {
                    var vertex = geom.viewMatrix.mulVec(_this.vertices[index]);
                    geom.processing.vertex(vertex.x, vertex.y, 0.0);
                });
                geom.processing.endShape();
            }
        };
        Face.prototype.drawNormal = function () {
            var normal = this.normal();
            var center = geom.viewMatrix.mulVec(this.centroid());
            normal.normalize();
            var tol = 0.005;
            if (normal.z > tol) {
                geom.processing.stroke(0, 0, 255);
            }
            else if (normal.z <= tol && normal.z > -tol) {
                geom.processing.stroke(0, 255, 0);
            }
            else {
                geom.processing.stroke(255, 0, 0);
                return; // TODO: add semi-transparent visualization
            }
            var length = 50;
            var start = new Vector3(center.x, center.y);
            var end = new Vector3(start.x + length * normal.x, start.y + length * normal.y);
            geom.processing.line(start.x, start.y, end.x, end.y);
        };
        return Face;
    })();
    geom.Face = Face;
    var Mesh = (function () {
        function Mesh() {
            this.vertices = [];
            this.faces = [];
            this.edges = [];
            this.showVertices = true;
            this.showEdges = true;
            this.showFaces = true;
            this.showLabels = false;
            this.showNormals = false;
        }
        Mesh.prototype.addVertex = function (x, y, z) {
            this.vertices.push(new Vector3(x, y, z));
        };
        Mesh.prototype.addEdge = function (index1, index2) {
            this.edges.push(new Edge(this.vertices, [index1, index2]));
        };
        Mesh.prototype.addFace = function () {
            var _this = this;
            var indices = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                indices[_i - 0] = arguments[_i];
            }
            var face = new Face(this.vertices, indices);
            indices.forEach(function (index) { return _this.vertices[index].faces.push(face); });
            this.faces.push(face);
        };
        Mesh.prototype.generateEdges = function () {
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
        };
        Mesh.prototype.centroid = function () {
            var sum = this.vertices.reduce(function (accum, value) { return accum.add(value); }, new Vector3());
            return sum.div(this.vertices.length);
        };
        Mesh.prototype.center = function () {
            var centroid = this.centroid();
            this.vertices.forEach(function (p) {
                p.set(p.sub(centroid));
            });
            return this;
        };
        Mesh.prototype.scale = function (k) {
            this.vertices.forEach(function (p) {
                p.set(p.mul(k));
            });
            return this;
        };
        Mesh.prototype.draw = function () {
            if (this.showFaces) {
                this.faces.forEach(function (face) { return face.draw(); });
            }
            if (this.showEdges) {
                this.edges.forEach(function (edge) { return edge.draw(); });
            }
            if (this.showVertices) {
                this.vertices.forEach(function (vertex) { return vertex.draw(); });
            }
            if (this.showLabels) {
                geom.processing.textSize(18);
                geom.processing.textAlign(geom.processing.LEFT, geom.processing.CENTER);
                this.vertices.forEach(function (vertex, index) { return vertex.drawLabel("" + index); });
            }
            if (this.showNormals) {
                this.faces.forEach(function (face) { return face.drawNormal(); });
            }
        };
        return Mesh;
    })();
    geom.Mesh = Mesh;
})(geom || (geom = {}));
