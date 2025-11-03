import { Tile } from "./Tile.js";

export default class Grid {
    gridData: Array<Array<Tile>>
    width: number
    height: number
    tileSize: number
    constructor(width: number, height: number, tileSize: number) {
        this.gridData = this.#generateGrid(width, height, tileSize)
        this.width = width
        this.height = height
        this.tileSize = tileSize
    }
    #generateGrid(width: number, height: number, _tileSize: number): Array<Array<Tile>> {
        const tiles = new Array<Array<Tile>>()
        for (let i = 0; i < height; i++) {
            tiles.push([])
            for (let j = 0; j < width; i++) {
                tiles[i].push(new Tile())
            }
        }
        return tiles
    }
}