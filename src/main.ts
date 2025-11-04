import { ColorTile } from './classes/tiles/ColorTile'
import { EmptyTile } from './classes/tiles/EmptyTile'
import { FarmlandTile } from './classes/tiles/FarmlandTile'
import { TextureSheet } from './classes/TileSheet'
import { Game } from './classes/Game'
import './style.css'

const BASE_URL = import.meta.env.BASE_URL

const tiles = {
  "empty": EmptyTile,
  "color": ColorTile,
  "farmland": FarmlandTile
}

async function getLevel(name: string) {
  return await getJson(BASE_URL + "levels/" + name + ".json")
}
async function getJson(url: string) {
  return await (await fetch(url)).json()
}

Promise.all([getLevel("test"), getJson(BASE_URL + "sprites/index.json")]).then(([levelData, tileData]) => {
  const textureImage = new Image()
  textureImage.src = "/sprites/tiles.png"
  console.log("LOADING TEXTURES")
  textureImage.addEventListener("load", () => {
    console.log("LOADED TEXTURES")

    const textureSheet = new TextureSheet(textureImage, tileData)

    const game = new Game({
      grid: {
        data: levelData,
        tileSize: 16
      },
      container: "#game",
      textures: textureSheet
    }, tiles)
    game.update()
  })

})
