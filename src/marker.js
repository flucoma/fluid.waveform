class Marker {
  constructor(position, selected = false)
  {
    this.position = position 
    this.selected = selected
  }
}

Marker.prototype.valueOf = function() { return this.position }; 

class Markers {
  
  constructor(data,sampleRate){
    this.data = data.map(m => new Marker(m))
    this.sampleRate = sampleRate 
    this.selection = null 
    this.extent = [0,null] 
  }
  
  get length(){
    return this.extent[1] ? this.extent[1] : this.data[this.data.length - 1].position; 
  }
  
  get size(){
    return this.data.length; 
  }
  
  draw(target,style)
  {
    target.display.draw_markers(this,style,target,"max");
    return this; 
  }  
  
  add(data){
    this.data = this.data.concat(data instanceof Array ? [data.map(pos=>new Marker(pos,false))]:new Marker(data,false))
    this.data.sort()
    return this
  }
  
  remove(data)
  {
    this.data = this.data.filter(x => x !== data); 
    return this; 
  } 
  
  slice(from, to)
  {    
    let newm =  new Markers(
      [], this.sampleRate
    )   
    newm.data = this.data.filter(m => (m.position >= from && m.position <= to))
    newm.extent = [from, this.extent[1] ? (to - from) : null]; 
    return newm
  }
}

module.exports = Markers;
