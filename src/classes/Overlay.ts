import { Tile } from "./Tile";

export class Overlay extends Tile {
    id: string
    constructor(tile: Tile) {
        super(tile.x, tile.y, tile.width)
        this.id = crypto.randomUUID()
    }
}