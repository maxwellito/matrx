class HexBuffer {
  constructor (data) {
    this.data = data;
    this.index = 0;
    this.length = data.length
    this.listeners = []
  }

  gotBufferFor(length) {
    if (this.length <= length + this.index) {
      this.listeners.forEach(l => l())
    }
    else {
      return true;
    }
  }

  getNext(length, doesCount = true) {
    this.gotBufferFor(length)
    let slice = this.data.slice(this.index, this.index + length)
    this.index += doesCount ? length : 0;
    return slice
  }

  getFollowing(doesCount = true) {
    return this.getNext(1, doesCount)[0]
  }

  doesNextIsMagic() {
    let color = this.getNext(3, false)
    let isWhite = true;
    let isBlack = true;

    for (let i = 0; i < 3; i++) {
      if (color[i] < 4) {
        isWhite = false;
      }
      else if (color[i] > 11) {
        isBlack = false;
      }
      else {
        return 0
      }
    }

    if (isBlack)      return 1;
    else if (isWhite) return 3;
    else              return 2;
  }

  onEnd(listener) {
    this.listeners.push(listener)
  }
}