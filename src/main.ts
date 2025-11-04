import Grid, { type GridOptions } from './classes/Grid'
import { EmptyTile } from './classes/tiles/EmptyTile'
import './style.css'
const BASE_URL = import.meta.env.BASE_URL

interface GameOptions {
  grid: GridOptions,
  container: string
}
const tiles = {
  "empty": EmptyTile
}

class Game {
  grid: Grid
  canvas: HTMLCanvasElement
  c: CanvasRenderingContext2D
  scale: number
  constructor(options: GameOptions) {
    this.grid = new Grid(options.grid, tiles)
    this.canvas = this.#generateCanvas(options.container)
    this.c = this.canvas.getContext("2d")!
    this.scale = NaN
    this.#resizeCanvas()
  }
  #generateCanvas(selector: string) {
    const canvas = document.createElement("canvas")
    document.querySelector(selector)?.append(canvas)
    return canvas
  }
  #getScale() {
    const gridRatio = this.grid.aspectRatio
    const screenRatio = window.innerWidth / window.innerHeight
    if (gridRatio > screenRatio) {
      return window.innerWidth / this.grid.width
    } else {
      return window.innerHeight / this.grid.height
    }
  }
  #resizeCanvas(): boolean {
    if (this.scale == this.#getScale()) return false
    this.scale = this.#getScale()
    this.canvas.width = this.scale * this.grid.width
    this.canvas.height = this.scale * this.grid.height
    return true
  }
  update() {
    this.c.clearRect(0, 0, this.grid.width * this.scale, this.grid.height * this.scale)
    this.#resizeCanvas()
    this.grid.draw(this.c, this.scale)
    window.requestAnimationFrame(() => this.update())
  }
}

async function getLevel(name: string) {
  return await (await fetch(BASE_URL + "levels/" + name + ".json")).json()
}

getLevel("test").then((json) => {
  const game = new Game({
    grid: {
      data: json,
      tileSize: 64
    },
    container: "#game"
  })
  game.update()
})
