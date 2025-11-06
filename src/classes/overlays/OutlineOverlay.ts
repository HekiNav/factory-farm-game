import { Overlay } from "../Overlay";
import type { Tile } from "../Tile";

export class OutlineOverlay extends Overlay {
    constructor(tile: Tile) {
        super(tile)
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        const strokeWidth = 1
        c.strokeStyle = "rgba(0, 0, 0, 0.1)"
        c.lineWidth = strokeWidth * scale
        c.rect((this.x + strokeWidth * 0.5) * scale, (this.y + strokeWidth * 0.5) * scale, (this.width - strokeWidth * 0.5) * scale, (this.height - strokeWidth * 0.5) * scale)
        c.stroke()
    }
}