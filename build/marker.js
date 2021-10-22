import "core-js/modules/es.array.concat";
import "core-js/modules/es.array.filter";
import "core-js/modules/es.array.map";
import "core-js/modules/es.array.sort";
import "core-js/modules/es.function.bind";

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Marker = function Marker(position) {
  var selected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  _classCallCheck(this, Marker);

  this.position = position;
  this.selected = selected;
};

Marker.prototype.valueOf = function () {
  return this.position;
};

var Markers = /*#__PURE__*/function () {
  function Markers(data, sampleRate) {
    var _this = this;

    _classCallCheck(this, Markers);

    this.data = data.map(function (m) {
      _newArrowCheck(this, _this);

      return new Marker(m);
    }.bind(this));
    this.sampleRate = sampleRate;
    this.selection = null;
    this.extent = [0, null];
  }

  _createClass(Markers, [{
    key: "draw",
    value: function draw(target, style) {
      target.display.draw_markers(this, style, target, "max");
      return this;
    }
  }, {
    key: "add",
    value: function add(data) {
      var _this2 = this;

      this.data = this.data.concat(data instanceof Array ? [data.map(function (pos) {
        _newArrowCheck(this, _this2);

        return new Marker(pos, false);
      }.bind(this))] : new Marker(data, false));
      this.data.sort();
      return this;
    }
  }, {
    key: "remove",
    value: function remove(data) {
      var _this3 = this;

      this.data = this.data.filter(function (x) {
        _newArrowCheck(this, _this3);

        return x !== data;
      }.bind(this));
      return this;
    }
  }, {
    key: "slice",
    value: function slice(from, to) {
      var _this4 = this;

      var newm = new Markers([], this.sampleRate);
      newm.data = this.data.filter(function (m) {
        _newArrowCheck(this, _this4);

        return m.position >= from && m.position <= to;
      }.bind(this));
      newm.extent = [from, this.extent[1] ? to - from : null];
      return newm;
    }
  }, {
    key: "length",
    get: function get() {
      return this.extent[1] ? this.extent[1] : this.data[this.data.length - 1].position;
    }
  }, {
    key: "size",
    get: function get() {
      return this.data.length;
    }
  }]);

  return Markers;
}();

module.exports = Markers;