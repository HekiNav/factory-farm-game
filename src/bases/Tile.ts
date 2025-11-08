import { Sprite, type Rotation } from "../classes/Sprite"

export class Tile  extends Sprite{
    constructor(x: number, y: number, size: number, rotation: Rotation) {
        super(x, y, size, size, rotation)
    }
}