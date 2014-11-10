/*global define */

define(function (require, exports, module) {

    var Face = require("face");
    var Edge = require("edge");

    var Icosahedron = function (size) {
        this.points = [


            new PVector(0, 0, 0),
            new PVector(1, 0, 0),
            new PVector(1, 1, 0),
            new PVector(0, 1, 0),
            new PVector(0.5, 0.5, Math.sqrt(2)/2),
            new PVector(0.5, 0.5, -Math.sqrt(2)/2)
        ];

        this.points.forEach(function (point) {
            point.x -= 0.5;
            point.y -= 0.5;

            point.x *= size;
            point.y *= size;
            point.z *= size;
        });

        this.faces = [
            new Face(this.points, [0, 1, 4], 'rgb(255,0,0)'),
            new Face(this.points, [1, 2, 4], 'rgb(0,255,0)'),
            new Face(this.points, [2, 3, 4], 'rgb(0,0,255)'),
            new Face(this.points, [3, 0, 4], 'rgb(255,255,0)'),

            new Face(this.points, [1, 0, 5], 'rgb(128,0,255)'),
            new Face(this.points, [2, 1, 5], 'rgb(255,128,0)'),
            new Face(this.points, [3, 2, 5], 'rgb(0,255,255)'),
            new Face(this.points, [0, 3, 5], 'rgb(255,0,255)')
        ];

        this.edges = [
            new Edge(this.points[0], this.points[1], this.faces[0], this.faces[4]),
            new Edge(this.points[1], this.points[2], this.faces[1], this.faces[5]),
            new Edge(this.points[2], this.points[3], this.faces[2], this.faces[6]),
            new Edge(this.points[3], this.points[0], this.faces[3], this.faces[7]),

            new Edge(this.points[0], this.points[4], this.faces[3], this.faces[0]),
            new Edge(this.points[1], this.points[4], this.faces[0], this.faces[1]),
            new Edge(this.points[2], this.points[4], this.faces[1], this.faces[2]),
            new Edge(this.points[3], this.points[4], this.faces[2], this.faces[3]),

            new Edge(this.points[0], this.points[5], this.faces[7], this.faces[4]),
            new Edge(this.points[1], this.points[5], this.faces[4], this.faces[5]),
            new Edge(this.points[2], this.points[5], this.faces[5], this.faces[6]),
            new Edge(this.points[3], this.points[5], this.faces[6], this.faces[7])
        ];
    };

    Icosahedron.prototype.frontFaces = function (viewMatrix) {
        return this.faces.filter(function (face) {
            var normal = face.calculateNormal(viewMatrix);
            return normal.z > 0;
        });
    };

    Icosahedron.prototype.backFaces = function (viewMatrix) {
        return this.faces.filter(function (face) {
            var normal = face.calculateNormal(viewMatrix);
            return normal.z <= 0;
        });
    };

    module.exports = Icosahedron;
});
