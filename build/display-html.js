import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.fill";
import "core-js/modules/es.array.from";
import "core-js/modules/es.array.is-array";
import "core-js/modules/es.array.iterator";
import "core-js/modules/es.array.map";
import "core-js/modules/es.array.slice";
import "core-js/modules/es.date.to-string";
import "core-js/modules/es.function.bind";
import "core-js/modules/es.function.name";
import "core-js/modules/es.object.define-property";
import "core-js/modules/es.object.to-string";
import "core-js/modules/es.regexp.to-string";
import "core-js/modules/es.string.iterator";
import "core-js/modules/web.dom-collections.iterator";

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Signal = require("./signal.js");

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
    this.context = canvas.getContext('2d');
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

      ;
      this.context.lineTo(desc.data.length, this.canvas.height - y0);
      this.context.strokeStyle = style;
      this.context.stroke();
    }
  }, {
    key: "drawWave",
    value: function drawWave(desc, style) {
      var _this = this;

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
          _newArrowCheck(this, _this);

          return x instanceof Signal ? x.sample(x.length / this.canvas.width) : {
            data: Array(this.canvas.width).fill(x)
          };
        }.bind(this));

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
      var tmpContext = tmp.getContext('2d');
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
  function Display(container, firstLayerType) {
    var width = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var height = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    var margin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;

    _classCallCheck(this, Display);

    this.layers = [];
    this.margin = margin;
    this.width = width;
    this.height = height;
    this.display = this; //workaround for syntactic sugar

    this.container = document.getElementById(container);
    this.container.style.height = height + "px";
    if (width != null) this.container.style.width = width + "px";

    while (this.container.hasChildNodes()) {
      this.container.removeChild(this.container.lastChild);
    }

    this.addLayer(firstLayerType);
  }

  _createClass(Display, [{
    key: "addLayer",
    value: function addLayer(type) {
      var canvas = document.createElement('canvas');
      canvas.style.position = "absolute";
      canvas.style.left = "0px";
      canvas.style.top = "0px";
      canvas.style.border = "thin dotted black";
      canvas.style.zIndex = this.layers.length;
      canvas.height = this.height;
      this.container.appendChild(canvas);
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
        this.width = desc.length;
        this.container.style.width = this.width + "px";

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

module.exports = Display;