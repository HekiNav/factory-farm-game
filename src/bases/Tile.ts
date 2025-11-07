import { Sprite } from "../classes/Sprite"

export class Tile  extends Sprite{
    constructor(x: number, y: number, size: number) {
        super(x, y, size, size)
    }
}