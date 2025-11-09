import { Tile } from "../bases/Tile";
import { ROTATION } from "../Sprite";

export class ColorTile extends Tile{
    color: string
    constructor (x: number, y: number, size: number, color: string) {
        super(x, y, size, ROTATION.UP)
        this.color = color
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        c.fillStyle = this.color
        c.fillRect(this.x * scale, this.y * scale, this.width * scale, this.height * scale)
    }
}