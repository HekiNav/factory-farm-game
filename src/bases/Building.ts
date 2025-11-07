import { TextureTile } from "../classes/tiles/TextureTile";
import type { TextureSheet } from "../classes/TileSheet";

export class Building extends TextureTile {
    constructor(x: number, y: number, size: number, textures: TextureSheet, buildingType: string) {
        super(x, y, size, textures, buildingType)
    }
}