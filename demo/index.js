var iframe = document.querySelector("iframe");
iframeOverlay.createOverlay(iframe);

var poster = new Poster(iframe.contentWindow);

var settings = [
    "showVertices", "showEdges", "showFaces", "opaque", "showNormals", "showLabels"
];

settings.forEach(function (name) {
    var id = "object_" + name;
    $("#" + id).click(function () {
        poster.post(id, this.checked);
    });
});

settings.forEach(function (name) {
    var id = "global_" + name;
    $("#" + id).click(function () {
        poster.post(id, this.checked);
    });
});

$("#override").click(function () {
    poster.post("override", this.checked);
});
