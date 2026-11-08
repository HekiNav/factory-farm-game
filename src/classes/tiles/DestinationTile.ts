import { type Game } from "../Game";
import type { TextureSheet } from "../TileSheet";
import { TextureTile } from "./TextureTile";
import { ROTATION, type Rotation } from "../Sprite";
import type Grid from "../Grid";

export class DestinationTile extends TextureTile {
    #game: Game
    #grid: Grid
    #requirements: Record<string, number>
    #requirementsFulfilled: Record<string, number>
    #baseTile: TextureTile
    #reqTiles: TextureTile[]
    constructor(x: number, y: number, size: number, rotation: Rotation, baseTexture: string, textures: TextureSheet, game: Game, grid: Grid) {
        super(x, y, size, rotation, textures, "pallet")
        this.#baseTile = new TextureTile(x, y, size, rotation, textures, baseTexture)
        this.#game = game
        this.#grid = grid
        this.#reqTiles = []
        this.#requirements = this.#grid.requirements
        this.#requirementsFulfilled = Object.keys(this.#requirements).reduce((prev, curr, i) => {
            this.#reqTiles.push(new TextureTile(x - Math.floor(i / 3) * size * 1, y + (i % 3-0.5) * size * 0.35, size * 0.45, ROTATION.UP, textures, curr, size))
            return { ...prev, [curr]: 0 }
        }, {})
    }
    #checkFulfillment() {
        if (Object.keys(this.#requirements).every(r => this.#requirements[r] <= this.#requirementsFulfilled[r])) this.#game.end()
    }
    drawRequirements(c: CanvasRenderingContext2D, scale: number) {
        this.#reqTiles.forEach(t => {
            this.#game.drawAsOverlay(t)
            const fontSize = t.height * 0.6 * scale
            c.font = `${fontSize}px "Jersey 10"`
            c.fillStyle = this.#requirementsFulfilled[t.textureName] >= this.#requirements[t.textureName] ? "#0EAA00" : "#4C3C1E"
            c.strokeStyle = "#fff"
            c.lineWidth = 4
            c.strokeText(`${this.#requirementsFulfilled[t.textureName]}/${this.#requirements[t.textureName]}`, Math.floor(t.x + t.width) * scale , Math.floor(t.y + t.height * 0.5) * scale + fontSize * 0.4)
            c.fillText(`${this.#requirementsFulfilled[t.textureName]}/${this.#requirements[t.textureName]}`, Math.floor(t.x + t.width) * scale , Math.floor(t.y + t.height * 0.5) * scale + fontSize * 0.4)
        })
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number) {
        this.#game.collidingItems(this.position).forEach(i => {
            if (this.#requirements[i.textureName]) this.#requirementsFulfilled[i.textureName]++
            this.#game.removeItem(i.id)
        })
        this.#checkFulfillment()
        this.#baseTile.update(c, scale, time)
        this.draw(c, scale)
        this.drawRequirements(c, scale)
    }
}