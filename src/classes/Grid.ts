import { Tile } from "./Tile.js";

export interface GridOptions {
    data: GridData
    tileSize: number
}
export interface GridData {
    map: Array<Array<string>>,
    tiles: Array<TileData>
}
export interface TileData {
    type: string
}

export default class Grid {
    gridData: Array<Array<Tile>>
    xAmount: number
    yAmount: number
    tileSize: number
    #tiles: Object
    constructor(options: GridOptions, tiles: Object) {
        const width = options.data.map[0].length
        const height = options.data.map.length
        this.gridData = this.#generateGrid(width, height, options.tileSize, options.data)
        this.xAmount = width
        this.yAmount = height
        this.tileSize = options.tileSize
        this.#tiles = tiles
    }
    #generateGrid(width: number, height: number, tileSize: number, data: GridData): Array<Array<Tile>> {
        const tiles = new Array<Array<Tile>>()
        for (let i = 0; i < height; i++) {
            tiles.push([])
            for (let j = 0; j < width; j++) {
                tiles[i].push(new Tile(j * tileSize, i * tileSize, tileSize))
            }
        }
        return tiles
    }
    #resolveTile(type: string, ...params: any) {
        return 
    } 
    get width() {
        return this.xAmount * this.tileSize
    }
    get height() {
        return this.yAmount * this.tileSize
    }
    get aspectRatio() {
        return this.xAmount / this.yAmount
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        this.gridData.flat().forEach(tile => {
            tile.draw(c, scale)
        })
    }
}