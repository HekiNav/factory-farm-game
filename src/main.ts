import Grid, { type GridOptions } from './classes/Grid'
import './style.css'

interface GameOptions {
  grid: GridOptions
}

class Game {
  grid: Grid
  constructor(options: GameOptions) {
    this.grid = new Grid(options.grid)
  }
}

const game = new Game({
  grid: {
    width: 10,
    height: 6,
    tileSize: 8
  }
})
console.log(game.grid)

