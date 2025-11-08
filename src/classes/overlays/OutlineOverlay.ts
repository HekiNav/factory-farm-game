import { Overlay } from "../../bases/Overlay";
import type { Tile } from "../../bases/Tile";

export class OutlineOverlay extends Overlay {
    #color: string
    constructor(tile: Tile, strength: number = 0.2, r = 0, g = 0, b = 0) {
        super(tile)
        this.#color = `rgba(${r}, ${g}, ${b}, ${strength})`
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        const strokeWidth = 1

        c.beginPath()
        c.strokeStyle = this.#color
        c.lineWidth = strokeWidth * scale
        c.strokeRect((this.x + strokeWidth * 0.5) * scale, (this.y + strokeWidth * 0.5) * scale, (this.width - strokeWidth * 0.5) * scale, (this.height - strokeWidth * 0.5) * scale)
        c.closePath()
    }
}