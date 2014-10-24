function sketchProc(processing) {
    with(processing) {

        var Face = function(points, indices, color) {
            this.points = indices.map(function (index) {
                return points[index];
            });
            this.color = color;
        };

        var Edge = function (p0, p1, f0, f1) {
            this.p0 = p0;
            this.p1 = p1;
            this.f0 = f0;
            this.f1 = f1;
        };

        var Cube = function (size) {
            this.points = [
                new PVector(0,0,0),
                new PVector(1,0,0),
                new PVector(1,1,0),
                new PVector(0,1,0),
                new PVector(0,0,1),
                new PVector(1,0,1),
                new PVector(1,1,1),
                new PVector(0,1,1)
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

        var cube, viewMat;
        var angle = 0;
        var isOpaque = true;

        cube = new Cube(200);
        viewMat = new Matrix4();
        viewMat.rotateX(Math.PI / 6);
        viewMat.rotateY(Math.PI / 6);

        setup = function () {
            size(400, 400);
            strokeWeight(2);
            frameRate(60);
            smooth();
        };

        fillFace = function (face) {
            var pts = face.points.map(function (point) {
                return viewMat.applyTransform(point);
            });

            var normal = calcFaceNormal(pts);
            if (normal.z < 0 && isOpaque) {
                return;
            }

            noStroke();
            var regex = /rgb\((\d+),(\d+),(\d+)\)/;
            var matches = face.color.match(regex);
            var alpha = isOpaque ? 255 : 128;
            var col = color(matches[1], matches[2], matches[3], alpha);

            fill(col);
            quad(pts[0].x, pts[0].y, pts[1].x, pts[1].y, pts[2].x, pts[2].y, pts[3].x, pts[3].y);
        };

        strokeEdge = function(edge) {
            var p0 = viewMat.applyTransform(edge.p0);
            var p1 = viewMat.applyTransform(edge.p1);

            var n0 = calcFaceNormal(edge.f0.points.map(function (point) {
                return viewMat.applyTransform(point);
            }));

            var n1 = calcFaceNormal(edge.f1.points.map(function (point) {
                return viewMat.applyTransform(point);
            }));

            if (n0.z < 0 && n1.z < 0) {
                return;
            } else {
                stroke(0, 0, 0);
            }

            line(p0.x, p0.y, p1.x, p1.y);
        };

        Number.prototype.toRadians = function () {
            return Math.PI * this / 180;
        };

        draw = function() {
            background(255);

            pushMatrix();

            translate(200,200);
            scale(1, -1);

            viewMat.identity();
            viewMat.rotateX(angle.toRadians());
            viewMat.rotateY(Math.sqrt(2) * angle.toRadians());

            angle += 0.5;

            if (!isOpaque) {
                cube.backFaces(viewMat).forEach(function (face) {
                    fillFace(face);
                });
            }

            cube.frontFaces(viewMat).forEach(function (face) {
                fillFace(face);
            });

            cube.edges.forEach(function (edge) {
                strokeEdge(edge);
            });

            popMatrix();
        };

        mouseMoved = function() {
            // TODO: implement controls
        };

    }
    window.processing = processing;
}

var canvas = document.getElementById("canvas1");
var p = new Processing(canvas, sketchProc);
