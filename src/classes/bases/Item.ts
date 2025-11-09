import type { Rotation } from "../Sprite";
import { TextureTile } from "../tiles/TextureTile";
import type { TextureSheet } from "../TileSheet";
import type { XY } from "../Utils";

export class Item extends TextureTile{
    remove: Function
    id: string
    creationTime?: number
    startPos: XY
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, itemType: string, creationTime: number) {
        super(x, y, size, rotation, textures, itemType)
        this.startPos = this.xy
        this.id = crypto.randomUUID()
        this.creationTime = creationTime
        this.remove = () => {}
    }
}