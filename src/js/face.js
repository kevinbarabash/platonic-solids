/*global define */

define(function (require, exports, module) {

    var Face = function (points, indices, color) {
        this.points = indices.map(function (index) {
            return points[index];
        });
        this.color = color;
    };

    Face.prototype.calculateNormal = function (viewMatrix) {
        var p0 = viewMatrix.applyTransform(this.points[0]);
        var p1 = viewMatrix.applyTransform(this.points[1]);
        var p2 = viewMatrix.applyTransform(this.points[2]);

        var v1 = PVector.sub(p0, p1);
        var v2 = PVector.sub(p1, p2);

        return v1.cross(v2);
    };

    Face.prototype.transformedPoints = function (viewMatrix) {
        return this.points.map(function (point) {
            return viewMatrix.applyTransform(point);
        });
    };

    module.exports = Face;
});
