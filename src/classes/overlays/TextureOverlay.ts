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
        c.save()
        c.translate(this.center.x * scale, this.center.y * scale)
        c.rotate(this.rotation.a * Math.PI / 180)
        c.drawImage(
            this.#textures.image,
            //source position
            ...this.#textures.getTexture(this.#texture),
            this.width, 
            this.height,
            //draw position
            this.width * -0.5 * scale, 
            this.height * -0.5 * scale,
            this.width * scale, 
            this.height * scale
        )
        c.restore()
    }
}