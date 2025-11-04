import { Tile } from "./Tile.js";

export interface GridOptions {
    data: GridData
    tileSize: number
}
export type TileDefinition = Record<string, TileDefinitionData>
export interface TileDefinitionData {
    type: string,
    params?: Array<any>
}
export interface GridData {
    map: Array<Array<string>>,
    tiles: TileDefinition
}

export default class Grid {
    gridData: Array<Array<Tile>>
    xAmount: number
    yAmount: number
    tileSize: number
    #tiles: Record<string, any>
    constructor(options: GridOptions, tiles: Record<string, any>) {
        const width = options.data.map[0].length
        const height = options.data.map.length
        this.#tiles = tiles
        this.xAmount = width
        this.yAmount = height
        this.tileSize = options.tileSize
        this.gridData = this.#generateGrid(width, height, options.tileSize, options.data)
    }
    #generateGrid(width: number, height: number, tileSize: number, data: GridData): Array<Array<Tile>> {
        const tileData = data.map.map(row => row.map((tile: string) => data.tiles[tile]))
        const tiles = new Array<Array<Tile>>()
        for (let i = 0; i < height; i++) {
            tiles.push([])
            for (let j = 0; j < width; j++) {
                tiles[i].push(this.#resolveTile(tileData[i][j].type, j * tileSize, i * tileSize, tileSize, ...(tileData[i][j].params || [])))
            }
        }
        return tiles
    }
    #resolveTile(type: string, ...params: Array<any>) {
        if (!this.#tiles[type]) {
            console.warn(`Tile of type ${type} not found, using base Tile instead`)
            return new Tile(params[0], params[1], params[2])
        }
        return new this.#tiles[type](...params)
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