class Screen {

  constructor(screen) {
    this.setSize(screen)
    this.setup()
    this.fillBlack()

    this.intervalBinded = this.interval.bind(this)
  }

  setSize(screen) {
    // Base
    let width = 32,
        height = 18,
        screenRatio = screen.width / screen.height,
        bestRatio = width / height;

    if (bestRatio < screenRatio) {
      this.width = width
      this.height = Math.round(width * screen.height / screen.width)
    }
    else {
      this.width = Math.round(height * screen.width / screen.height)
      this.height = height
    }
  }

  setup() {

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

  fillBlack() {
    for (var i = 0; i < this.imgData.data.length; i++) {
      this.imgData.data[i * 4]     = 0
      this.imgData.data[i * 4 + 1] = 0
      this.imgData.data[i * 4 + 2] = 0
      this.imgData.data[i * 4 + 3] = 255
    }
    this.ctx.putImageData(this.imgData, 0, 0);
  }


  // Methods
  setBuffer(data) {
    this.data = data;
    this.shuffleSpeeds();
  }


  setOscillator(osci) {
    this.oscillator = osci
    this.oscillator.start()
  }

  shuffleSpeeds() {
    let speeds = []
    for (var i = 0; i < this.height; i++) {
      let x = this.data.getFollowing() % 4
      x = x > 1 ? x+4 : x
      speeds.push(x)
      //speeds.push(this.data.getFollowing() % 8)
    }
    this.speeds = speeds
  }

  start(delay = 0) {
    setTimeout(this.intervalBinded, delay)
  }

  // Da Loop
  interval() {

    let next = this.data.doesNextIsMagic()
    switch (next) {
      case 1:
      case 2:
        let f = this.data.getNext(3, false)//.map(x => (x > 7 ? 1 : 0))
        break;
      default: 
    }

    this.burning = !!next
    if (next) {
      this.oscillator.setHex(this.data.getFollowing())
      this.shuffleSpeeds()
      this.oscillator.setType(3)
    }

    for (var line = 0; line < this.height; line++) {
      this.addPixelsToLine(this.speeds[line], line)
    }
    this.ctx.putImageData(this.imgData, 0, 0);

    // Next call
    // window.requestAnimationFrame(this.intervalBinded)
    // window.setTimeout(this.intervalBinded, this.data.getFollowing() * 10 + 120)
    window.setTimeout(this.intervalBinded, this.data.getFollowing() * 5 + 30)
  }


  addPixelsToLine(buffer, line) {

    // Move pixels
    var pixelsToMove = this.width - buffer,
        lineStart = (this.width * line) * 4,
        destStart = (this.width * line + buffer) * 4;
    for (let i = pixelsToMove*4 - 1; i >= 0; i--) {
      this.imgData.data[destStart+i] = this.imgData.data[lineStart+i]
    }

    // Add new ones
    for (let i = 0; i < buffer; i++) {
      if (this.burning) {
        let val = this.data.getFollowing()
  
        this.imgData.data[lineStart + (i * 4)]     = ((val >> 3) % 2 === 1) * 255
        this.imgData.data[lineStart + (i * 4) + 1] = ((val >> 2) % 2 === 1) * 255
        this.imgData.data[lineStart + (i * 4) + 2] = ((val >> 1) % 2 === 1) * 255
      }
      else {
        let val = this.data.getFollowing() * 17
  
        this.imgData.data[lineStart + (i * 4)]     = val
        this.imgData.data[lineStart + (i * 4) + 1] = val
        this.imgData.data[lineStart + (i * 4) + 2] = val
      }
    }
  }



}
