function HexBuffer (data) {
  this.data = data;
  this.index = 0;
}

HexBuffer.prototype.getNext = function (length, doesCount = true) {
  let slice = this.data.slice(this.index, this.index + length)
  this.index += doesCount ? length : 0;
  return slice
}

HexBuffer.prototype.getFollowing = function (doesCount = true) {
  return this.getNext(1, doesCount)[0]
}

HexBuffer.prototype.doesNextIsMagic = function () {
  let color = this.getNext(3, false)
  let isWhite = true;
  let isBlack = true;

  for (let i = 0; i < 3; i++) {
    if (color[i] === 0) {
      isWhite = false;
    }
    else if (color[i] === 15) {
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