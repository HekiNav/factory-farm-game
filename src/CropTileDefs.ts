import { CornCrop } from "./classes/crops/CornCrop"
import { PumpkinCrop } from "./classes/crops/PumpkinCrop"
import { WheatCrop } from "./classes/crops/WheatCrop"
import { BuildableTile } from "./classes/tiles/BuildableTile"
import { ColorTile } from "./classes/tiles/ColorTile"
import { DestinationTile } from "./classes/tiles/DestinationTile"
import { EmptyTile } from "./classes/tiles/EmptyTile"
import { FarmlandTile } from "./classes/tiles/FarmlandTile"
import { TextureTile } from "./classes/tiles/TextureTile"

export const tiles = {
  "empty": EmptyTile,
  "color": ColorTile,
  "farmland": FarmlandTile,
  "texture": TextureTile,
  "buildable": BuildableTile,
  "destination": DestinationTile
}
export const crops = {
  "wheat": WheatCrop,
  "corn": CornCrop,
  "pumpkin": PumpkinCrop
}
export interface ObjectDetails {
  title: string,
  desc: string
}
export const cropData: Record<string, ObjectDetails> = {
  "wheat": {
    title: "Wheat",
    desc: "Grows a bit faster than corn but the grains need separating",
  },
  "corn": {
    title: "Corn",
    desc: "Its corn",
  },
  "pumpkin": {
    title: "Pumpkin",
    desc: "Spooky!",
  }
}
