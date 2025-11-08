import { Building } from "../../bases/Building";
import { GameEventType, type Game } from "../Game";
import type Grid from "../Grid";
import { OverlayCollection } from "../OverlayCollection";
import { TextureOverlay } from "../overlays/TextureOverlay";
import type { TextureSheet } from "../TileSheet";

export class ConveyorBuilding extends Building {
    #game: Game
    #grid: Grid
    #overlay?: string
    constructor(x: number, y: number, size: number, textures: TextureSheet, game: Game, grid: Grid, events = true) {
        super(x, y, size, textures, "conveyor")
        this.#game = game
        this.#grid = grid
        if (!events) return
        this.#game.on(GameEventType.MOUSEOVER, this.position, () => this.showOverlay())
        this.#game.on(GameEventType.MOUSELEAVE, this.position, () => this.hideOverlay())
    }
    showOverlay() {
        if (this.#overlay) return
        this.#overlay = this.#game.addOverlay(new OverlayCollection(new TextureOverlay(this, this.textures, "arrow")))
    }
    hideOverlay() {
        if (!this.#overlay) return
        this.#game.removeOverlay(this.#overlay)
        this.#overlay = undefined
    }
    update(c: CanvasRenderingContext2D, scale: number, _time: number): void {
        this.draw(c, scale)

        const collidingItems = this.#game.collidingItems(this.position)

        collidingItems.forEach(i => {
            if (this.#game.collidingItems(this.#grid.getRelativeTiles(this.position, { x: 1, y: 0 })[0].position).length < 1) i.x++
        })
    }
}