import type { Crop } from "../Crop";
import { WheatCrop } from "../crops/WheatCrop";
import { GameEventType, type Game } from "../Game";
import type { TextureSheet } from "../TileSheet";
import { TextureTile } from "./TextureTile";

interface FakeGrid {
    getRelativeTiles: Function
}

export class FarmlandTile extends TextureTile {
    crop?: Crop
    game: Game
    grid: FakeGrid
    constructor(x: number, y: number, size: number, textures: TextureSheet, game: Game, getRelativeTiles: Function) {
        super(x, y, size, textures, "farmland")
        this.game = game
        this.grid = {getRelativeTiles}
        this.game.on(GameEventType.CLICK, this.position, () => this.plant("wheat"))
    }
    plant(cropType: string) {
        switch (cropType) {
            case "wheat":
                this.crop = new WheatCrop(this.x, this.y, this.width, this.textures)
                break;
            default:
                console.warn(`Unknown crop type ${cropType}, skipping planting`)
                break;
        }
        
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number) {
        this.draw(c, scale)
        if (this.crop) this.crop.update(c, scale, time)
    }
}