import { Tile } from "../Tile";
import type { TextureSheet } from "../TileSheet";

export class TextureTile extends Tile{
    textures: TextureSheet
    textureName: string
    constructor (x: number, y: number, size: number, textures: TextureSheet, textureName: string) {
        super(x, y, size)
        this.textures = textures
        this.textureName = textureName
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        c.drawImage(
            this.textures.image,
            //source position
            ...this.textures.getTexture(this.textureName),
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