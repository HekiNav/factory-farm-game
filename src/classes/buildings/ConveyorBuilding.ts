import { Building } from "../bases/Building";
import { GameEventType, type Game } from "../Game";
import type Grid from "../Grid";
import { OverlayCollection } from "../OverlayCollection";
import { TextureOverlay } from "../overlays/TextureOverlay";
import type { Rotation } from "../Sprite";
import type { TextureSheet } from "../TileSheet";
import { rotateRelativePosition, type XY } from "../Utils";

export class ConveyorBuilding extends Building {
    #overlay?: string
    #outputPosition: XY
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game, grid: Grid, events = true) {
        super(x, y, size, rotation, textures, "conveyor", game, grid)

        this.#outputPosition = this.#getOutputPosition()

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
    showOverlay() {
        if (this.#overlay) return
        this.#overlay = this.game.addOverlay(new OverlayCollection(new TextureOverlay(this, this.textures, "arrow")))
    }
    hideOverlay() {
        if (!this.#overlay) return
        this.game.removeOverlay(this.#overlay)
        this.#overlay = undefined
    }
    setRotation(newRot: Rotation) {
        this.rotation = newRot

        this.#outputPosition = this.#getOutputPosition()

        this.hideOverlay()
        this.showOverlay()
    }
    update(c: CanvasRenderingContext2D, scale: number, _time: number): void {
        this.draw(c, scale)

        const collidingItems = this.game.collidingItems(this.position)

        collidingItems.forEach(i => {
            if (this.game.collidingItems({ ...this.#outputPosition, width: this.width, height: this.height }).length < 1) {
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