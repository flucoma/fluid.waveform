// import "core-js/stable";
// import "regenerator-runtime/runtime";
var Signal = require("./signal.js");

var Markers = require("./marker.js");

var unaryops = require("./unaryops.js");

var binaryops = require("./binaryops.js");

var samplers = require("./samplers.js");

var Display = require("./display-jsui.js");

for (var key in unaryops) {
  Signal.prototype[key] = unaryops[key];
}

for (var key in binaryops) {
  Signal.prototype[key] = binaryops[key];
}

for (var key in samplers) {
  Signal.prototype[key] = samplers[key];
}

module.exports = {
  "Signal": Signal,
  "Markers": Markers,
  "Display": Display
};