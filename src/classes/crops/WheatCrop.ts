import { Crop } from "../../bases/Crop";
import type { Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";

export class WheatCrop extends Crop {
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet) {
        super(x, y, size, rotation, textures, "wheat", 1, 6)
    }
}