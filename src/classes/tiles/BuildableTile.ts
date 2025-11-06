import { buildings } from "../../main";
import { Building } from "../Building";
import { GameEventType, type Game } from "../Game";
import type Grid from "../Grid";
import type { TextureSheet } from "../TileSheet";
import { TextureTile } from "./TextureTile";

export class BuildableTile extends TextureTile {
    building?: Building
    #game: Game
    #grid: Grid
    #buildings: Record<string, any>
    constructor(x: number, y: number, size: number, textures: TextureSheet, game: Game, grid: Grid, baseTileType: string) {
        super(x, y, size, textures, baseTileType)
        this.#game = game
        this.#grid = grid
        this.#buildings = buildings
        this.#game.on(GameEventType.CLICK, this.position, () => this.build("harvester"))
    }
    build(buildingType: string) {
        this.building = this.#resolveBuilding(buildingType, this.x, this.y, this.width, this.textures, this.#game, this.#grid)
    }
    #resolveBuilding(type: string, ...params: Array<any>) {
        if (!this.#buildings[type]) {
            console.warn(`Building of type ${type} not found, skipping building`)
            return null
        }
        return new this.#buildings[type](...params)
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number) {
        this.draw(c, scale)
        if (this.building) this.building.update(c, scale, time)
    }
}