let Signal = require('./signal.js')

// Lightest-weight wrapping around MGraphics possible, to allow for layers to draw into sub-regions of an MGrpahics using function calls that match the HTMLContext names
class SubContext {
  _translate (x, y) {
    return [
      (x + this.range[0]),// + this.layer.margin / 2) | 0,
      (y + this.range[1])// + this.layer.margin / 2)| 0
    ] 
  };

  constructor (layer, range) {
    range = range ? range : [0, 0, layer.jsui.getWidth(), layer.jsui.getHeight()]
    if (!(range instanceof Array) && !range.length === 4) throw 'Invalid range'
    this.range = range    
    this.layer = layer
    this.fillStyle = [0, 0, 0, 1]
    this.stroke_style = [0, 0, 0, 1]    
  }

  set strokeStyle(s) { this.mg.set_source_rgba(...s); this.stroke_style = s; }
  get strokeStyle()  {return this.stroke_style }
  get width () { return (this.range[2] - this.layer.margin) | 0 };
  get height () { return (this.range[3] - this.layer.margin) | 0  };
  get mg() {return this.layer.jsui.getContext()}

  lineTo (x, y) { this.mg.line_to(...this._translate(x, y)) }
  moveTo (x, y) { this.mg.move_to(...this._translate(x, y)) }
  rect (x, y, w, h) { this.mg.rectangle(...this._translate(x, y), w, h) }
  fillRect (x, y, w, h) {
    this.mg.set_source_rgba(...this.fillStyle)
    // this.mg.set_source_rgba(0, 0, 0, 1)
    // this.mg.rectangle(x + this.range[0], y + this.range[1], w, h)
    this.rect(x, y, w, h)
    this.mg.fill()
  }
  fill () { this.mg.set_source_rgba(...this.fillStyle); this.mg.fill() }
  stroke () { /*this.mg.set_source_rgba(...this.strokeStyle);*/ this.mg.stroke() }
  lineWidth (x) { this.mg.set_line_width(x) }

  // taken from the C74 Canvas adaptor by Silvio C. Haedrich
  scale (x, y) { this.mg.scale(x, y) }

  rotate (x) { this.mg.rotate(x) }

  translate (x, y) { this.mg.translate(x, y) }

  transform (m11, m12, m21, m22, dx, dy) { this.mg.transform(m11, m12, m21, m22, dx, dy) }

  setTransform (m11, m12, m21, m22, dx, dy) {
    this.mg.set_matrix(m11, m12, m21, m22, dx, dy)
  }

  drawImage (image, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) {
    if (!(image instanceof Image)) {
      post('drawImage: TYPE_MISMATCH_ERR')
      return
    } else if (image.size[0] <= 0 || image.size[1] <= 0) {
      post('drawImage: INVALID_STATE_ERROR')
      return
    } else if (arg8) {
      var sx = arg1
      var sy = arg2
      var sw = arg3
      var sh = arg4
      let pos = this._translate(arg5, arg6)
      var dx = pos[0]
      var dy = pos[1]
      var dw = arg7
      var dh = arg8
    } else if (arg4) {
      let pos = this._translate(arg1, arg2)
      var dx = pos[0]
      var dy = pos[1]
      var dw = arg3
      var dh = arg4
      var sx = 0
      var sy = 0
      var sw = image.size[0]
      var sh = image.size[1]
    } else if (arg2) {
      let pos = this._translate(arg1, arg2)
      var dx = pos[0]
      var dy = pos[1]
      var dw = image.size[0]
      var dh = image.size[1]
      var sx = 0
      var sy = 0
      var sw = image.size[0]
      var sh = image.size[1]
    } else {
      post('drawImage: missing arguments\n')
      return
    }
    if (sx < 0 || sy < 0 || sw <= 0 || sh <= 0 || (sx + sw) > image.size[0] || (sy + sh) > image.size[1]) {
      post('drawImage: INDEX_SIZE_ERR')
      return
    }
    var matrix = this.mg.get_matrix()

    if (matrix[1] == 0 && matrix[2] == 0) {
      this.mg.set_source_rgba(1.0, 1.0, 1.0, 1.0)
      this.mg.image_surface_draw(image, sx, sy, sw, sh, dx, dy, dw, dh)
    } else {
      var pat = this.mg.pattern_create_for_surface(image)
      this.mg.save()
      this.mg.translate(dx, dy)
      this.mg.scale(dw / image.size[0], dh / image.size[1])
      this.mg.rectangle(0, 0, image.size[0], image.size[1])
      this.mg.scale(image.size[0] / sw, image.size[1] / sh)
      this.mg.translate(-sx, -sy)
      this.mg.set_source(pat)
      this.mg.fill_with_alpha(this.globalAlpha)
      this.mg.restore()
    }
  }
}

