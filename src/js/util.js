define(function (require, exports, module) {

    var randomRGB = function() {
        var r = 255 * Math.random() | 0;
        var g = 255 * Math.random() | 0;
        var b = 255 * Math.random() | 0;

        return 'rgb(' + [r,g,b].join(',') + ')';
    };

    var randomHSL = function() {
        var h = 360 * Math.random() | 0;
        var s = 100 + '%';
        var l = (90 + 10 * Math.random()) + '%';

        return 'rgb(' + [h,s,l].join(',') + ')';
    };

    exports.randomRGB = randomRGB;
    exports.randomHSL = randomHSL;
});