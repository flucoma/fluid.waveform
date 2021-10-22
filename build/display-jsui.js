import "core-js/modules/es.symbol";
import "core-js/modules/es.symbol.description";
import "core-js/modules/es.symbol.iterator";
import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.fill";
import "core-js/modules/es.array.for-each";
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
import "core-js/modules/web.dom-collections.for-each";
import "core-js/modules/web.dom-collections.iterator";

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Signal = require('./signal.js'); // Lightest-weight wrapping around MGraphics possible, to allow for layers to draw into sub-regions of an MGrpahics using function calls that match the HTMLContext names


var SubContext = /*#__PURE__*/function () {
  _createClass(SubContext, [{
    key: "_translate",
    value: function _translate(x, y) {
      return [x + this.range[0] + this.layer.margin / 2, y + this.range[1] + this.layer.margin / 2];
    }
  }]);

  function SubContext(layer, range) {
    _classCallCheck(this, SubContext);

    range = range ? range : [0, 0, layer.jsui.getWidth(), layer.jsui.getHeight()];
    if (!(range instanceof Array) && !range.length === 4) throw 'Invalid range';
    this.range = range;
    this.fillStyle = [0, 0, 0, 0];
    this.strokeStyle = [0, 0, 0, 1];
    this.layer = layer;
  }

  _createClass(SubContext, [{
    key: "lineTo",
    value: function lineTo(x, y) {
      var _this$mg;

      (_this$mg = this.mg).line_to.apply(_this$mg, _toConsumableArray(this._translate(x, y)));
    }
  }, {
    key: "moveTo",
    value: function moveTo(x, y) {
      var _this$mg2;

      (_this$mg2 = this.mg).move_to.apply(_this$mg2, _toConsumableArray(this._translate(x, y)));
    }
  }, {
    key: "rect",
    value: function rect(x, y, w, h) {
      var _this$mg3;

      (_this$mg3 = this.mg).rectangle.apply(_this$mg3, _toConsumableArray(this._translate(x, y)).concat([w, h]));
    }
  }, {
    key: "fillRect",
    value: function fillRect(x, y, w, h) {
      var _this$mg4;

      (_this$mg4 = this.mg).set_source_rgba.apply(_this$mg4, _toConsumableArray(this.fillStyle)); // this.mg.set_source_rgba(0, 0, 0, 1)
      // this.mg.rectangle(x + this.range[0], y + this.range[1], w, h)


      this.rect(x, y, w, h);
      this.mg.fill();
    }
  }, {
    key: "fill",
    value: function fill() {
      var _this$mg5;

      (_this$mg5 = this.mg).set_source_rgba.apply(_this$mg5, _toConsumableArray(this.fillStyle));

      this.mg.fill();
    }
  }, {
    key: "stroke",
    value: function stroke() {
      var _this$mg6;

      (_this$mg6 = this.mg).set_source_rgba.apply(_this$mg6, _toConsumableArray(this.strokeStyle));

      this.mg.stroke();
    }
  }, {
    key: "lineWidth",
    value: function lineWidth(x) {
      this.mg.set_line_width(x);
    } // taken from the C74 Canvas adaptor by Silvio C. Haedrich

  }, {
    key: "scale",
    value: function scale(x, y) {
      this.mg.scale(x, y);
    }
  }, {
    key: "rotate",
    value: function rotate(x) {
      this.mg.rotate(x);
    }
  }, {
    key: "translate",
    value: function translate(x, y) {
      this.mg.translate(x, y);
    }
  }, {
    key: "transform",
    value: function transform(m11, m12, m21, m22, dx, dy) {
      this.mg.transform(m11, m12, m21, m22, dx, dy);
    }
  }, {
    key: "setTransform",
    value: function setTransform(m11, m12, m21, m22, dx, dy) {
      this.mg.set_matrix(m11, m12, m21, m22, dx, dy);
    }
  }, {
    key: "drawImage",
    value: function drawImage(image, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
      if (!(image instanceof Image)) {
        post('drawImage: TYPE_MISMATCH_ERR');
        return;
      } else if (image.size[0] <= 0 || image.size[1] <= 0) {
        post('drawImage: INVALID_STATE_ERROR');
        return;
      } else if (arg8) {
        var sx = arg1;
        var sy = arg2;
        var sw = arg3;
        var sh = arg4;

        var pos = this._translate(arg5, arg6);

        var dx = pos[0];
        var dy = pos[1];
        var dw = arg7;
        var dh = arg8;
      } else if (arg4) {
        var _pos = this._translate(arg1, arg2);

        var dx = _pos[0];
        var dy = _pos[1];
        var dw = arg3;
        var dh = arg4;
        var sx = 0;
        var sy = 0;
        var sw = image.size[0];
        var sh = image.size[1];
      } else if (arg2) {
        var _pos2 = this._translate(arg1, arg2);

        var dx = _pos2[0];
        var dy = _pos2[1];
        var dw = image.size[0];
        var dh = image.size[1];
        var sx = 0;
        var sy = 0;
        var sw = image.size[0];
        var sh = image.size[1];
      } else {
        post('drawImage: missing arguments\n');
        return;
      }

      if (sx < 0 || sy < 0 || sw <= 0 || sh <= 0 || sx + sw > image.size[0] || sy + sh > image.size[1]) {
        post('drawImage: INDEX_SIZE_ERR');
        return;
      }

      var matrix = this.mg.get_matrix();

      if (matrix[1] == 0 && matrix[2] == 0) {
        this.mg.set_source_rgba(1.0, 1.0, 1.0, 1.0);
        this.mg.image_surface_draw(image, sx, sy, sw, sh, dx, dy, dw, dh);
      } else {
        var pat = this.mg.pattern_create_for_surface(image);
        this.mg.save();
        this.mg.translate(dx, dy);
        this.mg.scale(dw / image.size[0], dh / image.size[1]);
        this.mg.rectangle(0, 0, image.size[0], image.size[1]);
        this.mg.scale(image.size[0] / sw, image.size[1] / sh);
        this.mg.translate(-sx, -sy);
        this.mg.set_source(pat);
        this.mg.fill_with_alpha(this.globalAlpha);
        this.mg.restore();
      }
    }
  }, {
    key: "width",
    get: function get() {
      return this.range[2] - this.layer.margin;
    }
  }, {
    key: "height",
    get: function get() {
      return this.range[3] - this.layer.margin;
    }
  }, {
    key: "mg",
    get: function get() {
      return this.layer.jsui.getContext();
    }
  }]);

  return SubContext;
}();

