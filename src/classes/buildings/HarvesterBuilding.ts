import { Building } from "../../bases/Building";
import { GameEventType, type Game } from "../Game";
import type { RelativePosition } from "../Grid";
import type Grid from "../Grid";
import { OverlayCollection } from "../OverlayCollection";
import { OutlineOverlay } from "../overlays/OutlineOverlay";
import type { Tile } from "../../bases/Tile";
import { FarmlandTile } from "../tiles/FarmlandTile";
import type { TextureSheet } from "../TileSheet";
import { Item } from "../../bases/Item";
import { range } from "../Utils";

export class HarvesterBuilding extends Building {
    #pulledItems: Array<Item>
    #game: Game
    #grid: Grid
    #overlay?: string
    affectedPositions: RelativePosition
    constructor(x: number, y: number, size: number, textures: TextureSheet, game: Game, grid: Grid) {
        super(x, y, size, textures, "harvester")
        this.#game = game
        this.#grid = grid
        this.#pulledItems = []
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
    update(_c: CanvasRenderingContext2D, _scale: number, time: number) {
        this.#game.drawAsOverlay(this)
        this.#getRelativeTiles().filter(t =>
            t && t instanceof FarmlandTile && t.crop?.fullyGrown
        ).forEach((t: Tile) => {
            (t as FarmlandTile).replant()
            this.#pulledItems.push(new Item(t.x, t.y,this.width,this.textures, "wheat", time))
        })

        const pullTime = 2000 //ms
        this.#pulledItems.forEach(i => {
            const elapsedSinceCreation = time - i.creationTime!
            console.log(elapsedSinceCreation)
            if (elapsedSinceCreation > pullTime) {
                this.#pulledItems = this.#pulledItems.filter(item => item != i)
                return
            } else {
                i.x = Math.floor(range(0, pullTime, i.startPos.x, this.x, elapsedSinceCreation))
                i.y = Math.floor(range(0, pullTime, i.startPos.y, this.y, elapsedSinceCreation))
            }
            this.#game.drawAsOverlay(i)
        })
    }
}