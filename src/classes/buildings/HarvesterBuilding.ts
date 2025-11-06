import { Building } from "../Building";
import { GameEventType, type Game } from "../Game";
import type { RelativePosition } from "../Grid";
import type Grid from "../Grid";
import { OverlayCollection } from "../OverlayCollection";
import { OutlineOverlay } from "../overlays/OutlineOverlay";
import type { Tile } from "../Tile";
import { FarmlandTile } from "../tiles/FarmlandTile";
import type { TextureSheet } from "../TileSheet";

export class HarvesterBuilding extends Building {
    #game: Game
    #grid: Grid
    #overlay?: string
    affectedPositions: RelativePosition
    constructor(x: number, y: number, size: number, textures: TextureSheet, game: Game, grid: Grid) {
        super(x, y, size, textures, "harvester")
        this.#game = game
        this.#grid = grid
        this.affectedPositions = { x: [-3, -1], y: [-1, 1] }
        this.#game.on(GameEventType.MOUSEOVER, this.position, () => this.showOverlay)
        this.#game.on(GameEventType.MOUSELEAVE, this.position, () => this.hideOverlay)
    }
    showOverlay() {
        this.#overlay = this.#game.addOverlay(new OverlayCollection(...this.#getRelativeTiles().map(t => new OutlineOverlay(t))))
    }
    hideOverlay() {
        if (!this.#overlay) return
        this.#game.removeOverlay(this.#overlay)
        this.#overlay = undefined
    }
    #getRelativeTiles() {
        return this.#grid.getRelativeTiles(this.position, this.affectedPositions)
    }
    update(c: CanvasRenderingContext2D, scale: number, _time: number) {
        this.draw(c, scale)
        this.#getRelativeTiles().filter(t =>
            t && t instanceof FarmlandTile && t.crop?.fullyGrown
        ).forEach((t: Tile) => {
            (t as FarmlandTile).replant()
            
        })

    }
}