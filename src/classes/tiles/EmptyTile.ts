import { Tile } from "../Tile";

export class EmptyTile extends Tile{
    constructor (x: number, y: number, size: number) {
        super(x, y, size)
    }
}