import type { Game } from "../Game";
import type Grid from "../Grid";
import type { Rotation } from "../Sprite";
import { TextureTile } from "../tiles/TextureTile";
import type { TextureSheet } from "../TileSheet";

export class Building extends TextureTile {
    game: Game
    grid: Grid
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, buildingType: string, game: Game, grid: Grid) {
        super(x, y, size, rotation, textures, buildingType)
        this.game = game
        this.grid = grid
    }
    removeEvents() {
        
    }
    showOverlay() {

    }
    hideOverlay() {
            
    }
}