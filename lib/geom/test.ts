/**
 * Created by kevin on 2014-11-15.
 */

/// <reference path="processing.d.ts"/>
/// <reference path="geom.ts"/>

module geom {

    var canvas = <HTMLCanvasElement>document.querySelector("canvas");
    var processing = new Processing(canvas);

    geom.processing = processing;

    processing.size(400,400);
    processing.background(255);
    processing.strokeWeight(2);
    processing.translate(200,200);

    var mesh = new Mesh();

    mesh.addVertex(0, 0, 0);
    mesh.addVertex(1, 0, 0);
    mesh.addVertex(0.5, Math.sqrt(3)/2, 0);
    mesh.addVertex(0.5, Math.sqrt(3)/6, Math.sqrt(2/3));

    mesh.vertices.forEach(function (p) {
        p.set(p.mul(200));
    });

    mesh.addFace(3, 0, 1);
    mesh.addFace(3, 1, 2);
    mesh.addFace(3, 2, 0);
    mesh.addFace(0, 2, 1);

    mesh.generateEdges();

    mesh.draw();
}
