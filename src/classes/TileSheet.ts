export class TextureSheet {
    image: HTMLImageElement
    #data: Array<Array<string>>
    tileSize: number
    constructor(image: HTMLImageElement, data: Array<Array<string>>, tileSize: number) {
        this.image = image
        this.#data = data
        this.tileSize = tileSize
    }
    getTexture(name: string): [number, number] {
        const tile = this.#data.flat().findIndex(t => t == name)
        if (tile < 0) {
            console.warn(`Texture ${name} not found, defaulting to "${this.#data[0][0]}"`)
            return [0, 0]
        } else {
            return [
                tile % this.#data[0].length * this.tileSize,
                Math.floor(tile / this.#data.length) * this.tileSize
            ]
        }
    }
}