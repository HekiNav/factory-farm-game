import { Tile } from "./Tile.js";

export interface GridOptions {
  width: number,
  height: number,
  tileSize: number
}

export default class Grid {
    gridData: Array<Array<Tile>>
    width: number
    height: number
    tileSize: number
    constructor(options: GridOptions) {
        this.gridData = this.#generateGrid(options.width, options.height, options.tileSize)
        this.width = options.width
        this.height = options.height
        this.tileSize = options.tileSize
    }
    #generateGrid(width: number, height: number, tileSize: number): Array<Array<Tile>> {
        const tiles = new Array<Array<Tile>>()
        for (let i = 0; i < height; i++) {
            tiles.push([])
            for (let j = 0; j < width; j++) {
                tiles[i].push(new Tile(i * tileSize, j * tileSize, tileSize))
            }
        }
        return tiles
    }
}