class Layer {
  // http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
  hslToRgb (h, s, l) {
    var r,
      g,
      b

    if (s == 0) {
      r = g = b = l // achromatic
    } else {
      var hue2rgb = function hue2rgb (p, q, t) {
        if (t < 0) {
          t += 1
        }
        if (t > 1) {
          t -= 1
        }
        if (t < 1 / 6) {
          return p + (q - p) * 6 * t
        }
        if (t < 1 / 2) {
          return q
        }
        if (t < 2 / 3) {
          return p + (q - p) * (2 / 3 - t) * 6
        }
        return p
      }

      var q = l < 0.5
        ? l * (1 + s)
        : l + s - l * s
      var p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }
    return [r, g, b]
  }

  constructor (type, jsui, margin = 0, range) {
    const drawFuncs = {
      'line': this.drawLine,
      // 'fill': this.drawFill,
      'wave': this.drawPeaks,
      // 'errorbar': this.drawError,
      'image': this.drawImage,
      // 'marker': this.drawMarker
    }
    
    const renderFuncs = {
      'line': ctx => {ctx.stroke()}, 
      'wave': ctx => {ctx.image_surface_draw(this.img)},
      'image': ctx =>{ctx.image_surface_draw(this.img)} 
    }
    
    if (!range) range = null
    
    this.draw = drawFuncs[type]
    this.render = renderFuncs[type]
    this.scale = 1.0
    this.y = 0
    this.jsui = jsui
    this.context = new SubContext(this, range)    
    this.canvas = {
      jsui: jsui,
      layer: this,
      get width () { return this.layer.context.width },
      get height () { return this.layer.context.height }
    }

    this.margin = 0 //margin ? margin : 0
    this.type = type
  }
  
  setRange(range)
  {
    this.context = new SubContext(this,range); 
  }
  
  _mapVal (x, min, range, height) {
    return height * (x - min) / range
  }
  clear () {
    // this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawLine (desc, style) {
      if (desc.length  !==  this.canvas.width) {      
        desc = desc.sample(desc.length / this.canvas.width)     
      } 
      desc.computeRange(); 
      this.context.lineWidth(2); 
      this.context.strokeStyle = style['color']
      let y0 = this._mapVal(desc.data[0], desc.min, desc.range, this.canvas.height - this.margin) | 0;
      this.context.moveTo(0, this.canvas.height - y0)
      for (let j = 1; j < desc.data.length; j++) {
        let y = this._mapVal(desc.data[j], desc.min, desc.range, this.canvas.height - this.margin) |0;
        this.context.lineTo(j, this.canvas.height - y)
      };
      this.context.lineTo(desc.data.length, this.canvas.height - y0)
      this.context.stroke();      
  }
  
  drawPeaks(desc,style)
  {
    //ghastly way of seeing if we have cached peaks or not 
    //todo: make less ghastly
    if(!Array.isArray(desc) && desc.length !== 2) desc = [desc,desc]; 
     
    let length = desc[0].length; 
    let amp = this.canvas.height / 2
    let ctx = this.context
    let step = length / this.canvas.width; 
    let min = desc[0].sample(step,'min'); 
    let max = desc[1].sample(step,'max'); 
    ctx.fillStyle = style.color; 
    for (let i = 0; i < this.canvas.width; i++) {
      ctx.fillRect(i, (1 - max.data[i]) * amp, 1, Math.max(1, (max.data[i] - min.data[i]) * amp))
    }
   
  }
    
  drawWave (desc, style) {
    let length = desc.rank == 1 ? desc.length : desc.nBands
    let amp = this.canvas.height / 2
    let ctx = this.context
    
    ctx.fillStyle = style.color    
    if (desc.rank === 1) {
      let step = (desc.length) / this.canvas.width
      let amp = this.canvas.height / 2
      let min = desc.sample(step, 'min')
      let max = desc.sample(step, 'max')      
      for (let i = 0; i < this.canvas.width; i++) {
        ctx.fillRect(i, (1 - max.data[i]) * amp, 1, Math.max(1, (max.data[i] - min.data[i]) * amp))
      }
    } else {
      let amp = this.canvas.height / (2 * desc.length)
      let vstep = this.canvas.height / desc.length
      for (let i = 0; i < desc.length; i++) {
        let thisDesc = new Signal(desc.data[i], desc.sampleRate, 'wave')
        let step = (thisDesc.length) / this.canvas.width
        let max = thisDesc.abs().sample(step, 'max')
        for (let j = 0; j < this.canvas.width; j++) {
          ctx.fillRect(j,((1 - max.data[j]) * amp) + (vstep * i), 1, Math.max(1, max.data[j]* vstep))       
        }
      }
    }
  }

  drawFill (desc, style) {
    if (desc.length !== this.canvas.width) {
      desc = desc.sample(desc.length / this.canvas.width)
    }
    this.context.fillStyle = style
    for (let i = 1; i < desc.data.length; i++) {
      let y = this._mapVal(desc.data[i], desc.min, desc.range, this.canvas.height - this.margin)
      this.context.fillRect(i, this.canvas.height - y, 1, y)
    }
  }

