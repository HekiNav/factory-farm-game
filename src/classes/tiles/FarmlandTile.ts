import type { TextureSheet } from "../TileSheet";
import { TextureTile } from "./TextureTile";

export class FarmlandTile extends TextureTile{
    constructor (x: number, y: number, size: number, textures: TextureSheet) {
        super(x, y, size, textures, "farmland")
    }
    update(c: CanvasRenderingContext2D, scale: number) {
        this.draw(c, scale)
    }
}