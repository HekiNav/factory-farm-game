import type { AnyBuilding } from "../../BuildingDefs";
import { Building } from "../bases/Building";
import { GameEventType, type Game } from "../Game";
import type Grid from "../Grid";
import { OverlayCollection } from "../OverlayCollection";
import { TextureOverlay } from "../overlays/TextureOverlay";
import { type Rotation } from "../Sprite";
import { BuildableTile } from "../tiles/BuildableTile";
import type { TextureSheet } from "../TileSheet";
import { rotateRelativePosition, type XY } from "../Utils";
import { SeparatorBuilding } from "./SeparatorBuilding";
import { TrashcanBuilding } from "./TrashcanBuilding";

export class ConveyorBuilding extends Building {
    #overlay?: string
    #outputPosition: XY
    baseRotation: Rotation
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game, grid: Grid, events = true) {
        super(x, y, size, structuredClone(rotation), textures, "conveyor", game, grid)

        this.baseRotation = rotation

        this.#outputPosition = this.getOutputPosition()

        if (!events) return
        this.game.on(GameEventType.HOVER, this.position, () => this.showOverlay())
        this.game.on(GameEventType.DEHOVER, this.position, () => this.hideOverlay())
    }
    removeEvents() {
        this.game.off(GameEventType.HOVER, this.position, () => this.showOverlay())
        this.game.off(GameEventType.DEHOVER, this.position, () => this.hideOverlay())
    }
    showOverlay() {
        if (this.#overlay) return
        this.#overlay = this.game.addOverlay(new OverlayCollection(new TextureOverlay({...this,rotation: this.baseRotation}, this.textures, "arrow")))
    }
    hideOverlay() {
        if (!this.#overlay) return
        this.game.removeOverlay(this.#overlay)
        this.#overlay = undefined
    }
    getOutputPosition() {
        return rotateRelativePosition({x: 0, y: 0}, {x: 1, y:0}, this.baseRotation.a, this.width) as XY
    }
    setRotation(newRot: Rotation) {
        this.rotation = Object.create(newRot)
        this.baseRotation = newRot

        this.#outputPosition = this.getOutputPosition()

        this.hideOverlay()
        this.showOverlay()
    }
    #getTextureName() {
        const [right, left, bottom, top]: boolean[] = [{x: 1, y: 0}, {x:-1, y:0}, {x: 0, y:-1}, {x: 0, y: 1}].map(pos => {
            if (pos.x == this.getOutputPosition().x && pos.y == this.getOutputPosition().y) return true
            const y = this.tilePosition.y + pos.y
            if (y >= this.grid.gridData.length) return false
            else {
                const row = this.grid.gridData[y]
                const x = this.tilePosition.x + pos.x
                if (x >= row.length || !(row[x] instanceof BuildableTile) || !row[x].building) return false
                const building: AnyBuilding = row[x].building as any
                if (building instanceof TrashcanBuilding) return false
                if (building instanceof SeparatorBuilding) return building.getOutputPositions().some(p => building.tilePosition.x + p.x == this.tilePosition.x && building.tilePosition.y + p.y == this.tilePosition.y)
                return building.tilePosition.x + building.getOutputPosition().x == this.tilePosition.x && building.tilePosition.y + building.getOutputPosition().y == this.tilePosition.y
            }
        })
        const trueCount = [right, left, bottom, top].filter(e => e).length
        console.log(this.rotation, this.baseRotation)
        this.rotation = structuredClone(this.baseRotation)
        if (trueCount == 1 || (trueCount == 2 && ((top && bottom) || (left && right)))) return "conveyor"
        else if (trueCount == 2) {
            if (bottom && right) this.rotation.a = 270
            else if (bottom && left) this.rotation.a = 180
            else if (top && left) this.rotation.a = 90
            else if (top && right) this.rotation.a = 0
            return "conveyor-turn"
        }
        else if (trueCount == 3) {
            if (bottom && top && right) this.rotation.a = 270
            else if (bottom && top && left) this.rotation.a = 90
            else if (top && right && left) this.rotation.a = 0
            else if (bottom && left && right) this.rotation.a = 180
            return "conveyor-3way"
        }
        else return "conveyor-4way"
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number): void {

        this.textureName = this.#getTextureName()

        this.draw(c, scale)

        const collidingItems = this.game.collidingItems(this.position)

        collidingItems.forEach(i => {
            if (this.game.collidingItems({ ...this.#outputPosition, width: this.width, height: this.height }).length < 1) {
                i.activity(time)
                if (this.#outputPosition.y) {
                    i.y += this.#outputPosition.y * 0.5 * this.game.speed
                    i.x = this.x
                } else {
                    i.x += this.#outputPosition.x * 0.5 * this.game.speed
                    i.y = this.y
                }
            }
        })
    }
}