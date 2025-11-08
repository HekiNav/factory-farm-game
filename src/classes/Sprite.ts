import type { XY } from "./Utils"

export class Sprite {
    x: number
    y: number
    width: number
    height: number
    rotation: Rotation
    constructor(x: number, y: number, width: number, height: number, rotation: Rotation) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.rotation = rotation
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
    get tileCenter() {
        return { x: (this.x + this.width * 0.5) / this.width, y: (this.y + this.height * 0.5) / this.height }
    }
    get tilePosition() {
        return { x: this.x / this.width, y: this.y / this.height}
    }
    set center(xy: XY) {
        this.x = xy.x - this.width * 0.5
        this.y = xy.y - this.height * 0.5
    }
}
export interface Rotation {
    x: number,
    y: number,
    a: number
}
export const ROTATION: Record<string, Rotation> = {
    UP: {
        x: 1, y: 1, a: 0
    }
}