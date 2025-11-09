import { Game } from "./Game";
import type { GridData } from "./Grid";
import type { TextureSheet } from "./TileSheet";

export class LevelController {
    #level: number
    #tileSize: number
    #container: string
    #menu: string
    #overlay: string
    #textures: TextureSheet
    #levels: GridData[]
    constructor(textures: TextureSheet, menu: string, container: string, tileSize: number, overlay: string, ...levels: GridData[]) {
        this.#menu = menu
        this.#container = container
        this.#textures = textures
        this.#overlay = overlay
        this.#level = 0
        this.#levels = levels
        this.#tileSize = tileSize
        this.#startLevel()
    }
    #startLevel() {
        if (this.#levels[this.#level].instructions.length) {
            const instructionContainer = document.querySelector(this.#overlay)! as HTMLDivElement
            let instruction = 0
            instructionContainer.hidden = false

            instructionContainer.innerHTML = this.#levels[this.#level].instructions[instruction]
            instructionContainer.addEventListener("click", () => {
                if (instruction >= this.#levels[this.#level].instructions.length - 1) {
                    instructionContainer.hidden = true
                } else {
                    instruction++
                    instructionContainer.innerHTML = this.#levels[this.#level].instructions[instruction]

                }
            })
        }
        new Game({
            grid: {
                data: this.#levels[this.#level],
                tileSize: this.#tileSize
            },
            container: this.#container,
            menu: this.#menu,
            textures: this.#textures,
            onComplete: () => this.#levelComplete()
        }).update(0)
    }
    #win() {
        alert("YOU WIN")
    }
    #levelComplete() {
        if (this.#level >= this.#levels.length - 1) return this.#win()
        this.#level++
        this.#startLevel()
    }
}