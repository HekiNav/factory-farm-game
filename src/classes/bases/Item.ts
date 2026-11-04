import type { Rotation } from "../Sprite";
import { TextureTile } from "../tiles/TextureTile";
import type { TextureSheet } from "../TileSheet";
import type { XY } from "../Utils";

export class Item extends TextureTile{
    remove: Function
    id: string
    creationTime?: number
    startPos: XY
    constructor(x: number, y: number, size: number, rotation: Rotation, textures: TextureSheet, itemType: string, creationTime: number, variations: string[] = []) {
        super(x, y, size, rotation, textures, itemType + (variations.length ? `-${variations[Math.floor(Math.random()*variations.length)]}` : ""))
        this.startPos = this.xy
        this.id = crypto.randomUUID()
        this.creationTime = creationTime
        this.remove = () => {}
    }
}