define(function (require) {
    var Face = function (points, indices, color) {
        this.points = indices.map(function (index) {
            return points[index];
        });
        this.color = color;
    };

    return Face;
});
