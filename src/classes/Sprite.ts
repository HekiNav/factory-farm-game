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
        return {x: this.x, y: this.y, width: this.width, height: this.height}
    }
    get xy() {
        return {x: this.x, y: this.y}
    }
}
export interface Location {
    x: number,
    y: number,
    width: number,
    height: number
}