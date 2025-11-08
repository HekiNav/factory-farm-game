import { Overlay } from "../../bases/Overlay";
import type { Tile } from "../../bases/Tile";
import type { TextureSheet } from "../TileSheet";

export class TextureOverlay extends Overlay {
    #textures: TextureSheet
    #texture: string
    constructor(tile: Tile, textures: TextureSheet, texture: string) {
        super(tile)
        this.#textures = textures
        this.#texture = texture
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        c.drawImage(
            this.#textures.image,
            //source position
            ...this.#textures.getTexture(this.#texture),
            this.width,
            this.height,
            //draw position
            this.x * scale,
            this.y * scale,
            this.width * scale,
            this.height * scale
        )
    }
}