var Layer = /*#__PURE__*/function () {
  _createClass(Layer, [{
    key: "hslToRgb",
    // http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
    value: function hslToRgb(h, s, l) {
      var r, g, b;

      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        var hue2rgb = function hue2rgb(p, q, t) {
          if (t < 0) {
            t += 1;
          }

          if (t > 1) {
            t -= 1;
          }

          if (t < 1 / 6) {
            return p + (q - p) * 6 * t;
          }

          if (t < 1 / 2) {
            return q;
          }

          if (t < 2 / 3) {
            return p + (q - p) * (2 / 3 - t) * 6;
          }

          return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [r, g, b];
    }
  }]);

  function Layer(type, jsui) {
    var margin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    var range = arguments.length > 3 ? arguments[3] : undefined;

    _classCallCheck(this, Layer);

    var drawFuncs = {
      'line': this.drawLine,
      'fill': this.drawFill,
      'wave': this.drawWave,
      'errorbar': this.drawError,
      'image': this.drawImage,
      'marker': this.drawMarker
    };
    if (!range) range = null;
    this.draw = drawFuncs[type];
    this.scale = 1.0;
    this.y = 0;
    this.jsui = jsui;
    this.context = new SubContext(this, range);
    this.canvas = {
      jsui: jsui,
      layer: this,

      get width() {
        return this.layer.context.width;
      },

      get height() {
        return this.layer.context.height;
      }

    };
    this.margin = margin ? margin : 0;
    this.type = type;
  }

  _createClass(Layer, [{
    key: "_mapVal",
    value: function _mapVal(x, min, range, height) {
      return height * (x - min) / range;
    }
  }, {
    key: "clear",
    value: function clear() {// this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "drawLine",
    value: function drawLine(desc, style) {
      var _this = this;

      var vstep = this.canvas.height / desc.length;
      desc = desc.rank === 1 ? [desc] : desc.data.map(function (d) {
        _newArrowCheck(this, _this);

        return new Signal(d, desc.sampleRate, desc.type);
      }.bind(this));
      var length = desc.rank == 1 ? desc.length : desc.nBands;
      desc.forEach(function (d, i) {
        _newArrowCheck(this, _this);

        if (d.length !== this.canvas.width) {
          d = d.sample(d.length / this.canvas.width);
        }

        var amp = vstep * (i + 1);
        d.computeRange();

        var y0 = this._mapVal(d.data[0], d.min, d.range, vstep - this.margin); // this.context.moveTo(0, this.canvas.height - y0)


        this.context.moveTo(0, amp - y0);

        for (var j = 1; j < d.data.length; j++) {
          var y = this._mapVal(d.data[j], d.min, d.range, vstep - this.margin);

          this.context.lineTo(j, amp - y);
        }

        ;
        this.context.lineTo(d.data.length, amp - y0);
        this.context.lineWidth(2);
        this.context.strokeStyle = style['color'];
        this.context.stroke();
      }.bind(this));
    }
  }, {
    key: "drawWave",
    value: function drawWave(desc, style) {
      var length = desc.rank == 1 ? desc.length : desc.nBands;
      var amp = this.canvas.height / 2;
      var ctx = this.context;
      ctx.fillStyle = style.color;

      if (desc.rank === 1) {
        var step = desc.length / this.canvas.width;

        var _amp = this.canvas.height / 2;

        var min = desc.sample(step, 'min');
        var max = desc.sample(step, 'max');

        for (var i = 0; i < this.canvas.width; i++) {
          ctx.fillRect(i, (1 - max.data[i]) * _amp, 1, Math.max(1, (max.data[i] - min.data[i]) * _amp));
        }
      } else {
        var _amp2 = this.canvas.height / (2 * desc.length);

        var vstep = this.canvas.height / desc.length;

        for (var _i = 0; _i < desc.length; _i++) {
          var thisDesc = new Signal(desc.data[_i], desc.sampleRate, 'wave');

          var _step = thisDesc.length / this.canvas.width;

          var _max = thisDesc.abs().sample(_step, 'max');

          for (var j = 0; j < this.canvas.width; j++) {
            ctx.fillRect(j, (1 - _max.data[j]) * _amp2 + vstep * _i, 1, Math.max(1, _max.data[j] * vstep));
          }
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
      var desc_mean = desc.sample(factor, 'mean').smooth(10);
      var desc_std = desc.sample(factor, 'std').smooth(10);
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
      if (desc.rank !== 2) {
        throw 'Trying to draw 1D signal as image';
      }

      desc = desc.offset(1e-6).log().normalize();
      var imageData = new Image(desc.length, desc.nBands);

      for (var i = 0; i < desc.nBands; i++) {
        var row = desc.nBands - i;

        for (var j = 0; j < desc.length; j++) {
          var val = desc.data[j][i];
          var rgb = this.hslToRgb(val, 0, val);
          imageData.setpixel(j, desc.nBands - i, rgb[0], rgb[1], rgb[2], 1);
        }
      }

      this.context.drawImage(imageData, 0, 0, this.canvas.width, this.canvas.height);
    }
  }]);

  return Layer;
}();

var MarkerLayer = /*#__PURE__*/function () {
  function MarkerLayer(type, jsui, refLayer) {
    var margin = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 10;
    var range = arguments.length > 4 ? arguments[4] : undefined;

    _classCallCheck(this, MarkerLayer);

    if (!range) range = null;
    this.scale = 1.0;
    this.y = 0;
    this.jsui = jsui;
    this.context = new SubContext(this, range);
    this.canvas = {
      jsui: jsui,
      layer: this,

      get width() {
        return this.layer.context.width;
      },

      get height() {
        return this.layer.context.height;
      }

    };
    this.refLayer = refLayer ? refLayer : null;
    this.margin = margin ? margin : 0;
  }

  _createClass(MarkerLayer, [{
    key: "draw",
    value: function draw(desc, style) {
      var extent = desc.length;
      var factor = extent / this.canvas.width;
      var offset = desc.extent[0];

      for (var i = 0; i < desc.size; i++) {
        var pos = (desc.data[i].position - offset) / factor | 0;
        var color = desc.data[i].selected ? style.selectedcolor : style.color;
        this.context.fillStyle = color; // little triangle

        this.context.moveTo(pos - 10, 0);
        this.context.lineTo(pos + 10, 0);
        this.context.lineTo(pos, 10);
        this.context.lineTo(pos - 10, 0);
        this.context.fill(); // marker line

        this.context.fillStyle = color;
        this.context.fillRect(pos, 0, 1, this.canvas.height);
      }
    }
  }, {
    key: "search",
    value: function search(desc, x) {
      var extent = desc.length;
      var factor = extent / this.canvas.width;
      var offset = desc.extent[0];
      var pos = (x + this.margin / 2) * factor | 0;
      post('sear\n');

      for (var i = 0; i < desc.data.length; i++) {
        var y = desc.data[i].position - offset;
        desc.data[i].selected = pos > y - 10 * factor && pos < y + 10 * factor;

        if (desc.data[i].selected) {
          post("yaya\n");
          return desc.data[i];
        }
      }

      return null;
    }
  }]);

  return MarkerLayer;
}();

var Display = /*#__PURE__*/function () {
  function Display(jsui, firstLayerType, width, height) {
    var margin = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 10;
    var range = arguments.length > 5 ? arguments[5] : undefined;

    _classCallCheck(this, Display);

    this.layers = [];
    this.markerLayers = [];
    this.margin = margin;
    this.width = width;
    this.height = height;
    this.display = this; // workaround for syntactic sugar

    this.scale = 1;
    this.y = 0;
    this.jsui = jsui;
    this.canvas = {
      width: width,
      height: height
    }; // this.container = document.getElementById(container);
    // this.container.style.height = height+"px";
    // if(width!=null) this.container.style.width = width+"px";
    // while (this.container.hasChildNodes()) {
    //   this.container.removeChild(this.container.lastChild);
    // }

    this.addLayer(firstLayerType, margin, range);
  }

  _createClass(Display, [{
    key: "setOffset",
    value: function setOffset(n) {
      this.y = n;
    }
  }, {
    key: "setScale",
    value: function setScale(x) {
      this.scale = x;
    }
  }, {
    key: "addLayer",
    value: function addLayer(type) {
      var margin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      var range = arguments.length > 2 ? arguments[2] : undefined;
      // let canvas = document.createElement('canvas');
      // let canvas = new MaxCanvas(this.jsui);
      // canvas.style.position = "absolute";
      // canvas.style.left = "0px";
      // canvas.style.top = "0px";
      // canvas.style.border = "thin dotted black";
      // canvas.style.zIndex = this.layers.length;
      // canvas.height = this.height;
      // this.container.appendChild(canvas);    
      var f = type === 'marker' ? MarkerLayer : Layer;
      var layer = new f(type, this.jsui, this.margin, range);
      layer.display = this;
      this[this.layers.length] = layer; // add array-style syntax sugar

      this.layers.push(layer);
    }
  }, {
    key: "draw",
    value: function draw(desc, style, layer) {
      if (layer === this) {
        layer = this.layers[0];
      } //  if width is not set, all layers will have the width of the first visualized descriptor
      // if (this.width === null){
      //   this.width = desc.length;
      //    this.container.style.width = this.width+"px";
      //   for(let l of this.layers){
      //     l.canvas.width = this.jsui.box.size[0];
      //   }
      // }
      // else {
      //   layer.canvas.width = this.width;
      // }
      // layer.canvas.height = this.height;
      // layer.clear();


      layer.draw(desc, style);
    }
  }]);

  return Display;
}();

module.exports = Display;