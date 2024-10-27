//var uw = 38; //upwarp amount
var vy1 = 0; //y speed on frame of upwarp
var vf = 20; //velocity in direction of ledge
var rot = 0; //mario's rotation
var dland = 30; //minimum distance needed to land

var isDive = true;
var isMaximize = true;

document.getElementById('ymario').style.display = "none";
document.getElementById('ylabel').style.display = "none";

function updateLayout() {
    if (document.getElementById('max').checked) {
        isMaximize = true;
        document.getElementById('MaxResults').style.display = "block";
        document.getElementById('PossibleResults').style.display = "none";
        document.getElementById('ymario').style.display = "none";
        document.getElementById('ylabel').style.display = "none";
    } else {
        isMaximize = false;
        document.getElementById('MaxResults').style.display = "none";
        document.getElementById('PossibleResults').style.display = "block";
        document.getElementById('ymario').style.display = "";
        document.getElementById('ylabel').style.display = "";
    }
    if (document.getElementById('dyes').checked) {
        isDive = true;
        document.getElementById('hvellabel').innerHTML = "Horizontal velocity: "
    }
    else {
        isDive = false;
        document.getElementById('hvellabel').innerHTML = "Horizontal velocity toward ledge: "
    }
}

function run() {
    vy1 = parseFloat(document.getElementById('vvel').value);
    rot = parseFloat(document.getElementById('rot').value);
    var hvel = parseFloat(document.getElementById('hvel').value);
    if (isDive) {
        vf = hvel * Math.cos(rot * Math.PI / 180);
    }
    else {
        vf = hvel;
    }
    var yplat = parseFloat(document.getElementById('yplat').value);
    var ymario = parseFloat(document.getElementById('ymario').value);
    console.log(vy1);
    console.log(vf);
    console.log(rot);
    dland = 30 * Math.cos(((rot + 60) % 120 - 60) * Math.PI / 180);

    if (isMaximize) {
        var data = getMaxUpwarp();
        document.getElementById('uw').value = round(data[0], 3);
        document.getElementById('uwi').value = round(data[0] + vy1, 3);
        document.getElementById('dist').value = round(data[1], 5);
        document.getElementById('dist2').value = round(data[1] + vf, 5);
        document.getElementById('ypos').value = round(yplat - data[0] - vy1, 3);
    }
    else {
        var data = willUpwarp(yplat - (ymario + vy1));
        document.getElementById('poss').value = data[0];
        if (data[0]) {
            document.getElementById('dist3').value = round(data[1] + vf, 5);
            document.getElementById('dist4').value = round(dland + 2 * vf, 5);
        }
        else {
            document.getElementById('dist3').value = "N/A";
            document.getElementById('dist4').value = "N/A";
        }
    }
}

function round(num, places) {
    return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
}

function getMaxUpwarp() {
    var low = 0;
    var high = 40;
    var mid = 40;
    var best = 0;
    var best_d1 = 55;

    while (high - low > .001) {
        mid = (high + low) / 2;
        if (willUpwarp(mid)[0]) {
            low = mid;
            high = high;
            best = mid;
            best_d1 = willUpwarp(mid)[1];
        }
        else {
            low = low;
            high = mid;
        }
    }
    //console.log(best);
    return [best, best_d1];
}

function willUpwarp(uw) {
    if (uw >= 40) {
        return [false, 'N/A'];
    }
    var h0 = uw + vy1; //height of ledge above Mario the frame before upwarp
    var hdiff = 65 - h0;
    var d0;
    if (h0 < 10) {
        d0 = dland;
    }
    else if (h0 > 55) {
        d0 = 55;
    }
    else {
        d0 = Math.max(dland, Math.sqrt(55 * 55 - hdiff * hdiff)); //closest Mario can be on frame before upwarp
    }
    var d1 = d0 - vf;
    //console.log("uw: " + uw);
    //console.log("h0: " + uw);
    //console.log("d0: " + d0);
    //console.log("d1: " + d1);
    //console.log("dland: " + dland);
    return [d1 <= dland, d0]
}

console.log(getMaxUpwarp());