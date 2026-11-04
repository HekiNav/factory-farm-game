import { Tile } from "../bases/Tile";
import type { Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";

export class TextureTile extends Tile {
    textures: TextureSheet
    textureName: string
    spriteSize?: number
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, textureName: string, spriteSize?: number) {
        super(x, y, size, rotation)
        this.textures = textures
        this.textureName = textureName
        this.spriteSize = spriteSize
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        c.save()
        c.translate(this.center.x * scale, this.center.y * scale)
        c.rotate(this.rotation.a * Math.PI / 180)
        c.drawImage(
            this.textures.image,
            //source position
            ...this.textures.getTexture(this.textureName),
            this.spriteSize || this.width,
            this.spriteSize || this.width,
            //draw position
            Math.round(this.width * this.rotation.x * -0.5 * scale),
            Math.round(this.height * this.rotation.y * -0.5 * scale),
            Math.floor(this.width * this.rotation.x * scale),
            Math.floor(this.height * this.rotation.y * scale)
        )
        c.restore()
    }
}