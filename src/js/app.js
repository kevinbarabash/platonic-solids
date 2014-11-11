/*global define */

define(function (require) {
    function sketchProc(processing) {
        with (processing) {

            var Cube = require("cube");
            var Tetrahedron = require("tetrahedron");
            var Octahedron = require("octahedron");
            var Icosahedron = require("icosahedron");

            var isOpaque = false;

            var cube = new Cube(200);
            var tetrahedron = new Tetrahedron(200);
            var octahedron = new Octahedron(200);
            var icosahedron = new Icosahedron(200);
            var solid = tetrahedron;

            var viewMatrix = new Matrix4();
            viewMatrix.identity();

            setup = function () {
                size(400, 400);
                strokeWeight(2);
                frameRate(60);
                smooth();
            };

            var dashLength = 10;
            var dashedLine = function(x1,y1,x2,y2) {
                var dx = x2 - x1;
                var dy = y2 - y1;
                var d = Math.sqrt(dx*dx + dy*dy);

                var i = 0;
                var xStart = x1;
                var yStart = y1;
                var xEnd = x2;
                var yEnd = y2;
                while (i * dashLength < d) {
                    var x1 = xStart + dashLength * i * dx / d;
                    var y1 = yStart + dashLength * i * dy / d;

                    if ((i+1) * dashLength < d) {
                        x2 = x1 + dashLength * dx / d;
                        y2 = y1 + dashLength * dy / d;
                    } else {
                        x2 = xEnd;
                        y2 = yEnd;
                    }
                    line(x1,y1,x2,y2);
                    i += 2;
                }
            };

            var dashedLineN = function(x1,y1,x2,y2,n) {
//                strokeCap(SQUARE);
                var dx = x2 - x1;
                var dy = y2 - y1;
                var d = Math.sqrt(dx*dx + dy*dy);
                var dashLength = d / n;

                var i = 0;
                var xStart = x1;
                var yStart = y1;
                var xEnd = x2;
                var yEnd = y2;
                while (i * dashLength < d) {
                    var x1 = xStart + dashLength * i * dx / d;
                    var y1 = yStart + dashLength * i * dy / d;

                    if ((i+1) * dashLength < d) {
                        x2 = x1 + dashLength * dx / d;
                        y2 = y1 + dashLength * dy / d;
                    } else {
                        x2 = xEnd;
                        y2 = yEnd;
                    }
                    line(x1,y1,x2,y2);
                    i += 2;
                }
            };

            var fillFace = function (face) {
                var normal = face.calculateNormal(viewMatrix);
                if (normal.z < 0 && isOpaque) {
                    return;
                }

                noStroke();
                var regex = /rgb\((\d+),(\d+),(\d+)\)/;
                var matches = face.color.match(regex);
                var alpha = isOpaque ? 255 : 128;
                var col = color(matches[1], matches[2], matches[3], alpha);

                if (isOpaque) {
                    fill(col);
                } else {
                    fill(192,192,192,64);
                }

                beginShape();

                face.transformedPoints(viewMatrix).forEach(function (p) {
                    vertex(p.x, p.y);
                });

                endShape();
            };

            var strokeEdge = function(edge) {
                var n0 = edge.f0.calculateNormal(viewMatrix);
                var n1 = edge.f1.calculateNormal(viewMatrix);

                var p0 = viewMatrix.applyTransform(edge.p0);
                var p1 = viewMatrix.applyTransform(edge.p1);

                if (n0.z < 0 && n1.z < 0) {
                    if (!isOpaque) {
                        stroke(0,0,0,64);
                        dashedLineN(p0.x, p0.y, p1.x, p1.y, 10);
                    }
                } else {
                    stroke(0,0,0);
                    line(p0.x, p0.y, p1.x, p1.y);
                }
            };

            Number.prototype.toRadians = function () {
                return Math.PI * this / 180;
            };

            draw = function() {
                background(255);

                pushMatrix();
                translate(200,200);

                if (!isOpaque) {
                    solid.backFaces(viewMatrix).forEach(function (face) {
                        fillFace(face);
                    });
                }

                solid.frontFaces(viewMatrix).forEach(function (face) {
                    fillFace(face);
                });

                solid.edges.forEach(function (edge) {
                    strokeEdge(edge);
                });

                popMatrix();
            };

            mouseDragged = function() {
                var speed = 0.5;
                var dx = speed * (mouseX - pmouseX);
                var dy = speed * (mouseY - pmouseY);

                var axis = new PVector(-dy, dx, 0);
                var mag = axis.mag();

                var rotMatrix = new Matrix4();
                rotMatrix.identity().rotate(mag.toRadians(), axis);
                viewMatrix = rotMatrix.multiply(viewMatrix);
            };

            keyPressed = function () {
                if (key.toString() === '1') {
                    solid = tetrahedron;
                } else if (key.toString() === '2') {
                    solid = cube;
                } else if (key.toString() === '3') {
                    solid = octahedron;
                } else if (key.toString() === '4') {
                    solid = icosahedron;
                } else if (key.toString() === 's') {
                    isOpaque = true;
                } else if (key.toString() === 'x') {
                    isOpaque = false;
                }
            };
        }
        window.processing = processing;
    }

    var canvas = document.getElementById("canvas1");
    new Processing(canvas, sketchProc);
});

