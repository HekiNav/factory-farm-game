import { Building } from "../../bases/Building";
import { type Game } from "../Game";
import type Grid from "../Grid";
import type { Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";

export class TrashcanBuilding extends Building {
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game, grid: Grid, events = true) {
        super(x, y, size, rotation, textures, "trashcan", game, grid)

        if (!events) return
    }
    setRotation(newRot: Rotation) {
        this.rotation = newRot
    }
    update(c: CanvasRenderingContext2D, scale: number, _time: number): void {
        this.draw(c, scale)

        const collidingItems = this.game.collidingItems(this.position)

        collidingItems.forEach(i => {
            this.game.removeItem(i.id)
        })
    }
}