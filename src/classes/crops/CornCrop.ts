import { Crop } from "../bases/Crop";
import type { Game } from "../Game";
import type { Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";

export class CornCrop extends Crop {
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game) {
        super(x, y, size, rotation, textures, "corn", 0.1, 6, game)
    }
}