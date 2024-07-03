import { getPositionFromSV, getSVFromPosition, getXLengthInTriangle, withinTriangle_strict } from "./calculation_util";
import { calculateDistance, calculateHLSDifference, ceilToStep, floorToStep, getRandomFloat, getRandomInt, getRandomIntStep, getRandomValue, map, roundToStep, stepInDifficulty } from "./utils";

const triangle_height = Math.sqrt(3) / 2
export function generateAllColorFromTriangle(h_range = [0, 360], l_range = [0, 100], s_range = [0, 100], step = { h: 15, l: 20, s: 20 }) {
    const array = []
    const dict = {}

    const lowH = ceilToStep(h_range[0], step.h)
    const highH = floorToStep(h_range[1], step.h)
    const lowL = ceilToStep(l_range[0], step.l)
    const highL = floorToStep(l_range[1], step.l)

    for (let h = lowH; h <= highH; h += step.h) {
        dict[h] = {}

        for (let l = lowL; l <= highL; l += step.l) {
            const horizonalLength = getXLengthInTriangle(l / 100)
            const stepInTriangle = step.s * triangle_height / 100

            const L = l > 50 ? Math.floor(l) : Math.ceil(l)
            dict[h][L] = []
            const current = dict[h][L]
            const y = l / 100

            for (let x = 0; x <= horizonalLength + 0.02; x += stepInTriangle) {
                let { s } = getSVFromPosition(x, y)
                if (!(s >= s_range[0] && s <= s_range[1])) continue

                const S = Math.floor(s)

                current.push(S)
                array.push({ h, l: L, s: S })
            }
        }
    }

    return { array, dict }
}



function generateRandomColorFromTriangle(h_range = [0, 360], l_range = [0, 100], s_range = [0, 100], step = { h: 15, l: 20, s: 20 }) {
    const { array } = generateAllColorFromTriangle(h_range, l_range, s_range, step)
    return getRandomValue(array);
}


function generateRandomColor(h_range, l_range, s_range, step = { h: 15, l: 20, s: 20 }) {

    const ValueToStep = (f1, f2, arr, step) => [f1(arr[0], step), f2(arr[1], step)]

    h_range = ValueToStep(ceilToStep, floorToStep, h_range, step.h)
    l_range = ValueToStep(ceilToStep, floorToStep, l_range, step.l)
    s_range = ValueToStep(ceilToStep, floorToStep, s_range, step.s)

    // allow wrapping
    const h = getRandomIntStep(h_range[0], h_range[1] + (h_range[1] < h_range[0] ? 360 : 0), step.h) % 361;
    const l = getRandomIntStep(l_range[0], l_range[1] + (l_range[1] < l_range[0] ? 100 : 0), step.l) % 101;
    const s = getRandomIntStep(s_range[0], s_range[1] + (s_range[1] < s_range[0] ? 100 : 0), step.s) % 101;

    return { h, l, s };
}

export const generateRandomColorAdvanced = (hRange, lRange, sRange, mode, step, prevColor) => {

    let newColor;
    do {
        if (mode === 'bw') {
            newColor = generateRandomColor([0, 0], lRange, [0, 0], step);
        } else {
            newColor = generateRandomColorFromTriangle(hRange, lRange, sRange, step);
        }

        console.log('newColor, prevColor :>> ', newColor, prevColor);
        if (!prevColor) break;

        let diff = calculateHLSDifference(prevColor, newColor);
        console.log('diff :>> ', diff);

        if (Math.abs(diff.h) >= 5 || Math.abs(diff.s) >= 5 || Math.abs(diff.l) >= 5) break;

    } while (true);

    return newColor
};

export const defaultHLS = { h: 0, l: 100, s: 0, }
export const defaultLS = (h) => ({ h, l: 100, s: 0, });
export const hlsToString = (hsl) => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
export const hlsToId = (hsl) => [hsl.h, hsl.s, hsl.l].join('');


export const getIsCorrect = (targetColor, selectedColor, mode, difficulty) => {
    const diff = getDifferences(targetColor, selectedColor)
    const accuracy = getAccuracy(targetColor, diff, difficulty)

    return mode === 'bw' ? accuracy.l === 'correct' : accuracy.distance === 'correct'
}

export const getDifferences = (targetColor, selectedColor) => {
    if (!targetColor) return null;

    const { h, s, l } = calculateHLSDifference(targetColor, selectedColor, false);

    // @ts-ignore
    const { x, y } = getPositionFromSV(selectedColor.s, selectedColor.l)
    const { x: tx, y: ty } = getPositionFromSV(targetColor.s, targetColor.l)
    const distance = calculateDistance(x, y, tx, ty) * 100
    const xDistance = x - tx


    return { h, s, l, distance, xDistance }
}

export const getAccuracy = (targetColor, differences, difficulty, allowance = 10) => {
    if (!targetColor) return null;

    const step = stepInDifficulty(difficulty);
    const { x } = getPositionFromSV(targetColor.s, targetColor.l)

    //TODO: my bias hue calculation (> a certain saturation (thinking of using map range), not too bright/dark )
    const HIgnore = x * 100 < step.s || targetColor.l < step.l || targetColor.l > 100 - allowance / step.l / 2
    const hAccurate = HIgnore || Math.abs(differences.h) < step.h / 2
    const sAccurate = Math.abs(differences.s) < step.s / 2;
    const lAccurate = Math.abs(differences.l) < step.l / 2;
    const distanceAccurate = differences.distance <= allowance;

    const stepS = Math.sqrt(3) / 2 * (step.s / 100)
    const sDistanceAccurate = (Math.abs(differences.xDistance)) < (stepS / 2)

    return {
        h: hAccurate ? 'correct' : differences.h < 0 ? 'low' : 'high',
        l: lAccurate ? 'correct' : differences.l < 0 ? 'low' : 'high',
        s: sAccurate ? 'correct' : differences.s < 0 ? 'low' : 'high',

        distance: distanceAccurate ? 'correct' : 'wrong',
        sDistance: sDistanceAccurate ? 'correct' : differences.xDistance < 0 ? 'low' : 'high',
    }
};














