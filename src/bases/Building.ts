import type { Game } from "../classes/Game";
import type Grid from "../classes/Grid";
import type { Rotation } from "../classes/Sprite";
import { TextureTile } from "../classes/tiles/TextureTile";
import type { TextureSheet } from "../classes/TileSheet";

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