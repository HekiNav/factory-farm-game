import { TextureTile } from "../classes/tiles/TextureTile";
import type { TextureSheet } from "../classes/TileSheet";

export class Item extends TextureTile{
    remove: Function
    id: string
    creationTime?: number
    startPos: Record<string, number>
    constructor(x: number, y: number, size: number, textures: TextureSheet, itemType: string, creationTime: number) {
        super(x, y, size, textures, itemType)
        this.startPos = this.xy
        this.id = crypto.randomUUID()
        this.creationTime = creationTime
        this.remove = () => {}
    }
}