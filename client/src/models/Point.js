class Point {
  constructor (args) {
    if (args) {
      Object.assign(this, args);
    }
    this.x = this.x ? this.x * 1 : (this[0] ? this[0] * 1 : 0);
    this.y = this.y ? this.y * 1 : (this[1] ? this[1] * 1 : 0);
    // this.z = this.z ? this.z * 1 : (this[2] ? this[2] * 1 : 0);
  }
  matrix () {
    return [this.x, this.y, this.z];
  }
}

export default Point