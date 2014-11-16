/**
 * Created by kevin on 2014-11-15.
 */

/// <reference path="processing.d.ts"/>
/// <reference path="geom.ts"/>
/// <reference path="solids.ts"/>

module geom {

    var canvas = <HTMLCanvasElement>document.querySelector("canvas");
    var processing = new Processing(canvas);

    geom.processing = processing;
    var p5 = processing;

    p5.size(400,400);
    p5.background(255);
    p5.strokeWeight(2);
    p5.translate(200,200);
    p5.scale(1,-1);

    var tetrahedron = createTetrahedron(200);
    var cube = createCube(150);
    var octahedron = createOctahedron(175);
    var dodecahedron = createDodecahedron(200);
    var icosahedron = createIcosahedron(200);
    var mesh = cube;

    mesh.draw();

    p5.rotateMesh = function (mesh) {
        var speed = 0.5;
        var dx = speed * (p5.mouseX - p5.pmouseX);
        var dy = speed * (p5.mouseY - p5.pmouseY);

        var axis = new Vector3(dy, dx, 0);
        var angle = Math.PI * axis.length() / 180;

        if (axis.length() > 0.001) {
            axis = axis.normalize();
            var rotMatrix = Matrix4.rotation(axis, angle);
            viewMatrix = rotMatrix.multiply(viewMatrix);

            p5.background(255);
            mesh.draw();
        }
    };

    p5.mouseDragged = function () {
        p5.rotateMesh(mesh);
    };

    p5.keyPressed = function () {
        if (p5.key.toString() === '1') {
            mesh = tetrahedron;
        } else if (p5.key.toString() === '2') {
            mesh = cube;
        } else if (p5.key.toString() === '3') {
            mesh = octahedron;
        } else if (p5.key.toString() === '4') {
            mesh = dodecahedron;
        } else if (p5.key.toString() === '5') {
            mesh = icosahedron;
        }

        p5.background(255);
        mesh.draw();
    };
}
