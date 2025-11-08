import type { RelativePosition } from "./Grid";

export function isPositionInBounds(x: number, y: number, bounds: Location) {
    return x >= bounds.x &&
        x < bounds.x + bounds.width &&
        y >= bounds.y &&
        y < bounds.y + bounds.height
}
export const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
export const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
export const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
export const range = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    a: number
) => lerp(x2, y2, invlerp(x1, y1, a));
export interface Location {
    x: number,
    y: number,
    width: number,
    height: number
}
export interface XY {
    x: number,
    y: number
}
export function rotatePoint(cxy: XY, xy: XY, angle: number) {
    const radians = (Math.PI / 180) * -angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (xy.x - cxy.x)) + (sin * (xy.y - cxy.y)) + cxy.x,
        ny = (cos * (xy.y - cxy.y)) - (sin * (xy.x - cxy.x)) + cxy.y;
    return { x: nx, y: ny };
}
interface RelativeArrayPosition {
    x: [number, number],
    y: [number, number]
}
export function rotateRelativePosition(center: XY, relative: RelativePosition, angle: number, size: number) {
    const half = size * 0.5
    const centerPos = { x: center.x + half, y: center.y + half }
    if (!(relative.x instanceof Array)) {
        const pos = relative as XY
        const rotatedPos = rotatePoint(centerPos, {x: pos.x + half, y: pos.y + half}, angle)
        return {x: Math.floor(rotatedPos.x - half), y: Math.floor(rotatedPos.y - half)}
    }
    let newRelative: RelativeArrayPosition = { x: [0, 0], y: [0, 0] };

    [relative.x].flat().forEach((xPos: number, i: number) => {
        const yPos = [relative.y].flat()[i]
        const rotatedPos = rotatePoint(centerPos, { x: xPos + half, y: yPos + half }, angle)
        newRelative.x[i] = Math.floor(rotatedPos.x - half)
        newRelative.y[i] = Math.floor(rotatedPos.y - half)
    });
    return newRelative
}
