/*global define */

define(function (require) {

    var Face = require("face");
    var Edge = require("edge");

    var Cube = function (size) {
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

        this.faces = [
            new Face(this.points, [0, 3, 2, 1], 'rgb(0,0,255)'),    // back
            new Face(this.points, [4, 5, 6, 7], 'rgb(128,128,128)'),    // front
            new Face(this.points, [0, 4, 7, 3], 'rgb(255,128,0)'),  // left
            new Face(this.points, [1, 2, 6, 5], 'rgb(0,128,0)'),   // right
            new Face(this.points, [3, 7, 6, 2], 'rgb(255,128,128)'),    // top
            new Face(this.points, [0, 1, 5, 4], 'rgb(255,255,0)')   // bottom
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

    Cube.prototype.frontFaces = function (viewMat) {
        return this.faces.filter(function (face) {
            var pts = face.points.map(function (point) {
                return viewMat.applyTransform(point);
            });

            var normal = calcFaceNormal(pts);
            return normal.z > 0;
        });
    };

    Cube.prototype.backFaces = function (viewMat) {
        return this.faces.filter(function (face) {
            var pts = face.points.map(function (point) {
                return viewMat.applyTransform(point);
            });

            var normal = calcFaceNormal(pts);
            return normal.z <= 0;
        });
    };

    return Cube;
});
