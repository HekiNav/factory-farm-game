import { TextureSheet } from './classes/TileSheet'
import './style.css'
import { LevelController } from './classes/LevelController'
import type { GridData } from './classes/Grid'

const BASE_URL = import.meta.env.BASE_URL

async function getLevel(name: string) {
  return await getJson(BASE_URL + "levels/" + name + ".json")
}
async function getJson(url: string) {
  return await (await fetch(url)).json()
}

Promise.all([getJson(BASE_URL + "sprites/index.json"), getLevel("level0"), getLevel("level1"), getLevel("level2")]).then(([tileData, ...levels]) => {
  const textureImage = new Image()
  textureImage.src = BASE_URL +"sprites/tiles.png"
  console.log("LOADING TEXTURES")
  textureImage.addEventListener("load", () => {
    console.log("LOADED TEXTURES")

    const tileSize = 16

    const textureSheet = new TextureSheet(textureImage, tileData, tileSize)

    new LevelController(textureSheet, "#buildMenu", "#game", tileSize, "#overlay", ...levels as GridData[])
  })

})
