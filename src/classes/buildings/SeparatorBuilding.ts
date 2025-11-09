import { Building } from "../../bases/Building";
import { GameEventType, type Game } from "../Game";
import type Grid from "../Grid";
import { OverlayCollection } from "../OverlayCollection";
import { OutlineOverlay } from "../overlays/OutlineOverlay";
import { type Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";
import { rotateRelativePosition, type XY } from "../Utils";

export class SeparatorBuilding extends Building {
    #overlay?: string
    #outputPositions: XY[]
    #inputPosition: XY
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game, grid: Grid, events = true) {
        super(x, y, size, rotation, textures, "separator", game, grid)

        this.#outputPositions = this.#getOutputPositions()
        this.#inputPosition = this.#getInputPosition()

        if (!events) return
        this.game.on(GameEventType.MOUSEOVER, this.position, () => this.showOverlay())
        this.game.on(GameEventType.MOUSELEAVE, this.position, () => this.hideOverlay())
    }
    removeEvents() {
        this.game.off(GameEventType.MOUSEOVER, this.position, () => this.showOverlay())
        this.game.off(GameEventType.MOUSELEAVE, this.position, () => this.hideOverlay())
    }
    #getOutputPositions() {
        return [rotateRelativePosition({ x: 0, y: 0 }, { x: 1, y: 0 }, this.rotation.a, this.width) as XY, rotateRelativePosition({ x: 0, y: 0 }, { x: 0, y: -1 }, this.rotation.a, this.width) as XY]
    }
    #getInputPosition() {
        return rotateRelativePosition({ x: 0, y: 0 }, { x: -1, y: 0 }, this.rotation.a, this.width) as XY
    }
    showOverlay() {
        if (this.#overlay) return
        this.#overlay = this.game.addOverlay(
            new OverlayCollection(
                ...this.grid.getRelativeTiles(this.position, ...this.#outputPositions).map(t => new OutlineOverlay(t, 0.5, 255, 127, 0)),
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

        this.#outputPositions = this.#getOutputPositions()
        this.#inputPosition = this.#getInputPosition()

        this.hideOverlay()
        this.showOverlay()
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number): void {
        this.draw(c, scale)

        const collidingItems = this.game.collidingItems(this.position)

        collidingItems.forEach(i => {
            if (i.textureName == "wheat") {
                this.game.removeItem(i.id)
                this.game.addItem(this.x, this.y, "straw", time)
                this.game.addItem(this.x, this.y, "grain", time)
                return
            }
            const outputPosition = this.#outputPositions[i.textureName == "straw" ? 1 : 0]
            if (this.game.collidingItems({ ...outputPosition, width: this.width, height: this.height }).length < 1) {
                if (outputPosition.y) {
                    i.y += outputPosition.y * 0.5
                    i.x = this.x
                } else {
                    i.x += outputPosition.x * 0.5
                    i.y = this.y
                }
            }
        })
    }
}