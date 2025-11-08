import { Tile } from "../../bases/Tile";
import type { Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";

export class TextureTile extends Tile {
    textures: TextureSheet
    textureName: string
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, textureName: string) {
        super(x, y, size, rotation)
        this.textures = textures
        this.textureName = textureName
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        c.save()
        c.translate(this.center.x * scale, this.center.y * scale)
        c.rotate(this.rotation.a * Math.PI / 180)
        c.drawImage(
            this.textures.image,
            //source position
            ...this.textures.getTexture(this.textureName),
            this.width,
            this.height,
            //draw position
            this.width * this.rotation.x * -0.5 * scale,
            this.height * this.rotation.y * -0.5 * scale,
            this.width * this.rotation.x * scale,
            this.height * this.rotation.y * scale
        )
        c.restore()
    }
}