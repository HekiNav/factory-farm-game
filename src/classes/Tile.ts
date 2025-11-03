import { Sprite } from "./Sprite"

export class Tile  extends Sprite{
    constructor(x: number, y: number, size: number) {
        super(x, y, size, size)
    }
}