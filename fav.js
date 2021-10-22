'use strict';

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, '__esModule', {
  value: true
});

var Signal = /*#__PURE__*/function () {
  function Signal(data, sampleRate) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var min = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var max = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    _classCallCheck(this, Signal);

    if (data instanceof Array && data[0] instanceof Float32Array) {
      this.rank = 2;
    } else if (data instanceof Float32Array) {
      this.rank = 1;
    } else throw "invalid data type";

    this.data = data;
    this.sampleRate = sampleRate;
    this.type = type;
    if (min === null || max === null) this.computeRange();else {
      this.max = max;
      this.min = min;
    }
  }

  _createClass(Signal, [{
    key: "_computeRange1D",
    value: function _computeRange1D() {
      var max = this.data[0];
      var min = this.data[0];

      for (var i = 1; i < this.data.length; i++) {
        if (this.data[i] > max) {
          max = this.data[i];
        }

        if (this.data[i] < min) {
          min = this.data[i];
        }
      }

      this.max = max;
      this.min = min;
    }
  }, {
    key: "_computeRange2D",
    value: function _computeRange2D() {
      var max = this.data[0][0];
      var min = this.data[0][0];

      for (var i = 1; i < this.data.length; i++) {
        for (var j = 1; j < this.data[i].length; j++) {
          if (this.data[i][j] > max) {
            max = this.data[i][j];
          }

          if (this.data[i][j] < min) {
            min = this.data[i][j];
          }
        }
      }

      this.max = max;
      this.min = min;
    }
  }, {
    key: "computeRange",
    value: function computeRange() {
      if (this.type === Signal.TYPE_BINARY) {
        this.min = 0;
        this.max = 1;
      } else {
        if (this.rank === 1) this._computeRange1D();
        if (this.rank === 2) this._computeRange2D();
      }

      this.range = this.max - this.min;
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Signal(this.data.slice(), this.sampleRate, this.type, this.min, this.max);
    }
  }, {
    key: "map",
    value: function map(f) {
      var newType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var newMin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var newMax = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      return new Signal(this.rank == 2 ? this.data.map(function (x) {
        return x.map(f);
      }) : this.data.map(f), this.sampleRate, newType ? newType : this.type, newMin !== null ? newMin : this.min, newMax !== null ? newMax : this.max);
    }
  }, {
    key: "draw",
    value: function draw(target, style) {
      var samplingMethod = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "mean";
      target.display.draw(this, style, target, samplingMethod);
      return this;
    }
  }, {
    key: "length",
    get: function get() {
      return this.data.length;
    }
  }, {
    key: "nBands",
    get: function get() {
      if (this.rank == 1) return 1;else if (this.rank == 2) return this.data[0].length;else throw "Invalid signal dimensions";
    }
  }]);

  return Signal;
}();

