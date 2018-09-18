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
    let val = data[i] * 17
    this.imgData.data[i * 4]     = val
    this.imgData.data[i * 4 + 1] = val
    this.imgData.data[i * 4 + 2] = val
    this.imgData.data[i * 4 + 3] = 255
  }

  this.ctx.putImageData(this.imgData, 0, 0);
}
