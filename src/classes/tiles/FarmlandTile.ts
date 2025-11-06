import { crops } from "../../main";
import type { Crop } from "../Crop";
import { GameEventType, type Game } from "../Game";
import type { TextureSheet } from "../TileSheet";
import { TextureTile } from "./TextureTile";

export class FarmlandTile extends TextureTile {
    crop?: Crop
    #game: Game
    #crops: Record<string, any>
    constructor(x: number, y: number, size: number, textures: TextureSheet, game: Game) {
        super(x, y, size, textures, "farmland")
        this.#game = game
        this.#game.on(GameEventType.CLICK, this.position, () => this.plant("wheat"))
        this.#crops = crops
    }
    plant(cropType: string) {
        this.crop = this.#resolveCrop(cropType, this.x, this.y, this.width, this.textures)
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