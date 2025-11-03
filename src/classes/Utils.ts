export class Vector2 {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    multiply(b: Vector2) {
        Vector2.multiply(this,b)
    }
    static multiply(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x * b.x, a.y * b.y)
    }
    divide(b: Vector2) {
        Vector2.divide(this,b)
    }
    static divide(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x / b.x, a.y / b.y)
    }
    add(b: Vector2) {
        Vector2.add(this,b)
    }
    static add(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x + b.x, a.y + b.y)
    }
    subtract(b: Vector2) {
        Vector2.add(this,b)
    }
    static subtract(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a.x - b.x, a.y - b.y)
    }
    equals(b: Vector2) {
        Vector2.equals(this,b)
    }
    static equals(a: Vector2, b: Vector2): boolean {
        return a.x === b.x && a.y === b.y
    }
}