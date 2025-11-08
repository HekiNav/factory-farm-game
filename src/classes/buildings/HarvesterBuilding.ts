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
    constructor(x: number, y: number, size: number, textures: TextureSheet, game: Game, grid: Grid, events = true) {
        super(x, y, size, textures, "harvester")
        this.#game = game
        this.#grid = grid
        this.#pulledItems = []
        this.affectedPositions = { x: [-3, -1], y: [-1, 1] }
        if (!events) return
        this.#game.on(GameEventType.MOUSEOVER, this.position, () => this.showOverlay())
        this.#game.on(GameEventType.MOUSELEAVE, this.position, () => this.hideOverlay())
    }
    showOverlay() {
        if (this.#overlay) return
        this.#overlay = this.#game.addOverlay(new OverlayCollection(...this.#getRelativeTiles().map(t => new OutlineOverlay(t, 0.5))))
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
            if (this.#pulledItems.find(i => i.x == t.x && i.y == t.y)) return
            this.#pulledItems.push(new Item(t.x, t.y, this.width, this.textures, (t as FarmlandTile).crop?.cropType || "", time))
        })
        const collidingItems = this.#game.collidingItems(this.position)

        collidingItems.forEach(i => {
            if (this.#game.collidingItems(this.#grid.getRelativeTiles(this.position, { x: 1, y: 0 })[0].position).length < 2) i.x++
        })

        const pullTime = 2000 //ms
        this.#pulledItems.forEach(i => {
            const elapsedSinceCreation = time - i.creationTime!
            if (elapsedSinceCreation > pullTime && collidingItems.length <= 1) {
                this.#game.addItem(this.x, this.y, this.#pulledItems.splice(this.#pulledItems.indexOf(i), 1)[0].textureName, time)
                return
            } else if (collidingItems.length <= 1) {
                i.x = Math.floor(range(0, pullTime, i.startPos.x, this.x, elapsedSinceCreation))
                i.y = Math.floor(range(0, pullTime, i.startPos.y, this.y, elapsedSinceCreation))
            } else {
                i.startPos = i.position
                i.creationTime = time
            }
            this.#game.drawAsOverlay(i)
        })
    }
}