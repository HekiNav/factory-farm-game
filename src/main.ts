import Grid, { type GridOptions } from './classes/Grid'
import { ColorTile } from './classes/tiles/ColorTile'
import { EmptyTile } from './classes/tiles/EmptyTile'
import { FarmlandTile } from './classes/tiles/FarmlandTile'
import { TextureSheet } from './classes/TileSheet'
import './style.css'
const BASE_URL = import.meta.env.BASE_URL

interface GameOptions {
  grid: GridOptions,
  container: string,
  textures: TextureSheet
}
const tiles = {
  "empty": EmptyTile,
  "color": ColorTile,
  "farmland": FarmlandTile
}

class Game {
  grid: Grid
  canvas: HTMLCanvasElement
  c: CanvasRenderingContext2D
  scale: number
  constructor(options: GameOptions) {
    this.grid = new Grid(options.grid, tiles, options.textures)
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
  return await getJson(BASE_URL + "levels/" + name + ".json")
}
async function getJson(url: string) {
  return await (await fetch(url)).json()
}

Promise.all([getLevel("test"), getJson(BASE_URL + "sprites/index.json")]).then(([levelData, tileData]) => {
  const textureImage = new Image()
  textureImage.src = "/sprites/tiles.png"
  console.log("LOADING TEXTURES")
  textureImage.addEventListener("load", () => {
    console.log("LOADED TEXTURES")

    const textureSheet = new TextureSheet(textureImage, tileData)

    const game = new Game({
      grid: {
        data: levelData,
        tileSize: 16
      },
      container: "#game",
      textures: textureSheet
    })
    game.update()
  })

})
