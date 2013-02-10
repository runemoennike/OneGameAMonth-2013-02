
var numSectorsX = 7;
var numSectorsY = 20;
var sectorBaseSize = 2000;
var sectorSize;
var sectors;
var lastCollidedLineSegment;

function generateSectors() {
    sectors = new Array(numSectorsX * numSectorsY);
    var numShapes, avgSize, pointiness, complexity, offX, offY;

    for (var x = 0; x < numSectorsX; x++) {
        for (var y = 0; y < numSectorsY; y++) {
            offX = x * sectorBaseSize;
            offY = -y * sectorBaseSize;
            if (x == 0 || x == numSectorsX - 1 || y == 0 || y == numSectorsY - 1) {
                sectors[y * numSectorsX + x] = [
                    //[[offX, offY], [offX + sectorBaseSize, offY], [offX + sectorBaseSize, offY + sectorBaseSize], [offX, offY + sectorBaseSize]],
                    generateShape(offX + sectorBaseSize / 2, offY - sectorBaseSize / 2, sectorBaseSize / 2, sectorBaseSize / 2 * 1.2, 5)
                ];
            } else if (x == 3 && y == 2) {
                sectors[y * numSectorsX + x] = [];
            } else {
                numShapes = 5;
                avgSize = 300;
                pointiness = 1.0;
                complexity = 7;
                sectors[y * numSectorsX + x] = generateShapes(offX, offY, numShapes, avgSize, pointiness, complexity);
            }
        }
    }

    sectors[1 * numSectorsX + 2] = [];
}

function generateShapes(offX, offY, numShapes, avgSize, pointiness, complexity, staticX, staticY) {
    //var result = new Array(shapes.length);
    //for (var shp = 0; shp < shapes.length; shp++) {
    //    result[shp] = new Array(shapes[shp].length);
    //    for (var point = 0; point < shapes[shp].length; point++) {
    //        result[shp][point] = [shapes[shp][point][0] + offX, shapes[shp][point][1] + offY];
    //    }
    //}
    //return result;

    var shapes = new Array(numShapes);

    var minR = avgSize - pointiness * avgSize / 2;
    var maxR = avgSize + pointiness * avgSize / 2;
    //var minX = offX + maxR;
    //var maxX = offX + sectorBaseSize - maxR;
    //var minY = offY + maxR;
    //var maxY = offY + sectorBaseSize - maxR;
    var minX = offX;
    var maxX = offX + sectorBaseSize;
    var minY = offY;
    var maxY = offY + sectorBaseSize;

    for (var s = 0; s < numShapes; s++) {
        var cx = Math.random() * (maxX - minX) + minX;
        var cy = Math.random() * (maxY - minY) + minY;
        var numPoints = Math.floor(3 + complexity * Math.random());
        shapes[s] = generateShape(cx, cy, minR, maxR, numPoints);
    }


    //  shapes[0] = [[offX, offY], [offX + sectorBaseSize, offY], [offX + sectorBaseSize, offY + sectorBaseSize], [offX, offY + sectorBaseSize]];

    return shapes;
}

function generateShape(cx, cy, minR, maxR, numPoints) {
    var shape = new Array(numPoints);
    for (var p = 0; p < numPoints; p++) {
        var angle = 2 * Math.PI * (p / numPoints);
        var r = Math.random() * (maxR - minR) + minR;
        var x = cx + Math.cos(angle) * r;
        var y = cy + Math.sin(angle) * r;
        shape[p] = [x, y]
    }
    return shape;
}


function findClosesDistToSectorPoly(sector, test) {
    var closest = 999999999;
    for (var si = 0; si < sector.length; si++) {
        for (var li = 0; li < sector[si].length; li++) {
            var p1 = sector[si][li],
                p2 = (li == sector[si].length - 1) ? sector[si][0] : sector[si][li + 1];
            var distSq = distToSegmentSquared(test, p1, p2);
            if (distSq < closest) {
                closest = distSq;
                lastCollidedLineSegment = [p1, p2];
            }
        }
    }
    return Math.sqrt(closest);
}

function testInsideSectorPolys(sector, test) {
    for (var si = 0; si < sector.length; si++) {
        if (testInsidePoly(sector[si].length, sector[si], test)) {
            return true;
        }
    }

    return false;
}

