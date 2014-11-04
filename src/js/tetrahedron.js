/*global define */

define(function (require, exports, module) {

    var Face = require("face");
    var Edge = require("edge");

    var Tetrahedron = function (size) {
        this.points = [
            new PVector(0, 0, 0),
            new PVector(1, 0, 0),
            new PVector(0.5, Math.sqrt(3)/2, 0),
            new PVector(0.5, Math.sqrt(3)/6, Math.sqrt(2/3))
        ];
        
        var centroid = this.points.reduce(function (result, vec) {
            return new PVector(result.x + vec.x / 4, result.y + vec.y / 4, result.z + vec.z / 4);
        }, new PVector(0, 0, 0));
        
        this.points.forEach(function (point) {
            point.x -= centroid.x;
            point.y -= centroid.y;
            point.z -= centroid.z;

            point.x *= size;
            point.y *= size;
            point.z *= size;
        });

        this.faces = [
            new Face(this.points, [0, 2, 1], 'rgb(128,128,128)'),
            new Face(this.points, [3, 0, 1], 'rgb(0,255,255)'),
            new Face(this.points, [3, 1, 2], 'rgb(255,0,255)'),
            new Face(this.points, [3, 2, 0], 'rgb(255,255,0)')
        ];

        this.edges = [
            new Edge(this.points[0], this.points[1], this.faces[0], this.faces[1]),
            new Edge(this.points[1], this.points[2], this.faces[0], this.faces[2]),
            new Edge(this.points[2], this.points[0], this.faces[0], this.faces[3]),
            
            new Edge(this.points[3], this.points[0], this.faces[1], this.faces[3]),
            new Edge(this.points[3], this.points[1], this.faces[1], this.faces[2]),
            new Edge(this.points[3], this.points[2], this.faces[2], this.faces[3]),
        ];
    };

    Tetrahedron.prototype.frontFaces = function (viewMatrix) {
        return this.faces.filter(function (face) {
            var normal = face.calculateNormal(viewMatrix);
            return normal.z > 0;
        });
    };

    Tetrahedron.prototype.backFaces = function (viewMatrix) {
        return this.faces.filter(function (face) {
            var normal = face.calculateNormal(viewMatrix);
            return normal.z <= 0;
        });
    };

    module.exports = Tetrahedron;
});
