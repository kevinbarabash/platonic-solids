/**
 * Created by kevin on 2014-11-16.
 */

/// <reference path="geom.ts"/>

module geom {

    export function createTetrahedron(size: number) {
        var mesh = new Mesh();

        mesh.addVertex(  0,              0,              0);
        mesh.addVertex(  1,              0,              0);
        mesh.addVertex(0.5, Math.sqrt(3)/2,              0);
        mesh.addVertex(0.5, Math.sqrt(3)/6, Math.sqrt(2/3));

        mesh.addFace(3, 0, 1);
        mesh.addFace(3, 1, 2);
        mesh.addFace(3, 2, 0);
        mesh.addFace(0, 2, 1);

        mesh.generateEdges();
        mesh.center().scale(size);

        return mesh;
    }

    export function createCube(size: number) {
        var mesh = new Mesh();

        mesh.addVertex(0, 0, 0);
        mesh.addVertex(1, 0, 0);
        mesh.addVertex(1, 1, 0);
        mesh.addVertex(0, 1, 0);
        mesh.addVertex(0, 0, 1);
        mesh.addVertex(1, 0, 1);
        mesh.addVertex(1, 1, 1);
        mesh.addVertex(0, 1, 1);

        mesh.addFace(0, 3, 2, 1);
        mesh.addFace(4, 5, 6, 7);
        mesh.addFace(0, 4, 7, 3);
        mesh.addFace(1, 2, 6, 5);
        mesh.addFace(3, 7, 6, 2);
        mesh.addFace(0, 1, 5, 4);

        mesh.generateEdges();
        mesh.center().scale(size);

        return mesh;
    }

    export function createOctahedron(size: number) {
        var mesh = new Mesh();

        mesh.addVertex(  0,   0,  0);
        mesh.addVertex(  1,   0,  0);
        mesh.addVertex(  1,   1,  0);
        mesh.addVertex(  0,   1,  0);
        mesh.addVertex(0.5, 0.5,  Math.sqrt(2)/2);
        mesh.addVertex(0.5, 0.5, -Math.sqrt(2)/2);

        mesh.addFace(0, 1, 4);
        mesh.addFace(1, 2, 4);
        mesh.addFace(2, 3, 4);
        mesh.addFace(3, 0, 4);
        mesh.addFace(1, 0, 5);
        mesh.addFace(2, 1, 5);
        mesh.addFace(3, 2, 5);
        mesh.addFace(0, 3, 5);

        mesh.generateEdges();
        mesh.center().scale(size);

        return mesh;
    }

    export function createDodecahedron(size: number) {
        size = size / 3;

        var mesh = new Mesh();

        var p = (1 + Math.sqrt(5))/2, q = 1/p;

        mesh.addVertex( 0,  q,  p);
        mesh.addVertex( 0,  q, -p);
        mesh.addVertex( 0, -q,  p);
        mesh.addVertex( 0, -q, -p);

        mesh.addVertex( p,  0,  q);
        mesh.addVertex( p,  0, -q);
        mesh.addVertex(-p,  0,  q);
        mesh.addVertex(-p,  0, -q);

        mesh.addVertex( q,  p,  0);
        mesh.addVertex( q, -p,  0);
        mesh.addVertex(-q,  p,  0);
        mesh.addVertex(-q, -p,  0);

        mesh.addVertex( 1,  1,  1);
        mesh.addVertex( 1,  1, -1);
        mesh.addVertex( 1, -1,  1);
        mesh.addVertex( 1, -1, -1);

        mesh.addVertex(-1,  1,  1);
        mesh.addVertex(-1,  1, -1);
        mesh.addVertex(-1, -1,  1);
        mesh.addVertex(-1, -1, -1);

        mesh.addFace( 6, 18,  2,  0, 16);
        mesh.addFace( 0, 12,  8, 10, 16);
        mesh.addFace( 2, 14,  4, 12,  0);
        mesh.addFace(18, 11,  9, 14,  2);
        mesh.addFace( 6,  7, 19, 11, 18);
        mesh.addFace(16, 10, 17,  7,  6);
        mesh.addFace( 1, 17, 10,  8, 13);
        mesh.addFace(13,  8, 12,  4,  5);
        mesh.addFace( 5,  4, 14,  9, 15);
        mesh.addFace(15,  9, 11, 19,  3);
        mesh.addFace( 3, 19,  7, 17,  1);
        mesh.addFace( 1, 13,  5, 15,  3);

        mesh.generateEdges();
        mesh.center().scale(size);

        return mesh;
    }

    export function createIcosahedron(size: number) {
        size = size / 3;

        var mesh = new Mesh();
        var t = ( 1 + Math.sqrt( 5 ) ) / 2;

        mesh.addVertex(-1,  t,  0);
        mesh.addVertex( 1,  t,  0);
        mesh.addVertex(-1, -t,  0);
        mesh.addVertex( 1, -t,  0);
        mesh.addVertex( 0, -1,  t);
        mesh.addVertex( 0,  1,  t);
        mesh.addVertex( 0, -1, -t);
        mesh.addVertex( 0,  1, -t);
        mesh.addVertex( t,  0, -1);
        mesh.addVertex( t,  0,  1);
        mesh.addVertex(-t,  0, -1);
        mesh.addVertex(-t,  0,  1);

        mesh.addFace(0, 11,  5);
        mesh.addFace(0,  5,  1);
        mesh.addFace(0,  1,  7);
        mesh.addFace(0,  7, 10);
        mesh.addFace(0, 10, 11);
        mesh.addFace(1,  5,  9);
        mesh.addFace(5, 11,  4);
        mesh.addFace(11,10,  2);
        mesh.addFace(10, 7,  6);
        mesh.addFace(7,  1,  8);
        mesh.addFace(3,  9,  4);
        mesh.addFace(3,  4,  2);
        mesh.addFace(3,  2,  6);
        mesh.addFace(3,  6,  8);
        mesh.addFace(3,  8,  9);
        mesh.addFace(4,  9,  5);
        mesh.addFace(2,  4, 11);
        mesh.addFace(6,  2, 10);
        mesh.addFace(8,  6,  7);
        mesh.addFace(9,  8,  1);

        mesh.generateEdges();
        mesh.center().scale(size);

        return mesh;
    }
}