function testPointInPolys(test) {

    var wTest = scaleCoords(test);
    var tsx = Math.floor(wTest[0] / sectorSize);
    var tsy = Math.floor(-wTest[1] / sectorSize);

    var testx = test[0]; /// scale + canvasW / scale / 2;
    var testy = test[1]; /// scale + canvasH / scale / 3 * 2;

    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            var sx = tsx + x;
            var sy = tsy + y;

            if (sx >= 0 && sx < numSectorsX && sy >= 0 && sy < numSectorsY) {
                var sector = sectors[sy * numSectorsX + sx];
                if (testInsideSectorPolys(sector, test)) {
                    return true;
                }
            }
        }
    }
}

function testPointCollides(test, size) {
    if (noClip) {
        return false;
    }

    var wTest = scaleCoords(test);
    var tsx = Math.floor(wTest[0] / sectorSize);
    var tsy = Math.floor(-wTest[1] / sectorSize);

    var testx = test[0]; /// scale + canvasW / scale / 2;
    var testy = test[1]; /// scale + canvasH / scale / 3 * 2;

    //if (testx < 0 || testx > numSectorsX * sectorBaseSize || testy > 0 || testy < -numSectorsY * sectorBaseSize) {
    //    lastCollidedLineSegment = false;
    //    return true;
    //}

    for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
            var sx = tsx + x;
            var sy = tsy + y;
            if (sx >= 0 && sx < numSectorsX && sy >= 0 && sy < numSectorsY) {
                var sector = sectors[sy * numSectorsX + sx];
                //return testInsideSectorPolys(sector, [testx, testy]);
                if (findClosesDistToSectorPoly(sector, [testx, testy]) < size) {
                    return true;
                }
            }
        }
    }
    return false;
}


function drawShapes(shps) {
    ctx.lineWidth = 30;
    ctx.lineJoin = "miter";
    ctx.strokeStyle = "#00AAAA";
    ctx.fillStyle = "#001111";
    ctx.shadowBlur = (fast ? 0 : 20);
    ctx.shadowColor = "#55AAAA";
    for (var i = 0; i < shps.length; i++) {
        ctx.beginPath();
        ctx.moveTo(shps[i][0][0], shps[i][0][1]);
        for (var p = 1; p < shps[i].length; p++) {
            ctx.lineTo(shps[i][p][0], shps[i][p][1]);
        }
        ctx.closePath();

        ctx.stroke();
        ctx.fill();
    }
    ctx.shadowBlur = 0;
}

function drawFloor(dt) {
    var s = 300 * scale;
    var flip = Math.floor(pl.x / s) % 2 == 0 || Math.floor(pl.y / s) % 2 != 0;
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 50;
    ctx.shadowBlur = (fast ? 0 : 20);
    ctx.shadowColor = "#000022";
    for (var x = 0; x < 9; x++) {
        var rx = x * s - pl.x % s - s / 2;
        ctx.beginPath();
        ctx.moveTo(rx, 0);
        ctx.lineTo(rx, canvasH);
        ctx.stroke();
    }

    for (var x = 0; x < 6; x++) {
        var ry = x * s - pl.y % s - s / 2;
        ctx.beginPath();
        ctx.moveTo(0, ry);
        ctx.lineTo(canvasW, ry);
        ctx.stroke();
    }
    ctx.shadowBlur = 0;
}


function drawSectors() {
    document.getElementById("debug_pos").innerHTML = Math.floor(pl.x / scale) + "," + Math.floor(pl.y / scale);

    var plsx = Math.floor(pl.x / sectorSize + 0.5);
    var plsy = Math.floor(-pl.y / sectorSize + 0.5);

    document.getElementById("debug_sector").innerHTML = plsx + "," + plsy;

    for (var x = -2; x <= 2; x++) {
        for (var y = -2; y <= 2; y++) {
            var sx = plsx + x;
            var sy = plsy + y;
            if (sx >= 0 && sx < numSectorsX && sy >= 0 && sy < numSectorsY) {
                drawShapes(sectors[sy * numSectorsX + sx]);
            }
        }
    }
}

function screenToWorld(v) {
    return [
        v[0] + pl.x,
        v[1] + pl.y
    ]
}


function screenToWorldScaled(v) {
    return [
        (v[0] + pl.x) / scale,
        (v[1] + pl.y) / scale
    ]
}

function unscaleCoords(v) {
    return [
        (v[0] + canvasW / 2) / scale,
        (v[1] + canvasH / 3 * 2) / scale
    ];
}

function scaleCoords(v) {
    return [
        v[0] * scale - canvasW / 2,
        v[1] * scale - canvasW / 3 * 2
    ];

}