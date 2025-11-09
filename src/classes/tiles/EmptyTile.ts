import { Tile } from "../bases/Tile";
import type { Rotation } from "../Sprite";

export class EmptyTile extends Tile{
    constructor (x: number, y: number, size: number, rotation: Rotation) {
        super(x, y, size, rotation)
    }
}