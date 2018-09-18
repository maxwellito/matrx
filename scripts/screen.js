function Screen (dotWidth, padding) {

  this.width = 32;
  this.height = 18

  

  this.setup()
}

Screen.prototype.setupTemplate = function () {
  this.el = dom.create('div')
}

Screen.prototype.setup = function () {

  // Set and reset
  if (this.canvas) {
    this.el.removeChild(this.canvas)
  }
  
  // Build the canvas
  this.canvas = document.createElement('canvas');
  this.ctx = this.canvas.getContext('2d');
  this.imgData = this.ctx.createImageData(this.width, this.height);

  // Pixelization
  // this.ctx.mozImageSmoothingEnabled = false;
  // this.ctx.webkitImageSmoothingEnabled = false;
  // this.ctx.msImageSmoothingEnabled = false;
  this.ctx.imageSmoothingEnabled = false;

  // Set actual size in memory (scaled to account for extra pixel density).
  this.canvas.width = this.width;
  this.canvas.height = this.height;

  // Make wrapper
  document.body.appendChild(this.canvas)
}

Screen.prototype.fillUpWithShit = function (data) {

  for (var i = 0; i < this.imgData.data.length; i++) {
    this.imgData.data[i * 4]     = 0
    this.imgData.data[i * 4 + 1] = 0
    this.imgData.data[i * 4 + 2] = 0
    this.imgData.data[i * 4 + 3] = 255
  }

  this.ctx.putImageData(this.imgData, 0, 0);
}




Screen.prototype.setBuffer = function (data) {
  this.data = data;

  speeds = []
  for (var i = 0; i < this.height; i++) {
    speeds.push(this.data.getFollowing() || 1)
  }
  this.speeds = speeds
}

Screen.prototype.interval = function () {


  for (var line = 0; line < this.height; line++) {
    this.addPixelsToLine(this.speeds[line], line)
  }

  // for (var i = 0; i < this.imgData.data.length; i++) {
  //   let val = this.data.getFollowing() * 17
  //   this.imgData.data[i * 4]     = val
  //   this.imgData.data[i * 4 + 1] = val
  //   this.imgData.data[i * 4 + 2] = val
  //   this.imgData.data[i * 4 + 3] = 255
  // }

  this.ctx.putImageData(this.imgData, 0, 0);

  // window.requestAnimationFrame(this.interval.bind(this))
  window.setTimeout(this.interval.bind(this), this.data.getFollowing() * 5 + 30)
}


Screen.prototype.addPixelsToLine = function (buffer, line) {

  // Move pixels
  var pixelsToMove = this.width - buffer,
      lineStart = (this.width * line) * 4,
      destStart = (this.width * line + buffer) * 4;
  for (let i = pixelsToMove*4 - 1; i >= 0; i--) {
    this.imgData.data[destStart+i] = this.imgData.data[lineStart+i]
  }

  // Add new ones
  for (let i = 0; i < buffer; i++) {
    let val = this.data.getFollowing() * 17

    this.imgData.data[lineStart + (i * 4)]     = val
    this.imgData.data[lineStart + (i * 4) + 1] = val
    this.imgData.data[lineStart + (i * 4) + 2] = val
    this.imgData.data[lineStart + (i * 4) + 3] = 255
  }
}


