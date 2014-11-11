/*global define */

define(function (require, exports, module) {

    var Face = require("face");
    var Edge = require("edge");

    var Dodecahedron = function (size) {
        size = size / 3;

        // http://en.wikipedia.org/wiki/Dodecahedron#Cartesian_coordinates

        var p = (1 + Math.sqrt(5))/2, q = 1/p;

        this.points = [
            new PVector(  0,  q,  p),
            new PVector(  0,  q, -p),
            new PVector(  0, -q,  p),
            new PVector(  0, -q, -p),

            new PVector(  p,  0,  q),
            new PVector(  p,  0, -q),
            new PVector( -p,  0,  q),
            new PVector( -p,  0, -q),

            new PVector(  q,  p,  0),
            new PVector(  q, -p,  0),
            new PVector( -q,  p,  0),
            new PVector( -q, -p,  0),

            new PVector(  1,  1,  1),
            new PVector(  1,  1, -1),
            new PVector(  1, -1,  1),
            new PVector(  1, -1, -1),
            new PVector( -1,  1,  1),
            new PVector( -1,  1, -1),
            new PVector( -1, -1,  1),
            new PVector( -1, -1, -1)
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
            new Face(this.points, [16,0,2,18,6].reverse(), randomColor()),

            new Face(this.points, [16,10,8,12,0].reverse(), randomColor()),
            new Face(this.points, [0,12,4,14,2].reverse(), randomColor()),
            new Face(this.points, [2,14,9,11,18].reverse(), randomColor()),
            new Face(this.points, [18,11,19,7,6].reverse(), randomColor()),
            new Face(this.points, [6,7,17,10,16].reverse(), randomColor()),

            new Face(this.points, [1,17,10,8,13], randomColor()),
            new Face(this.points, [13,8,12,4,5], randomColor()),
            new Face(this.points, [5,4,14,9,15], randomColor()),
            new Face(this.points, [15,9,11,19,3], randomColor()),
            new Face(this.points, [3,19,7,17,1], randomColor()),

            new Face(this.points, [1,13,5,15,3], randomColor())
        ];

        this.edges = [
//            new Edge(this.points[0], this.points[1], this.faces[1], this.faces[2]),
//            new Edge(this.points[0], this.points[5], this.faces[0], this.faces[1]),
//            new Edge(this.points[0], this.points[7], this.faces[2], this.faces[3]),
//            new Edge(this.points[0], this.points[10], this.faces[3], this.faces[4]),
//            new Edge(this.points[0], this.points[11], this.faces[0], this.faces[4]),
//
//            new Edge(this.points[1], this.points[5], this.faces[1], this.faces[5]),
//            new Edge(this.points[1], this.points[7], this.faces[2], this.faces[9]),
//            new Edge(this.points[1], this.points[8], this.faces[9], this.faces[19]),
//            new Edge(this.points[1], this.points[9], this.faces[5], this.faces[19]),
//
//            new Edge(this.points[2], this.points[3], this.faces[11], this.faces[12]),
//            new Edge(this.points[2], this.points[4], this.faces[11], this.faces[16]),
//            new Edge(this.points[2], this.points[6], this.faces[12], this.faces[17]),
//            new Edge(this.points[2], this.points[10], this.faces[7], this.faces[17]),
//            new Edge(this.points[2], this.points[11], this.faces[7], this.faces[16]),
//
//            new Edge(this.points[3], this.points[4], this.faces[10], this.faces[11]),
//            new Edge(this.points[3], this.points[6], this.faces[12], this.faces[13]),
//            new Edge(this.points[3], this.points[8], this.faces[13], this.faces[14]),
//            new Edge(this.points[3], this.points[9], this.faces[10], this.faces[14]),
//
//            new Edge(this.points[4], this.points[5], this.faces[6], this.faces[15]),
//            new Edge(this.points[4], this.points[9], this.faces[10], this.faces[15]),
//            new Edge(this.points[4], this.points[11], this.faces[6], this.faces[16]),
//
//            new Edge(this.points[5], this.points[9], this.faces[5], this.faces[15]),
//            new Edge(this.points[5], this.points[11], this.faces[0], this.faces[6]),
//
//            new Edge(this.points[6], this.points[8], this.faces[13], this.faces[18]),
//            new Edge(this.points[6], this.points[7], this.faces[8], this.faces[18]),
//            new Edge(this.points[6], this.points[10], this.faces[8], this.faces[17]),
//
//            new Edge(this.points[7], this.points[8], this.faces[9], this.faces[18]),
//            new Edge(this.points[7], this.points[10], this.faces[3], this.faces[8]),
//
//            new Edge(this.points[8], this.points[9], this.faces[14], this.faces[19]),
//
//            new Edge(this.points[10], this.points[11], this.faces[4], this.faces[7])
        ];
    };

    Dodecahedron.prototype.frontFaces = function (viewMatrix) {
        return this.faces.filter(function (face) {
            var normal = face.calculateNormal(viewMatrix);
            return normal.z > 0;
        });
    };

    Dodecahedron.prototype.backFaces = function (viewMatrix) {
        return this.faces.filter(function (face) {
            var normal = face.calculateNormal(viewMatrix);
            return normal.z <= 0;
        });
    };

    module.exports = Dodecahedron;
});