  drawError (desc, style) {    
    let factor = desc.length / this.canvas.width    
    let desc_mean = desc.sample(factor, 'mean').smooth(10)
    let desc_std = desc.sample(factor, 'std').smooth(10)
    let upper = desc_mean.add(desc_std.scale(2))
    let lower = desc_mean.add(desc_std.scale(-2))

    let min = lower.min
    let max = upper.max
    let range = max - min

    this.context.fillStyle = style
    for (let i = 0; i < this.canvas.width; i++) {
      let up = this._mapVal(upper.data[i], min, range, this.canvas.height - this.margin)
      let down = this._mapVal(lower.data[i], min, range, this.canvas.height - this.margin)
      this.context.fillRect(i, this.canvas.height - up, 1, this.canvas.height - down)
    }
  }

  drawImage (desc) {
    if (desc.rank !== 2) {
      throw 'Trying to draw 1D signal as image'
    }
    desc = desc.offset(1e-6).log().normalize();     
    
    //orientation is actually flipped wrt to what Fav.js assumes
    let len = desc.nBands; 
    let bands = desc.length; 
    
    let imageData = new Image(len, bands)
    
    for (let i = 0; i < bands; i++) {
      for (let j = 0; j < len; j++) {
        let val = desc.data[i][j]
        let rgb = this.hslToRgb(val, 0, val)
        imageData.setpixel(j, bands - i, rgb[0], rgb[1], rgb[2], 1)
      }
    }

    this.context.drawImage(imageData, 0, 0, this.canvas.width, this.canvas.height)
  }
}


class MarkerLayer {
  constructor (type, jsui, refLayer, margin = 0, range) {
    if (!range) range = null
    this.scale = 1.0
    this.y = 0
    this.jsui = jsui
    this.context = new SubContext(this, range)    
    this.canvas = {
      jsui: jsui,
      layer: this,
      get width () { return this.layer.context.width },
      get height () { return this.layer.context.height }
    }
    this.refLayer = refLayer ? refLayer : null; 
    this.margin = margin ? margin : 0
  }
  
  setRange(range)
  {
    this.context = new SubContext(this,range); 
  }


  draw (desc, style) {
    let extent = desc.length
    let factor = extent / this.canvas.width
    let offset = desc.extent[0]
    for (let i = 0; i < desc.size; i++) {
      let pos = ((desc.data[i].position - offset) / factor) | 0
      let color = desc.data[i].selected ? style.selectedcolor : style.color
      this.context.fillStyle = color      
      // little triangle
      this.context.moveTo(pos - 10, 0)
      this.context.lineTo(pos + 10, 0)
      this.context.lineTo(pos, 10)
      this.context.lineTo(pos - 10, 0)
      this.context.fill()      
      // marker line
      this.context.fillStyle = color  
      this.context.fillRect(pos, 0, 1, this.canvas.height)
    }
  }
  
  search(desc, x)
  {
    let extent = desc.length
    let factor = extent / this.canvas.width 
    let offset = desc.extent[0]
    let pos = ((x + this.margin/2) * factor) | 0; 
    for(let i = 0; i < desc.data.length; i++)
    {
      let y = desc.data[i].position - offset
        desc.data[i].selected = pos > y  - (10 * factor) && pos < y + (10 * factor)       
        if(desc.data[i].selected)
        { 
          return  desc.data[i]          
        }
    }  
    return null    
  }
}


class Display {

  constructor (jsui, firstLayerType, width, height, margin = 10,range) {
    this.layers = []
    this.markerLayers = []
    this.margin = margin
    this.width = width
    this.height = height
    this.display = this // workaround for syntactic sugar
    this.scale = 1
    this.y = 0
    this.jsui = jsui
    this.canvas = {
      width: width,
      height: height
    }
    // this.container = document.getElementById(container);
    // this.container.style.height = height+"px";
    // if(width!=null) this.container.style.width = width+"px";
    // while (this.container.hasChildNodes()) {
    //   this.container.removeChild(this.container.lastChild);
    // }
    this.path = null; 
    this.addLayer(firstLayerType, margin, range)
  }

  setOffset (n) {
    this.y = n
  }

  setScale (x) {
    this.scale = x
  }
  
  addLayer (type, margin = 10, range) {
    // let canvas = document.createElement('canvas');
    // let canvas = new MaxCanvas(this.jsui);
    // canvas.style.position = "absolute";
    // canvas.style.left = "0px";
    // canvas.style.top = "0px";
    // canvas.style.border = "thin dotted black";
    // canvas.style.zIndex = this.layers.length;
    // canvas.height = this.height;
    // this.container.appendChild(canvas);    
    let f = type === 'marker' ? MarkerLayer : Layer;       
    let layer = new f(type, this.jsui, this.margin, range)
    layer.display = this
    this[this.layers.length] = layer // add array-style syntax sugar
    this.layers.push(layer)
  }

  draw (desc, style, layer) {
    if (layer === this) {
      layer = this.layers[0]
    }

    //  if width is not set, all layers will have the width of the first visualized descriptor
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
    layer.draw(desc, style)
  }
}

module.exports = Display
