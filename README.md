# Harvest
A modular grid-based factory/farming game made with vanilla TypeScript and HTML5 canvases

## Features
- Automatical resizing
- Modular levels, sprites and tiles
- Building placement with rotation
- Dynamic belt shapes

## Processing trees
```
[CORN] (No further processing options)

[WHEAT]--SEPARATOR->[GRAINS]--MILL->[FLOUR]--OVEN->[BREAD]
                  ->[STRAW]

[PUMPKIN]--SEPARATOR->[PUMPKIN FLESH]--OVEN->[PUMPKIN SOUP]
                    ->[CARVED PUMPKIN] (3 different designs)
```

## Known bugs
- ~~Overlays sometimes stay even if their building is removed (only visual)~~[FIXED]
- In rare cases, it is sometimes possible to build buildings on farmland (buildings disappear the next frame)
## Demo
Github pages [here](https://hekinav.github.io/factory-farm-game)

## Running yourself

1. `npm install`
2. `npm run dev`

More instructions on the [Vite docs](https://vite.dev/guide/#command-line-interface)