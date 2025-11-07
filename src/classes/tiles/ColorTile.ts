import { Tile } from "../../bases/Tile";

export class ColorTile extends Tile{
    color: string
    constructor (x: number, y: number, size: number, color: string) {
        super(x, y, size)
        this.color = color
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        c.fillStyle = this.color
        c.fillRect(this.x * scale, this.y * scale, this.width * scale, this.height * scale)
    }
}