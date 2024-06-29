import { withinTriangle_strict } from "./calculation_util";
import { calculateHLSDifference, getRandomFloat, getRandomInt, getRandomIntStep, map, roundToStep, stepInDifficulty } from "./utils";

function generateRandomColorFromTriangle(h_range = [0, 360], s_range = [0, 100], l_range = [0, 100], step = 1) {

    // triangle with w = 1 
    const height = Math.sqrt(3) / 2
    const bb = { x1: 0, y1: l_range[0] / 100, x2: height, y2: l_range[1] / 100 }

    // find a point within the triangle and range
    function generatePosition() {
        let x, y;
        let s, l

        do {
            [x, y] = [getRandomFloat(bb.x1, bb.x2), getRandomFloat(bb.y1, bb.y2)]
            let { s: s_, v: l_ } = getSVFromPosition(x, y)
            s = s_
            l = l_
        } while (!withinTriangle_strict(x, y, bb) || s < s_range[0] || s > s_range[1])

        return { x, y }
    }

    let { x, y } = generatePosition()


    y = roundToStep(y, step / 100).toFixed(2)

    const stepInTriangle = step * height / 100
    //Normalise for uniform distribution after rounding
    const horizonalLength = getXLengthInTriangle(y)
    x = map(x, 0, horizonalLength, - stepInTriangle / 2 , horizonalLength + stepInTriangle / 2 )
    x = roundToStep(x, stepInTriangle).toFixed(2)

    let { s, v: l } = getSVFromPosition(x, y)
    s = Math.min(100, Math.max(0, s))

    const h = getRandomIntStep(h_range[0], h_range[1] + (h_range[1] < h_range[0] ? 360 : 0), step === 20 ? 15 : step) % 361;

    return { h, s, l };
}


function generateRandomColor(h_range, s_range, l_range, step = 1) {
    // allow wrapping
    //TODO: hacking h difficulty
    const h = getRandomIntStep(h_range[0], h_range[1] + (h_range[1] < h_range[0] ? 360 : 0), step === 20 ? 15 : step) % 361;
    const s = getRandomIntStep(s_range[0], s_range[1] + (s_range[1] < s_range[0] ? 100 : 0), step) % 101;
    const l = getRandomIntStep(l_range[0], l_range[1] + (l_range[1] < l_range[0] ? 100 : 0), step) % 101;

    return { h, s, l };
}

export const generateRandomColorAdvanced = (hRange, lRange, sRange, mode, step, prevColor) => {
    let newColor;
    do {
        if (mode === 'bw') {
            newColor = generateRandomColor([0, 0], [0, 0], lRange, step);
        } else {
            newColor = generateRandomColorFromTriangle(hRange, sRange, lRange, step);
        }

        if (!prevColor) break;

        let diff = calculateHLSDifference(prevColor, newColor);
        if (Math.abs(diff.h) >= 5 || Math.abs(diff.s) >= 5 || Math.abs(diff.l) >= 5) break;

    } while (true);

    return newColor
};

export const defaultHLS = { h: 0, l: 0, s: 0, }
export const hlsToString = (hsl) => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

export function getPositionFromSV(s, v, w = 1, bb = { x1: 0, y1: 0 }) {
    function getPositionFromSVNormalised() {
        let y = (100 - v) / 100
        const horizontalLineLength = getXLengthInTriangle(y)
        let x = s / 100 * horizontalLineLength
        return { x, y }
    }

    const { x, y } = getPositionFromSVNormalised()

    return { x: x * w + bb.x1, y: y * w + bb.y1 }
}

export function getSVFromPosition(x, y, w = 1) {
    x /= w
    y /= w
    //trigonometry

    const horizontalLineLength = getXLengthInTriangle(y)
    if (horizontalLineLength < 0.01) return { s: 0, v: 0 }
    const newSaturation = Math.round(x / horizontalLineLength * 100)
    const newValue = Math.round(100 - (y) * 100);

    return { s: newSaturation, v: newValue }
}

export function getHueFromPosition(x, y, centerX, centerY) {
    return Math.round(Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 180)
}

export function getPositionFromHue(hue, radius, centerX, centerY) {
    return {
        x: -(centerX - radius / 2) * Math.cos((hue) / 180 * Math.PI) + centerX,
        y: -(centerY - radius / 2) * Math.sin((hue) / 180 * Math.PI) + centerY,
    }
}

function getXLengthInTriangle(y) {
    const yh = (y < 0.5) ? y : 1 - y
    return Math.tan(Math.PI / 3) * yh
}