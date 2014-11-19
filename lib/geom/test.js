/**
 * Created by kevin on 2014-11-15.
 */


var canvas = document.querySelector("canvas");
var processing = new Processing(canvas);

geom.processing = processing;

processing.createTetrahedron = geom.createTetrahedron;
processing.createCube = geom.createCube;
processing.createOctahedron = geom.createOctahedron;
processing.createDodecahedron = geom.createDodecahedron;
processing.createIcosahedron = geom.createIcosahedron;

processing.Vector3 = geom.Vector3;
processing.Matrix4 = geom.Matrix4;

with(processing) {
    size(400,400);
    background(255);
    strokeWeight(2);
    translate(200,200);
    scale(1,-1);

    var tetrahedron = createTetrahedron(200);
    var cube = createCube(150);
    var octahedron = createOctahedron(175);
    var dodecahedron = createDodecahedron(200);
    var icosahedron = createIcosahedron(200);
    var mesh = cube;

    mesh.draw();

    rotateMesh = function (mesh) {
        var speed = 0.5;
        var dx = speed * (mouseX - pmouseX);
        var dy = speed * (mouseY - pmouseY);

        var axis = new Vector3(dy, dx, 0);
        var angle = Math.PI * axis.length() / 180;

        if (axis.length() > 0.001) {
            axis = axis.normalize();
            var rotMatrix = Matrix4.rotation(axis, angle);
            geom.viewMatrix = rotMatrix.mul(geom.viewMatrix);

            background(255);
            mesh.draw();
        }
    };

    mouseDragged = function () {
        rotateMesh(mesh);
    };

    keyPressed = function () {
        if (key.toString() === '1') {
            mesh = tetrahedron;
        } else if (key.toString() === '2') {
            mesh = cube;
        } else if (key.toString() === '3') {
            mesh = octahedron;
        } else if (key.toString() === '4') {
            mesh = dodecahedron;
        } else if (key.toString() === '5') {
            mesh = icosahedron;
        }

        background(255);
        mesh.draw();
    };

    $("#vertices").change(function () {
        mesh.showVertices = this.checked;
        background(255);
        mesh.draw();
    });

    $("#edges").change(function () {
        mesh.showEdges = this.checked;
        background(255);
        mesh.draw();
    });

    $("#labels").change(function () {
        mesh.showLabels = this.checked;
        background(255);
        mesh.draw();
    });

    $("#normals").change(function () {
        mesh.showNormals = this.checked;
        background(255);
        mesh.draw();
    });
}
