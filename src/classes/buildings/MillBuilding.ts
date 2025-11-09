import { Building } from "../../bases/Building";
import { GameEventType, type Game } from "../Game";
import type Grid from "../Grid";
import { OverlayCollection } from "../OverlayCollection";
import { OutlineOverlay } from "../overlays/OutlineOverlay";
import { type Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";
import { rotateRelativePosition, type XY } from "../Utils";

export class MillBuilding extends Building {
    #overlay?: string
    #outputPosition: XY
    #inputPosition: XY
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game, grid: Grid, events = true) {
        super(x, y, size, rotation, textures, "mill", game, grid)

        this.#outputPosition = this.#getOutputPosition()
        this.#inputPosition = this.#getInputPosition()

        if (!events) return
        this.game.on(GameEventType.MOUSEOVER, this.position, () => this.showOverlay())
        this.game.on(GameEventType.MOUSELEAVE, this.position, () => this.hideOverlay())
    }
    removeEvents() {
        this.game.off(GameEventType.MOUSEOVER, this.position, () => this.showOverlay())
        this.game.off(GameEventType.MOUSELEAVE, this.position, () => this.hideOverlay())
    }
    #getOutputPosition() {
        return rotateRelativePosition({ x: 0, y: 0 }, { x: 1, y: 0 }, this.rotation.a, this.width) as XY
    }
    #getInputPosition() {
        return rotateRelativePosition({ x: 0, y: 0 }, { x: -1, y: 0 }, this.rotation.a, this.width) as XY
    }
    showOverlay() {
        if (this.#overlay) return
        this.#overlay = this.game.addOverlay(
            new OverlayCollection(
                new OutlineOverlay(this.grid.getRelativeTiles(this.position, this.#outputPosition)[0], 0.5, 255, 127, 0),
                new OutlineOverlay(this.grid.getRelativeTiles(this.position, this.#inputPosition)[0], 0.5, 0, 255, 255)
            )
        )
    }
    hideOverlay() {
        if (!this.#overlay) return
        this.game.removeOverlay(this.#overlay)
        this.#overlay = undefined
    }
    setRotation(newRot: Rotation) {
        this.rotation = newRot

        this.#outputPosition = this.#getOutputPosition()
        this.#inputPosition = this.#getInputPosition()

        this.hideOverlay()
        this.showOverlay()
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number): void {
        this.draw(c, scale)

        const collidingItems = this.game.collidingItems(this.position)

        collidingItems.forEach(i => {
            if (i.textureName != "flour") this.game.removeItem(i.id)
            if (i.textureName == "grain") this.game.addItem(this.x, this.y, "flour", time)
            if (this.game.collidingItems({ x: this.#outputPosition.x, y: this.#outputPosition.y, width: this.width, height: this.height }).length < 1) {
                if (this.#outputPosition.y) {
                    i.y += this.#outputPosition.y * 0.5
                    i.x = this.x
                } else {
                    i.x += this.#outputPosition.x * 0.5
                    i.y = this.y
                }
            }
        })
    }
}