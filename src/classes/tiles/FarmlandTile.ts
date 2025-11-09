import { cropData, crops } from "../../main";
import type { Crop } from "../../bases/Crop";
import { GameEventType, type Game } from "../Game";
import type { TextureSheet } from "../TileSheet";
import { TextureTile } from "./TextureTile";
import { ROTATION, type Rotation } from "../Sprite";
import type Grid from "../Grid";

export class FarmlandTile extends TextureTile {
    crop?: Crop
    #game: Game
    #grid: Grid
    #crops: Record<string, any>
    #cropData: Record<string, any>
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game, grid: Grid) {
        super(x, y, size, rotation, textures, "farmland")
        this.#game = game
        this.#grid = grid
        this.#crops = {...crops}
        this.#cropData = {...cropData}
        
        this.#grid.locked.crop.forEach(key => {
            delete this.#crops[key]
            delete this.#cropData[key]
        })

        this.#game.on(GameEventType.CLICK, this.position, () => {
            this.#game.openMenu("plant", this.#cropData, (type: string) => this.plant(type),this)
        })
    }
    plant(cropType: string) {
        this.crop = this.#resolveCrop(cropType, this.x, this.y, this.width, ROTATION.UP, this.textures)
    }
    replant() {
        this.plant(this.crop?.cropType || "")
    }
    #resolveCrop(type: string, ...params: Array<any>) {
        if (!this.#crops[type]) {
            console.warn(`Crop of type ${type} not found, skipping planting`)
            return null
        }
        return new this.#crops[type](...params)
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number) {
        this.draw(c, scale)
        if (this.crop) this.crop.update(c, scale, time)
    }
}