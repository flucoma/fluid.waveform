let Signal = require("@flucoma/fav/src/signal.js");
let Markers = require("./marker.js")
let unaryops = require("@flucoma/fav/src/unaryops.js");
let binaryops = require("@flucoma/fav/src/binaryops.js");
let samplers = require("@flucoma/fav/src/samplers.js");
let Display = require("./display-jsui.js")

unaryops['slice'] = function(from, to, unit = "samples"){
  if (unit === "seconds"){
    from = Math.round(from * this.sampleRate);
    to = Math.round(to * this.sampleRate);
  }
  let clone = this.clone();
  clone.data = clone.rank == 2 ? clone.data.map(s => s.slice(from,to)) : this.data.slice(from,to);//<-- diff 
  clone.computeRange();
  return clone;
}

for (var key in unaryops) {
  Signal.prototype[key] = unaryops[key];
}

for (var key in binaryops) {
  Signal.prototype[key] = binaryops[key];
}

// for (var key in samplers) {
//   Signal.prototype[key] = samplers[key];
// }
  
let stats = require("@flucoma/fav/src/stats.js");

Signal.prototype['sample']  = function(step, method = "mean"){
  let newSize = Math.ceil(this.data.length / step)
  let newData = new Array(newSize);
  let newRate = this.sampleRate / step;
  let ratio = this.data.length / step;
  for (let i = 0; i < newSize; i += 1) {
    let bucketStart = Math.floor(i * step);
    let bucketEnd = Math.floor((i+1) * step);
    if(bucketStart > this.data.length - 1 ) bucketStart = this.data.length -1;
    if(bucketEnd > this.data.length -1 ) bucketEnd = this.data.length -1;
    if(bucketStart === bucketEnd) {
      newData[i] = this.data[bucketStart];
    }
    else newData[i]  = stats[method](this.data.slice(bucketStart, bucketEnd));
  }
  const s= new Signal(newData, newRate, this.type);
  return s; 
}


module.exports = {"Signal":Signal, "Markers":Markers, "Display":Display};
