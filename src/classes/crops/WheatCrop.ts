import { Crop } from "../bases/Crop";
import type { Game } from "../Game";
import type { Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";

export class WheatCrop extends Crop {
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game) {
        super(x, y, size, rotation, textures, "wheat", 0.15, 6, game)
    }
}