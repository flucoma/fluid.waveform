let Signal = require("./signal.js");
let stats = require("./stats.js");

module.exports = {
  "sample": function(step, method = "mean"){
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
        newData[i]  = i > 0 ? newData[i-1] : this.data[i];        
      }
      else newData[i]  = stats[method](this.data.slice(bucketStart, bucketEnd));
    }
    const s= new Signal(newData, newRate, this.type);
    return s; 
  }
};