Signal.TYPE_FLOAT = 0;
Signal.TYPE_INT = 1;
Signal.TYPE_BINARY = 2;
var signal = Signal;
var stats = {
  "mean": function mean(slice) {
    return slice.reduce(function (a, b) {
      return a + b;
    }) / slice.length;
  },
  "median": function median(slice) {
    var sorted = slice.slice(0).sort(function (a, b) {
      return a - b;
    });
    var mid = Math.floor(slice.length / 2);
    if (slice.length % 2 === 0) return (sorted[mid] + sorted[mid - 1]) / 2;else return sorted[mid];
  },
  "sample": function sample(slice) {
    return slice[Math.floor(slice.length / 2)];
  },
  "std": function std(slice) {
    var mean = slice.reduce(function (a, b) {
      return a + b;
    }) / slice.length;
    var diffs = slice.map(function (x) {
      return Math.pow(x - mean, 2);
    });
    return Math.sqrt(diffs.reduce(function (a, b) {
      return a + b;
    })) / slice.length;
  },
  "max": function max(slice) {
    return slice.reduce(function (a, b) {
      return Math.max(a, b);
    });
  },
  "min": function min(slice) {
    return slice.reduce(function (a, b) {
      return Math.min(a, b);
    });
  }
};
var unaryops = {
  "threshold": function threshold(th) {
    return this.map(function (x) {
      return x > th;
    }, 2, 0, 1);
  },
  "slice": function slice(from, to) {
    var unit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "samples";

    if (unit === "seconds") {
      from = Math.round(from * this.sampleRate);
      to = Math.round(to * this.sampleRate);
    }

    var clone = this.clone();
    clone.data = clone.data.slice(from, to);
    clone.computeRange();
    return clone;
  },
  "normalize": function normalize() {
    var _this = this;

    var newDesc = this.map(function (x) {
      return (x - _this.min) / _this.range;
    });
    newDesc.min = 0;
    newDesc.max = 1;
    return newDesc;
  },
  "offset": function offset(num) {
    return this.map(function (x) {
      return x + num;
    });
  },
  "log": function log() {
    return this.map(Math.log).computeRange();
  },
  "square": function square() {
    return this.map(function (x) {
      return Math.pow(x, 2);
    });
  },
  "pow": function pow(n) {
    return this.map(function (x) {
      return Math.pow(x, n);
    });
  },
  "exp": function exp() {
    return this.map(Math.exp);
  },
  "sqrt": function sqrt() {
    return this.map(Math.sqrt);
  },
  "abs": function abs() {
    return this.map(Math.abs);
  },
  "scale": function scale(num) {
    return this.map(function (x) {
      return x * num;
    });
  },
  "reflect": function reflect(num) {
    var _this2 = this;

    return this.map(function (x) {
      return _this2.max - x;
    });
  },
  "diff": function diff() {
    var _this3 = this;

    return this.map(function (x, i) {
      return i == 0 ? i : x - _this3.data[i - 1];
    }).computeRange();
  },
  "delay": function delay(n) {
    var _this4 = this;

    return this.map(function (x, i) {
      return i <= n ? 0 : _this4.data[i - n];
    }).computeRange();
  },
  "smooth": function smooth(n) {
    var _this5 = this;

    var stat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "mean";
    var nPrev = Math.floor(n / 2);
    var newDesc = this.map(function (x, i) {
      return i <= nPrev ? stats[stat](_this5.data.slice(0, n - i)) : stats[stat](_this5.data.slice(i - nPrev, i + n - nPrev));
    });
    newDesc.computeRange();
    return newDesc;
  },
  "schmitt": function schmitt(th0, th1) {
    var result = this.clone();
    var state = 0;

    for (var i = 0; i < this.length; i++) {
      var newState = state;
      if (state === 0 && this.data[i] > th0) newState = 1;else if (state === 1 && this.data[i] < th1) newState = 0;
      state = newState;
      this.data[i] = state;
    }

    return this;
  },
  "slide": function slide(up, down) {
    up = Math.max(up, 1);
    down = Math.max(down, 1);
    var previous = 0;
    var slide = 1;

    for (var i = 0; i < this.length; i++) {
      var current = this.data[i];
      if (current >= previous) slide = up;else slide = down;
      this.data[i] = previous + (current - previous) / slide;
      previous = this.data[i];
    }

    this.computeRange();
    return this;
  }
};
var unaryops_1 = unaryops;
var binaryops = {
  "checkSizes": function checkSizes(x, y) {
    if (x.data.length != y.data.length) {
      throw "Sizes do not match";
    } else return true;
  },
  "add": function add(desc) {
    if (this.checkSizes(this, desc)) return this.map(function (x, i) {
      return x + desc.data[i];
    });
  },
  "subtract": function subtract(desc) {
    if (this.checkSizes(this, desc)) return this.map(function (x, i) {
      return x - desc.data[i];
    });
  },
  "multiply": function multiply(desc) {
    if (this.checkSizes(this, desc)) return this.map(function (x, i) {
      return x * desc.data[i];
    });
  },
  "over": function over(desc) {
    if (this.checkSizes(this, desc)) return this.map(function (x, i) {
      return x / desc.data[i];
    });
  },
  "and": function and(desc) {
    if (this.checkSizes(this, desc)) return this.map(function (x, i) {
      return x && desc.data[i];
    });
  },
  "or": function or(desc) {
    if (this.checkSizes(this, desc)) return this.map(function (x, i) {
      return x || desc.data[i];
    });
  },
  "xor": function xor(desc) {
    if (this.checkSizes(this, desc)) return this.map(function (x, i) {
      return x == desc.data[i] ? 1 : 0;
    });
  }
};
var samplers = {
  "sample": function sample(step) {
    var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "mean";
    var newSize = Math.ceil(this.data.length / step);
    var newData = new Float32Array(newSize);
    var newRate = this.sampleRate / step;
    var ratio = this.data.length / step;

    for (var i = 0; i < newSize; i += 1) {
      var bucketStart = Math.floor(i * step);
      var bucketEnd = Math.floor((i + 1) * step);
      if (bucketStart > this.data.length - 1) bucketStart = this.data.length - 1;
      if (bucketEnd > this.data.length - 1) bucketEnd = this.data.length - 1;

      if (bucketStart === bucketEnd) {
        if (i > 0) newData[i] = newData[i - 1];
      } else newData[i] = stats[method](this.data.slice(bucketStart, bucketEnd));
    }

    return new signal(newData, newRate, this.type);
  }
};

