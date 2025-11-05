import { TextureTile } from "./tiles/TextureTile";
import type { TextureSheet } from "./TileSheet";

export class Crop extends TextureTile {
    growthState: number
    growthStart?: number
    growthChance: number
    growthStateAmount: number
    lastGrowTime: number
    cropType: string
    constructor(x: number, y: number, size: number, textures: TextureSheet, cropType: string, growthChance: number, growthStateAmount: number) {
        super(x, y, size, textures, cropType + "-0")
        this.growthState = 0
        this.lastGrowTime = 0
        this.growthChance = growthChance
        this.growthStateAmount = growthStateAmount
        this.cropType = cropType
    }
    update(c: CanvasRenderingContext2D, scale: number, time: number) {
        this.draw(c, scale)
        if (!this.growthStart) {
            this.growthStart = time
            this.lastGrowTime = time
        }
        // fully grown check
        if (this.growthState >= this.growthStateAmount - 1) return

        const amountRandomTicks = Math.floor((time - this.lastGrowTime) / 1000)
        // every second, even if game runs at <1 fps (hopefully not)
        for (let i = 0; i < amountRandomTicks; i++) {
            if (Math.random() < this.growthChance) {
                if (this.growthState >= this.growthStateAmount - 1) return
                this.growthState++
                this.textureName = this.cropType + "-" + this.growthState
            }
            this.lastGrowTime = time
        }
    }
}