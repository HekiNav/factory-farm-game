import { Crop } from "../../bases/Crop";
import type { TextureSheet } from "../TileSheet";

export class WheatCrop extends Crop {
    constructor(x: number, y: number, size: number, textures: TextureSheet) {
        super(x, y, size, textures, "wheat", 1, 6)
    }
}