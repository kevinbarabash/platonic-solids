/*global define */

define(function (require) {
    function sketchProc(processing) {
        with (processing) {

            var Cube = require("cube");

            var angle = 0;
            var isOpaque = true;
            var cube = new Cube(200);
            var viewMatrix = new Matrix4();

            viewMatrix.rotateX(Math.PI / 6);
            viewMatrix.rotateY(Math.PI / 6);

            setup = function () {
                size(400, 400);
                strokeWeight(2);
                frameRate(60);
                smooth();
            };

            fillFace = function (face) {
                var normal = face.calculateNormal(viewMatrix);
                if (normal.z < 0 && isOpaque) {
                    return;
                }

                noStroke();
                var regex = /rgb\((\d+),(\d+),(\d+)\)/;
                var matches = face.color.match(regex);
                var alpha = isOpaque ? 255 : 128;
                var col = color(matches[1], matches[2], matches[3], alpha);

                fill(col);

                var pts = face.transformedPoints(viewMatrix);
                quad(pts[0].x, pts[0].y, pts[1].x, pts[1].y, pts[2].x, pts[2].y, pts[3].x, pts[3].y);
            };

            strokeEdge = function(edge) {
                var n0 = edge.f0.calculateNormal(viewMatrix);
                var n1 = edge.f1.calculateNormal(viewMatrix);

                if (n0.z < 0 && n1.z < 0) {
                    return;
                } else {
                    stroke(0, 0, 0);
                }

                var p0 = viewMatrix.applyTransform(edge.p0);
                var p1 = viewMatrix.applyTransform(edge.p1);
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

                viewMatrix.identity();
                viewMatrix.rotateX(angle.toRadians());
                viewMatrix.rotateY(Math.sqrt(2) * angle.toRadians());

                angle += 0.5;

                if (!isOpaque) {
                    cube.backFaces(viewMatrix).forEach(function (face) {
                        fillFace(face);
                    });
                }

                cube.frontFaces(viewMatrix).forEach(function (face) {
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
    new Processing(canvas, sketchProc);
});

