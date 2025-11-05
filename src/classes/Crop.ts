import { TextureTile } from "./tiles/TextureTile";
import type { TextureSheet } from "./TileSheet";

export class Crop extends TextureTile {
    growthState: number
    growthStart?: number
    constructor(x: number, y: number, size: number, textures: TextureSheet, cropType: string, ) {
        super(x, y, size, textures, cropType+"-0")
        this.growthState = 0
    }
}