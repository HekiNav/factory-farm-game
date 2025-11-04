import { Tile } from "../Tile";
import type { TextureSheet } from "../TileSheet";

export class FarmlandTile extends Tile{
    textures: TextureSheet
    constructor (x: number, y: number, size: number, textures: TextureSheet) {
        super(x, y, size)
        this.textures = textures
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        c.drawImage(
            this.textures.image,
            //source position
            ...this.textures.getTexture("farmland"),
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