var Layer = /*#__PURE__*/function () {
  _createClass(Layer, [{
    key: "hslToRgb",
    //http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
    value: function hslToRgb(h, s, l) {
      var r, g, b;

      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        var hue2rgb = function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
  }]);

  function Layer(type, canvas) {
    var margin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

    _classCallCheck(this, Layer);

    var drawFuncs = {
      "line": this.drawLine,
      "fill": this.drawFill,
      "wave": this.drawWave,
      "errorbar": this.drawError,
      "image": this.drawImage
    };
    this.draw = drawFuncs[type];
    this.canvas = canvas;
    this.context = canvas.getContext('max-2d');
    this.margin = margin;
    this.type = type;
  }

  _createClass(Layer, [{
    key: "_mapVal",
    value: function _mapVal(x, min, range, height) {
      return height * (x - min) / range;
    }
  }, {
    key: "clear",
    value: function clear() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "drawLine",
    value: function drawLine(desc, style) {
      if (desc.length !== this.canvas.width) {
        desc = desc.sample(desc.length / this.canvas.width);
      }

      var y0 = this._mapVal(desc.data[0], desc.min, desc.range, this.canvas.height - this.margin);

      this.context.moveTo(0, this.canvas.height - y0);

      for (var i = 1; i < desc.data.length; i++) {
        var y = this._mapVal(desc.data[i], desc.min, desc.range, this.canvas.height - this.margin);

        this.context.lineTo(i, this.canvas.height - y);
      }

      this.context.lineTo(desc.data.length, this.canvas.height - y0);
      this.context.strokeStyle = style;
      this.context.stroke();
    }
  }, {
    key: "drawWave",
    value: function drawWave(desc, style) {
      var _this6 = this;

      var step = desc.data.length / this.canvas.width;
      var min = desc.sample(step, "min");
      var max = desc.sample(step, "max");
      var amp = this.canvas.height / 2;

      if (typeof style === "string") {
        this.context.fillStyle = style;

        for (var i = 0; i < this.canvas.width; i++) {
          this.context.fillRect(i, (1 - max.data[i]) * amp, 1, Math.max(1, (max.data[i] - min.data[i]) * amp));
        }
      } else if (style instanceof Array) {
        style = style.map(function (x) {
          return x instanceof signal ? x.sample(x.length / _this6.canvas.width) : {
            data: Array(_this6.canvas.width).fill(x)
          };
        });

        for (var _i = 0; _i < this.canvas.width; _i++) {
          this.context.fillStyle = "hsl(" + style[0].data[_i] + "," + style[1].data[_i] + "%," + style[2].data[_i] + "%)";
          this.context.fillRect(_i, (1 - max.data[_i]) * amp, 1, Math.max(1, (max.data[_i] - min.data[_i]) * amp));
        }
      }
    }
  }, {
    key: "drawFill",
    value: function drawFill(desc, style) {
      if (desc.length !== this.canvas.width) {
        desc = desc.sample(desc.length / this.canvas.width);
      }

      this.context.fillStyle = style;

      for (var i = 1; i < desc.data.length; i++) {
        var y = this._mapVal(desc.data[i], desc.min, desc.range, this.canvas.height - this.margin);

        this.context.fillRect(i, this.canvas.height - y, 1, y);
      }
    }
  }, {
    key: "drawError",
    value: function drawError(desc, style) {
      var factor = desc.length / this.canvas.width;
      var desc_mean = desc.sample(factor, "mean").smooth(10);
      var desc_std = desc.sample(factor, "std").smooth(10);
      var upper = desc_mean.add(desc_std.scale(2));
      var lower = desc_mean.add(desc_std.scale(-2));
      var min = lower.min;
      var max = upper.max;
      var range = max - min;
      this.context.fillStyle = style;

      for (var i = 0; i < this.canvas.width; i++) {
        var up = this._mapVal(upper.data[i], min, range, this.canvas.height - this.margin);

        var down = this._mapVal(lower.data[i], min, range, this.canvas.height - this.margin);

        this.context.fillRect(i, this.canvas.height - up, 1, this.canvas.height - down);
      }
    }
  }, {
    key: "drawImage",
    value: function drawImage(desc) {
      if (desc.rank !== 2) throw "Trying to draw 1D signal as image";
      var tmp = document.createElement("canvas");
      var tmpContext = tmp.getContext('max-2d');
      tmp.width = desc.length;
      tmp.height = desc.nBands;
      var imageData = tmpContext.getImageData(0, 0, tmp.width, tmp.height);

      for (var i = 0; i < desc.nBands; i++) {
        var row = desc.nBands - i;

        for (var j = 0; j < desc.length; j++) {
          var val = desc.data[j][i];
          var rgb = this.hslToRgb(val, 0, val);
          var pos = (desc.nBands - i) * (desc.length * 4) + j * 4;
          imageData.data[pos] = rgb[0];
          imageData.data[pos + 1] = rgb[1];
          imageData.data[pos + 2] = rgb[2];
          imageData.data[pos + 3] = 255;
        }
      }

      tmpContext.putImageData(imageData, 0, 0);
      this.context.drawImage(tmp, 0, 0, this.canvas.width, this.canvas.height);
    }
  }]);

  return Layer;
}();

var Display = /*#__PURE__*/function () {
  function Display(jsui, firstLayerType) {
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    var margin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;

    _classCallCheck(this, Display);

    this.layers = [];
    this.margin = margin;
    this.width = width;
    this.height = height;
    this.display = this; //workaround for syntactic sugar

    this.jsui = jsui; // this.container = document.getElementById(container);
    // this.container.style.height = height+"px";
    // if(width!=null) this.container.style.width = width+"px";
    // while (this.container.hasChildNodes()) {
    //   this.container.removeChild(this.container.lastChild);
    // }

    this.addLayer(firstLayerType);
  }

  _createClass(Display, [{
    key: "addLayer",
    value: function addLayer(type) {
      // let canvas = document.createElement('canvas');
      var canvas = new MaxCanvas(this.jsui); // canvas.style.position = "absolute";
      // canvas.style.left = "0px";
      // canvas.style.top = "0px";
      // canvas.style.border = "thin dotted black";
      // canvas.style.zIndex = this.layers.length;

      canvas.height = this.height; // this.container.appendChild(canvas);

      var layer = new Layer(type, canvas, this.margin);
      layer.display = this;
      this[this.layers.length] = layer; // add array-style syntax sugar

      this.layers.push(layer);
    }
  }, {
    key: "draw",
    value: function draw(desc, style, layer) {
      if (layer === this) layer = this.layers[0]; // if width is not set, all layers will have the width of the first visualized descriptor

      if (this.width === null) {
        this.width = desc.length; // this.container.style.width = this.width+"px";

        var _iterator = _createForOfIteratorHelper(this.layers),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var l = _step.value;
            l.canvas.width = this.width;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        layer.canvas.width = this.width;
      }

      layer.canvas.height = this.height;
      layer.clear();
      layer.draw(desc, style);
    }
  }]);

  return Display;
}();

var display = Display;

for (var key in unaryops_1) {
  signal.prototype[key] = unaryops_1[key];
}

for (var key in binaryops) {
  signal.prototype[key] = binaryops[key];
}

for (var key in samplers) {
  signal.prototype[key] = samplers[key];
}

var api = {
  "Signal": signal,
  "Display": display
};
exports["default"] = api;
