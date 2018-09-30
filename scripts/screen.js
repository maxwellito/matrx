class Screen {
  constructor(dotWidth, padding) {
    // Screen size
    this.width = 32;
    this.height = 18;

    // RGB filters
    this.rLow  = 0
    this.rHigh = 255
    this.gLow  = 0
    this.gHigh = 255
    this.bLow  = 0
    this.bHigh = 255

    this.setup()
    this.fillBlack()
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
      x = x > 1 ? x+6 : x
      speeds.push(x)
      //speeds.push(this.data.getFollowing() % 8)
    }
    this.speeds = speeds
  }

  // Da Loop
  interval() {

    let next = this.data.doesNextIsMagic()
    switch (next) {
      // Black
      // case 1:
      //   this.rLow  = 0
      //   this.gLow  = 0
      //   this.bLow  = 0
      //   break;
      
      // // White
      // case 1:
      //   this.rHigh = 255
      //   this.gHigh = 255
      //   this.bHigh = 255
      //   break;
      
      case 2:
        let f = this.data.getNext(3, false)//.map(x => (x > 7 ? 1 : 0))
        

          this.rHigh = 255
          this.gHigh = 255
          this.bHigh = 255


        if (f[0] < 8) {
          this.rLow = 0//f[0]*18;
          this.rHigh = 127
        }
        else {
          this.rLow = 127;
          this.rHigh = 255//f[0]*16;
        }

        if (f[1] < 8) {
          this.gLow = 0//f[1]*18;
          this.gHigh = 127
        }
        else {
          this.gLow = 127;
          this.gHigh = 255//f[1]*16;
        }

        if (f[2] < 8) {
          this.bLow = 0//f[2]*18;
          this.bHigh = 127
        }
        else {
          this.bLow = 127;
          this.bHigh = 255//f[2]*16;
        }

        // if (f[1] < 8) this.gLow = 0; else this.gLow = f[1]*16;
        // if (f[2] < 8) this.bLow = 0; else this.bLow = f[2]*16;
        
        // if (f.reduce((acc, v) => (acc + (!!v)), 0) === 1) {
        //   this.rHigh = f[0] ? 0 : this.rHigh
        //   this.gHigh = f[1] ? 0 : this.gHigh
        //   this.bHigh = f[2] ? 0 : this.bHigh
        // }
        // else {
        //   this.rLow = f[0] ? this.rLow : 255
        //   this.gLow = f[1] ? this.gLow : 255
        //   this.bLow = f[2] ? this.bLow : 255          
        // }
        break;
      default: 

        this.rLow  = Math.floor(this.rLow/2)
        this.gLow  = Math.floor(this.gLow/2)
        this.bLow  = Math.floor(this.bLow/2)

        this.rHigh  = Math.min(this.rHigh*2, 255)
        this.gHigh  = Math.min(this.gHigh*2, 255)
        this.bHigh  = Math.min(this.bHigh*2, 255)
    }

    if (next) {
      this.oscillator.setHex(this.data.getFollowing())
      this.shuffleSpeeds()

      console.log(
        next,
        this.rLow ,
        this.rHigh,
        this.gLow ,
        this.gHigh,
        this.bLow ,
        this.bHigh
      )
    }

    

    for (var line = 0; line < this.height; line++) {
      this.addPixelsToLine(this.speeds[line], line)
    }
    this.ctx.putImageData(this.imgData, 0, 0);

    // window.requestAnimationFrame(this.interval.bind(this))
    window.setTimeout(this.interval.bind(this), this.data.getFollowing() * 5 + 30)

    // window.setTimeout(this.interval.bind(this), this.data.getFollowing() * 10 + 120)
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
      let val = this.data.getFollowing() * 17

      this.imgData.data[lineStart + (i * 4)]     = this.rLow | val & this.rHigh
      this.imgData.data[lineStart + (i * 4) + 1] = this.gLow | val & this.gHigh
      this.imgData.data[lineStart + (i * 4) + 2] = this.bLow | val & this.bHigh
      // this.imgData.data[lineStart + (i * 4) + 3] = 255
    }
  }



}
