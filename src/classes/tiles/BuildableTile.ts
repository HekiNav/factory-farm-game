import { buildings } from "../../main";
import { Building } from "../../bases/Building";
import { Game, GameEventType } from "../Game";
import type Grid from "../Grid";
import type { TextureSheet } from "../TileSheet";
import { TextureTile } from "./TextureTile";
import { OutlineOverlay } from "../overlays/OutlineOverlay";

export class BuildableTile extends TextureTile {
    building?: Building
    #game: Game
    #grid: Grid
    #buildings: Record<string, any>
    #overlayId?: string
    constructor(x: number, y: number, size: number, textures: TextureSheet, game: Game, grid: Grid, baseTileType: string) {
        super(x, y, size, textures, baseTileType)
        this.#game = game
        this.#grid = grid
        this.#buildings = buildings
        this.#game.on(GameEventType.CLICK, this.position, () => {
            this.#game.openBuildMenu((type: string) => this.build(type), this)
        })

        this.#game.on(GameEventType.MOUSELEAVE, this.position, () => {
            this.#game.removeOverlay(this.#overlayId || "")
            this.#overlayId = undefined
        })
        this.#game.on(GameEventType.MOUSEOVER, this.position, () => {
            if (!this.#overlayId) this.#overlayId = this.#game.addOverlay(new OutlineOverlay(this))
        })
    }
    build(buildingType: string) {
        this.building = this.resolveBuilding(buildingType, this.x, this.y, this.width, this.textures, this.#game, this.#grid)
    }
    resolveBuilding(type: string, ...params: Array<any>) {
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