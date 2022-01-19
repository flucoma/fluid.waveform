let Signal = require("@flucoma/fav/src/signal.js");
let Markers = require("./marker.js")
let unaryops = require("@flucoma/fav/src/unaryops.js");
let binaryops = require("@flucoma/fav/src/binaryops.js");
let samplers = require("@flucoma/fav/src/samplers.js");
let Display = require("./display-jsui.js")

for (var key in unaryops) {
  Signal.prototype[key] = unaryops[key];
}

for (var key in binaryops) {
  Signal.prototype[key] = binaryops[key];
}

for (var key in samplers) {
  Signal.prototype[key] = samplers[key];
}

module.exports = {"Signal":Signal, "Markers":Markers, "Display":Display};
