import type { Game } from "./Game.js";
import { Tile } from "./Tile.js";
import type { TextureSheet } from "./TileSheet.js";

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
    textures: TextureSheet
    #tiles: Record<string, any>
    game: Game
    constructor(options: GridOptions, tiles: Record<string, any>, textures: TextureSheet, game: Game) {
        const width = options.data.map[0].length
        const height = options.data.map.length
        this.#tiles = tiles
        this.xAmount = width
        this.yAmount = height
        this.tileSize = options.tileSize
        this.textures = textures
        this.game = game
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
        const variableRegEx = /\{(.*)\}/

        return new this.#tiles[type](...params.map(p => {
            const variableName: string | null = variableRegEx.test(p) ? variableRegEx.exec(p)![1] : null
            return variableName ? (this.#getVar(variableName) || p) : p
        }))
    }
    #getVar(name: string) {
        const keyIndex = Object.keys(this).findIndex(k => k == name)
        return keyIndex > 0 ? Object.values(this)[keyIndex] : null;
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
    getRelativeTiles() {
        
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number) {
        this.gridData.flat().forEach(tile => {
            tile.update(c, scale, time)
        })
    }
}