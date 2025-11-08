import type { XY } from "./Utils"

export class Sprite {
    x: number
    y: number
    width: number
    height: number
    constructor(x: number, y: number, width: number, height: number) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
    }
    draw(_c: CanvasRenderingContext2D, _scale: number) {
        // default, do nothing
        // draw functions declared in extended classes
    }
    update(c: CanvasRenderingContext2D, scale: number, _time: number) {
        this.draw(c, scale)
    }
    get position() {
        return { x: this.x, y: this.y, width: this.width, height: this.height }
    }
    get xy() {
        return { x: this.x, y: this.y }
    }
    set xy(xy: XY) {
        this.x = xy.x
        this.y = xy.y
    }
    get center() {
        return { x: this.x + this.width * 0.5, y: this.y + this.height * 0.5 }
    }
    set center(xy: XY) {
        this.x = xy.x - this.width * 0.5
        this.y = xy.y - this.height * 0.5
    }
}