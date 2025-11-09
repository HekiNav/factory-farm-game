import { Building } from "../bases/Building";
import { GameEventType, type Game } from "../Game";
import type { RelativePosition } from "../Grid";
import type Grid from "../Grid";
import { OverlayCollection } from "../OverlayCollection";
import { OutlineOverlay } from "../overlays/OutlineOverlay";
import { Tile } from "../bases/Tile";
import { FarmlandTile } from "../tiles/FarmlandTile";
import type { TextureSheet } from "../TileSheet";
import { Item } from "../bases/Item";
import { range, rotateRelativePosition, type XY } from "../Utils";
import { ROTATION, type Rotation } from "../Sprite";

export class HarvesterBuilding extends Building {
    #pulledItems: Array<Item>
    #overlay?: string
    affectedPositions: RelativePosition
    #outputPosition: XY
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, game: Game, grid: Grid, events = true) {
        super(x, y, size, rotation, textures, "harvester", game, grid)
        this.#pulledItems = []

        this.affectedPositions = this.#getAffectedPositions()

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
        return rotateRelativePosition({x: 0, y: 0}, { x: 1, y: 0 }, this.rotation.a, this.width) as XY
    }
    #getAffectedPositions() {
        return rotateRelativePosition({x: 0, y: 0}, { x: [-3, -1], y: [-1, 1] }, this.rotation.a, this.width)
    }
    showOverlay() {
        if (this.#overlay) return
        this.#overlay = this.game.addOverlay(
            new OverlayCollection(
                ...this.#getRelativeTiles().map(t => new OutlineOverlay(t, 0.5)),
                new OutlineOverlay(this.grid.getRelativeTiles(this.position, this.#outputPosition)[0], 0.5, 255, 127, 0)
            )
        )
    }
    hideOverlay() {
        if (!this.#overlay) return
        this.game.removeOverlay(this.#overlay)
        this.#overlay = undefined
    }
    #getRelativeTiles() {
        return this.grid.getRelativeTiles(this.position, this.affectedPositions).reduce(
            (prev: Tile[], curr?: Tile) => {
                return curr ? [...prev, curr] : prev
            }, [])
    }
    setRotation(newRot: Rotation) {
        this.rotation = newRot
        this.affectedPositions = this.#getAffectedPositions()

        this.#outputPosition = this.#getOutputPosition()

        this.hideOverlay()
        this.showOverlay()
    }
    update(_c: CanvasRenderingContext2D, _scale: number, time: number) {
        this.game.drawAsOverlay(this)
        this.#getRelativeTiles().filter(t =>
            t && t instanceof FarmlandTile && t.crop?.fullyGrown
        ).forEach((t: Tile) => {
            if (this.#pulledItems.find(i => i.x == t.x && i.y == t.y)) return // if backed up
            (t as FarmlandTile).replant()
            this.#pulledItems.push(new Item(t.x, t.y, this.width, ROTATION.UP, this.textures, (t as FarmlandTile).crop?.cropType || "", time))
        })
        const collidingItems = this.game.collidingItems(this.position)

        collidingItems.forEach(i => {
            if (this.game.collidingItems({...this.#outputPosition, width: this.width, height: this.height}).length < 2) {
                i.x += this.#outputPosition.x * 0.5
                i.y += this.#outputPosition.y * 0.5
            }
        })

        const pullTime = 2000 //ms
        this.#pulledItems.forEach(i => {
            const elapsedSinceCreation = time - i.creationTime!
            if (elapsedSinceCreation > pullTime && collidingItems.length <= 1) {
                this.game.addItem(this.x, this.y, this.#pulledItems.splice(this.#pulledItems.indexOf(i), 1)[0].textureName, time)
                return
            } else if (collidingItems.length <= 1) {
                i.x = Math.floor(range(0, pullTime, i.startPos.x, this.x, elapsedSinceCreation))
                i.y = Math.floor(range(0, pullTime, i.startPos.y, this.y, elapsedSinceCreation))
            } else {
                i.startPos = i.position
                i.creationTime = time
            }
            this.game.drawAsOverlay(i)
        })
    }
}