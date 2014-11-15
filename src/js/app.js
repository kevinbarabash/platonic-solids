/*global define */

define(function (require) {

    var canvas = document.getElementById("canvas1");
    var processing = new Processing(canvas);

    with (processing) {
        var Cube = require("cube");
        var Tetrahedron = require("tetrahedron");
        var Octahedron = require("octahedron");
        var Dodecahedron = require("dodecahedron");
        var Icosahedron = require("icosahedron");

        var isOpaque = false;
        var showVertices = false;
        var showEdges = true;
        var showLabels = false;
        var showNormals = false;

        var cube = new Cube(200);
        var tetrahedron = new Tetrahedron(200);
        var octahedron = new Octahedron(200);
        var dodecahedron = new Dodecahedron(200);
        var icosahedron = new Icosahedron(200);
        var solid = tetrahedron;

        var viewMatrix = new Matrix4();
        viewMatrix.identity();

        setup = function () {
            size(400, 400);
            strokeWeight(2);
            frameRate(60);
            smooth();
            textSize(18);
            textAlign(LEFT, CENTER);
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

        var drawNormal = function (face) {
            var normal = face.calculateNormal(viewMatrix);
            var center = viewMatrix.applyTransform(face.centerPoint());
            normal.normalize();

            var tol = 0.005;
            if (normal.z > tol) {
                stroke(0,0,255);
            } else if (normal.z <= tol && normal.z > -tol) {
                stroke(0,255,0);
            } else {
                if (isOpaque) {
                    return;
                }
                stroke(255,0,0);
            }

            var length = 50;
            var start = new PVector(center.x, center.y);
            var end = new PVector(start.x + length * normal.x, start.y + length * normal.y);

            line(start.x, start.y, end.x, end.y);

            var perp1 = new PVector(-normal.y, normal.x);
            perp1.mult(0.1 * length);
            var perp2 = new PVector(normal.y, -normal.x);
            perp2.mult(0.1 * length);

            var tail1 = new PVector(start.x + 0.9 * length * normal.x, start.y + 0.9 * length * normal.y);
            tail1.add(perp1);
            var tail2 = new PVector(start.x + 0.9 * length * normal.x, start.y + 0.9 * length * normal.y);
            tail2.add(perp2);

            line(end.x, end.y, tail1.x, tail1.y);
            line(end.x, end.y, tail2.x, tail2.y);
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

            if (showEdges) {
                solid.edges.forEach(function (edge) {
                    strokeEdge(edge);
                });
            }

            if (showVertices) {
                fill(0,0,0);
                solid.points.forEach(function (p, i) {
                    p = viewMatrix.applyTransform(p);
                    ellipse(p.x, p.y, 8, 8);
                });
            }

            if (showLabels) {
                fill(0,0,255);
                solid.points.forEach(function (p, i) {
                    p = viewMatrix.applyTransform(p);
                    text(i, p.x + 10, p.y);
                });
            }

            if (showNormals) {
                solid.faces.forEach(function (face) {
                    drawNormal(face);
                });
            }

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
                solid = dodecahedron;
            } else if (key.toString() === '5') {
                solid = icosahedron;
            } else if (key.toString() === 's') {
                isOpaque = !isOpaque;
            } else if (key.toString() === 'e') {
                showEdges = !showEdges;
            } else if (key.toString() === 'v') {
                showVertices = !showVertices;
            } else if (key.toString() === 't') {
                showLabels = !showLabels;
            } else if (key.toString() === 'n') {
                showNormals = !showNormals;
            }
        };

        setup();
    }
    window.processing = processing;

});

