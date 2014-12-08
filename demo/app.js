var canvas = document.getElementById("canvas1");
var processing = new Processing(canvas);

geom.processing = processing;

processing.createTetrahedron = geom.createTetrahedron;
processing.createCube = geom.createCube;
processing.createOctahedron = geom.createOctahedron;
processing.createDodecahedron = geom.createDodecahedron;
processing.createIcosahedron = geom.createIcosahedron;

processing.Vector3 = geom.Vector3;
processing.Matrix4 = geom.Matrix4;

processing.dashedLine = function(x1,y1,x2,y2,n) {
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
        this.line(x1,y1,x2,y2);
        i += 2;
    }
};

with (processing) {
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

    // TODO: store mesh options separate from mesh
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
        } else if (key.toString() === 's') {
            mesh.opaque = !mesh.opaque;
        } else if (key.toString() === 'e') {
            mesh.showEdges = !mesh.showEdges;
        } else if (key.toString() === 'v') {
            mesh.showVertices = !mesh.showVertices;
        } else if (key.toString() === 't') {
            mesh.showLabels = !mesh.showLabels;
        } else if (key.toString() === 'n') {
            mesh.showNormals = !mesh.showNormals;
        }

        background(255);
        mesh.draw();
    };
}
window.processing = processing;
iframeOverlay.createRelay(canvas);
