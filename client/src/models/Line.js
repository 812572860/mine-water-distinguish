import Point from './Point'

class Line {
  constructor (args) {
    this.points = args && args.length ? args.map(arg => new Point(arg)) : [];
  }
}

export default Line