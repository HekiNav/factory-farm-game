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
    draw(c: CanvasRenderingContext2D, scale: number) {
        const testColors = ["black", "white"]
        c.fillStyle = testColors[Math.floor(Math.random() * testColors.length)]
        console.log(this.x,this.y, this.height, scale)
        c.fillRect(this.x * scale, this.y * scale, this.width * scale, this.height * scale)
    }
}