/*global define */

define(function (require, exports, module) {

    var Face = require("face");
    var Edge = require("edge");

    var Icosahedron = function (size) {
        size = size / 3;
        var t = ( 1 + Math.sqrt( 5 ) ) / 2;

        this.points = [
            new PVector(- 1,  t,  0),
            new PVector(1,  t,  0),
            new PVector(- 1, - t,  0),
            new PVector(1, - t,  0),
            new PVector(0, - 1,  t),
            new PVector(0,  1,  t),
            new PVector(0, - 1, - t),
            new PVector(0,  1, - t),
            new PVector(t,  0, - 1),
            new PVector(t,  0,  1),
            new PVector(- t,  0, - 1),
            new PVector(- t,  0,  1)
        ];

        this.points.forEach(function (point) {
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
            new Face(this.points, [0, 11,  5], randomColor()),
            new Face(this.points, [0,  5,  1], randomColor()),
            new Face(this.points, [0,  1,  7], randomColor()),
            new Face(this.points, [0,  7, 10], randomColor()),
            new Face(this.points, [0, 10, 11], randomColor()),

            new Face(this.points, [1,  5,  9], randomColor()),
            new Face(this.points, [5, 11,  4], randomColor()),
            new Face(this.points, [11, 10,  2], randomColor()),
            new Face(this.points, [10,  7,  6], randomColor()),
            new Face(this.points, [7,  1,  8], randomColor()),

            new Face(this.points, [3,  9,  4], randomColor()),
            new Face(this.points, [3,  4,  2], randomColor()),
            new Face(this.points, [3,  2,  6], randomColor()),
            new Face(this.points, [3,  6,  8], randomColor()),
            new Face(this.points, [3,  8,  9], randomColor()),

            new Face(this.points, [4,  9,  5], randomColor()),
            new Face(this.points, [2,  4, 11], randomColor()),
            new Face(this.points, [6,  2, 10], randomColor()),
            new Face(this.points, [8,  6,  7], randomColor()),
            new Face(this.points, [9,  8,  1], randomColor())
        ];

        this.edges = [
            new Edge(this.points[0], this.points[1], this.faces[1], this.faces[2]),
            new Edge(this.points[0], this.points[5], this.faces[0], this.faces[1]),
            new Edge(this.points[0], this.points[7], this.faces[2], this.faces[3]),
            new Edge(this.points[0], this.points[10], this.faces[3], this.faces[4]),
            new Edge(this.points[0], this.points[11], this.faces[0], this.faces[4]),

            new Edge(this.points[1], this.points[5], this.faces[1], this.faces[5]),
            new Edge(this.points[1], this.points[7], this.faces[2], this.faces[9]),
            new Edge(this.points[1], this.points[8], this.faces[9], this.faces[19]),
            new Edge(this.points[1], this.points[9], this.faces[5], this.faces[19]),

            new Edge(this.points[2], this.points[3], this.faces[11], this.faces[12]),
            new Edge(this.points[2], this.points[4], this.faces[11], this.faces[16]),
            new Edge(this.points[2], this.points[6], this.faces[12], this.faces[17]),
            new Edge(this.points[2], this.points[10], this.faces[7], this.faces[17]),
            new Edge(this.points[2], this.points[11], this.faces[7], this.faces[16]),

            new Edge(this.points[3], this.points[4], this.faces[10], this.faces[11]),
            new Edge(this.points[3], this.points[6], this.faces[12], this.faces[13]),
            new Edge(this.points[3], this.points[8], this.faces[13], this.faces[14]),
            new Edge(this.points[3], this.points[9], this.faces[10], this.faces[14]),

            new Edge(this.points[4], this.points[5], this.faces[6], this.faces[15]),
            new Edge(this.points[4], this.points[9], this.faces[10], this.faces[15]),
            new Edge(this.points[4], this.points[11], this.faces[6], this.faces[16]),

            new Edge(this.points[5], this.points[9], this.faces[5], this.faces[15]),
            new Edge(this.points[5], this.points[11], this.faces[0], this.faces[6]),

            new Edge(this.points[6], this.points[8], this.faces[13], this.faces[18]),
            new Edge(this.points[6], this.points[7], this.faces[8], this.faces[18]),
            new Edge(this.points[6], this.points[10], this.faces[8], this.faces[17]),

            new Edge(this.points[7], this.points[8], this.faces[9], this.faces[18]),
            new Edge(this.points[7], this.points[10], this.faces[3], this.faces[8]),

            new Edge(this.points[8], this.points[9], this.faces[14], this.faces[19]),

            new Edge(this.points[10], this.points[11], this.faces[4], this.faces[7])
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
