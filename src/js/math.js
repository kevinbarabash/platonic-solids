// stripped down version of vecmath (https://github.com/mattdesl/vecmath)

function Vector3(x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Vector3.prototype.clone = function () {
    return new Vector3(this.x, this.y, this.z);
};

Vector3.prototype.subtract = function (v) {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
};

Vector3.prototype.transformMat4 = function(mat) {
    var x = this.x, y = this.y, z = this.z, m = mat.val;
    this.x = m[0] * x + m[4] * y + m[8] * z + m[12];
    this.y = m[1] * x + m[5] * y + m[9] * z + m[13];
    this.z = m[2] * x + m[6] * y + m[10] * z + m[14];
    return this;
};

Vector3.prototype.cross = function(v) {
    var ax = this.x, ay = this.y, az = this.z,
        bx = v.x, by = v.y, bz = v.z;

    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
};

Vector3.prototype.dot = function(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
};


function Matrix4() {
    this.val = new Array(16);
}

Matrix4.prototype.rotateX = function(rad) {
    var a = this.val, s = Math.sin(rad), c = Math.cos(rad),
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

    // Perform axis-specific matrix multiplication
    a[4] = a10 * c + a20 * s;
    a[5] = a11 * c + a21 * s;
    a[6] = a12 * c + a22 * s;
    a[7] = a13 * c + a23 * s;
    a[8] = a20 * c - a10 * s;
    a[9] = a21 * c - a11 * s;
    a[10] = a22 * c - a12 * s;
    a[11] = a23 * c - a13 * s;
    return this;
};

Matrix4.prototype.rotateY = function(rad) {
    var a = this.val, s = Math.sin(rad), c = Math.cos(rad),
        a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];

    // Perform axis-specific matrix multiplication
    a[0] = a00 * c - a20 * s;
    a[1] = a01 * c - a21 * s;
    a[2] = a02 * c - a22 * s;
    a[3] = a03 * c - a23 * s;
    a[8] = a00 * s + a20 * c;
    a[9] = a01 * s + a21 * c;
    a[10] = a02 * s + a22 * c;
    a[11] = a03 * s + a23 * c;
    return this;
};

Matrix4.prototype.identity = function() {
    var a = this.val;
    a[0] = 1;
    a[1] = a[2] = a[3] = a[4] = 0;
    a[5] = 1;
    a[6] = a[7] = a[8] = a[9] = 0;
    a[10] = 1;
    a[11] = a[12] = a[13] = a[14] = 0;
    a[15] = 1;
    return this;
};

Matrix4.prototype.applyTransform = function (v) {
    var x = v.x, y = v.y, z = v.z, m = this.val;
    return new Vector3(
            m[0] * x + m[4] * y + m[8] * z + m[12],
            m[1] * x + m[5] * y + m[9] * z + m[13],
            m[2] * x + m[6] * y + m[10] * z + m[14]
    );
};
