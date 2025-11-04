export class TextureSheet {
    image: HTMLImageElement
    #data: Array<Array<string>>
    constructor(image: HTMLImageElement, data: Array<Array<string>>) {
        this.image = image
        this.#data = data
    }
    getTexture(name: string): [number, number] {
        const tile = this.#data.flat().findIndex(t => t == name)
        if (tile < 0) {
            console.warn(`Texture ${name} not found, defaulting to "${this.#data[0][0]}"`)
            return [0,0]
        } else {
            return [
                tile % this.#data[0].length,
                Math.floor(tile/this.#data.length)
            ]
        }
    }
}