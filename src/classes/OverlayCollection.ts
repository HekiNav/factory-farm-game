import type { Overlay } from "./Overlay";

export class OverlayCollection{
    #overlays: Array<Overlay>
    id: string
    constructor(...overlays: Overlay[]) {
        this.#overlays = overlays
        this.id = crypto.randomUUID()
    }
    draw(c: CanvasRenderingContext2D, scale: number) {
        this.#overlays.forEach(o => o.draw(c, scale))
    }
}