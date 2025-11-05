import type { Crop } from "../Crop";
import { WheatCrop } from "../crops/WheatCrop";
import type { TextureSheet } from "../TileSheet";
import { TextureTile } from "./TextureTile";

export class FarmlandTile extends TextureTile {
    crop?: Crop
    constructor(x: number, y: number, size: number, textures: TextureSheet) {
        super(x, y, size, textures, "farmland")
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number) {
        this.draw(c, scale)
        if (!this.crop) {
            this.crop = new WheatCrop(this.x, this.y, this.width, this.textures)
        }
        this.crop.update(c, scale, time)
    }
}