
function sqr(x) { return x * x }
function dist2(v, w) { return sqr(v[0] - w[0]) + sqr(v[1] - w[1]) }
function distToSegmentSquared(p, v, w) {
    var l2 = dist2(v, w);
    if (l2 == 0) return dist2(p, v);
    var t = ((p[0] - v[0]) * (w[0] - v[0]) + (p[1] - v[1]) * (w[1] - v[1])) / l2;
    if (t < 0) return dist2(p, v);
    if (t > 1) return dist2(p, w);
    return dist2(p, [
        v[0] + t * (w[0] - v[0]),
        v[1] + t * (w[1] - v[1])
    ]);
}
function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }

function testInsidePoly(nvert, verts, test) {
    var i, j, c = false;
    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((verts[i][1] > test[1]) != (verts[j][1] > test[1])) &&
         (test[0] < (verts[j][0] - verts[i][0]) * (test[1] - verts[i][1]) / (verts[j][1] - verts[i][1]) + verts[i][0]))
            c = !c;
    }
    return c;
}

//pads left
String.prototype.lpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = padString + str;
    return str;
}

//pads right
String.prototype.rpad = function (padString, length) {
    var str = this;
    while (str.length < length)
        str = str + padString;
    return str;
}

function veclen(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}

function vecnorm(v) {
    var len = veclen(v);
    return [v[0] / len, v[1] / len];
}

function vecsub(v, w) {
    return [v[0] - w[0], v[1] - w[1]];
}

function vecadd(v, w) {
    return [v[0] + w[0], v[1] + w[1]];
}

function vecmulscalar(v, s) {
    return [v[0] * s, v[1] * s];
}

function vecdivscalar(v, s) {
    return [v[0] / s, v[1] / s];
}

function vecdot(v, w) {
    return v[0] * w[0] + v[1] * w[1];
}

function vecaddto(v, w) {
    v[0] += w[0];
    v[1] += w[1];
}

function vecsubfrom(v, w) {
    v[0] -= w[0];
    v[1] -= w[1];
}

function vecrot(v, theta) {
    var cs = Math.cos(theta),
        sn = Math.sin(theta),
        x = v[0],
        y = v[1];

    return [
        x * cs - y * sn,
        x * sn + y * cs
    ];
}

function vecinv(v) {
    return [-v[0], -v[1]];
}