/*global define */

define(function (require, exports, module) {

    var Face = require("face");
    var Edge = require("edge");
    var util = require("util");

    var Cube = function (size) {
        size = size / 1.25;

        this.points = [
            new PVector(0, 0, 0),
            new PVector(1, 0, 0),
            new PVector(1, 1, 0),
            new PVector(0, 1, 0),
            new PVector(0, 0, 1),
            new PVector(1, 0, 1),
            new PVector(1, 1, 1),
            new PVector(0, 1, 1)
        ];

        this.points.forEach(function (point) {
            point.x -= 0.5;
            point.y -= 0.5;
            point.z -= 0.5;

            point.x *= size;
            point.y *= size;
            point.z *= size;
        });

        var randomColor = function () {
            var r = 255 * Math.random() | 0;
            var g = 255 * Math.random() | 0;
            var b = 255 * Math.random() | 0;

            return 'rgb(' + [r,g,b].join(',') + ')';
        };

        this.faces = [
            new Face(this.points, [0, 3, 2, 1], randomColor()),
            new Face(this.points, [4, 5, 6, 7], randomColor()),
            new Face(this.points, [0, 4, 7, 3], randomColor()),
            new Face(this.points, [1, 2, 6, 5], randomColor()),
            new Face(this.points, [3, 7, 6, 2], randomColor()),
            new Face(this.points, [0, 1, 5, 4], randomColor())
        ];

        this.edges = [
            new Edge(this.points[0], this.points[1], this.faces[0], this.faces[5]),
            new Edge(this.points[1], this.points[2], this.faces[0], this.faces[3]),
            new Edge(this.points[2], this.points[3], this.faces[0], this.faces[4]),
            new Edge(this.points[3], this.points[0], this.faces[0], this.faces[2]),

            new Edge(this.points[4], this.points[5], this.faces[1], this.faces[5]),
            new Edge(this.points[5], this.points[6], this.faces[1], this.faces[3]),
            new Edge(this.points[6], this.points[7], this.faces[1], this.faces[4]),
            new Edge(this.points[7], this.points[4], this.faces[1], this.faces[2]),

            new Edge(this.points[0], this.points[4], this.faces[2], this.faces[5]),
            new Edge(this.points[1], this.points[5], this.faces[3], this.faces[5]),
            new Edge(this.points[2], this.points[6], this.faces[3], this.faces[4]),
            new Edge(this.points[3], this.points[7], this.faces[2], this.faces[4])
        ];
    };

    Cube.prototype.frontFaces = function (viewMatrix) {
        return this.faces.filter(function (face) {
            var normal = face.calculateNormal(viewMatrix);
            return normal.z > 0;
        });
    };

    Cube.prototype.backFaces = function (viewMatrix) {
        return this.faces.filter(function (face) {
            var normal = face.calculateNormal(viewMatrix);
            return normal.z <= 0;
        });
    };

    module.exports = Cube;
});
