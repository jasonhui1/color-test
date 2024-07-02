import { getPositionFromSV, getSVFromPosition, withinTriangle_strict } from "./calculation_util";
import { calculateDistance, calculateHLSDifference, ceilToStep, floorToStep, getRandomFloat, getRandomInt, getRandomIntStep, map, roundToStep, stepInDifficulty } from "./utils";

function generateRandomColorFromTriangle(h_range = [0, 360], s_range = [0, 100], l_range = [0, 100], step = { h: 15, l: 20, s: 20 }) {

    // triangle with w = 1 
    const height = Math.sqrt(3) / 2
    const bb = { x1: 0, y1: l_range[0] / 100, x2: height, y2: l_range[1] / 100 }
    // console.log('bb :>> ', bb);

    // find a point within the triangle and range
    function generatePosition() {
        let x, y;
        let s, l

        do {
            [x, y] = [getRandomFloat(bb.x1, bb.x2), getRandomFloat(bb.y1, bb.y2)]
            let { s: s_, v: l_ } = getSVFromPosition(x, y)
            s = s_
            l = l_

            // console.log('x,y,s,l :>> ', x,y,s,l,withinTriangle_strict(x, y, bb) , s < s_range[0], s > s_range[1],   );
        } while (!withinTriangle_strict(x, y, bb) || s < s_range[0] || s > s_range[1])

        return { x, y }
    }

    let { x, y } = generatePosition()


    y = roundToStep(y, step.l / 100).toFixed(2)

    const stepInTriangle = step.s * height / 100
    //Normalise for uniform distribution after rounding
    // const horizonalLength = getXLengthInTriangle(y)
    // x = map(x, 0, horizonalLength, - stepInTriangle / 2 , horizonalLength + stepInTriangle / 2 )
    x = roundToStep(x, stepInTriangle).toFixed(2)

    let { s, v: l } = getSVFromPosition(x, y)
    s = Math.min(100, Math.max(0, s))

    const h = getRandomIntStep(h_range[0], h_range[1] + (h_range[1] < h_range[0] ? 360 : 0), step.h) % 361;

    return { h, s, l };
}


function generateRandomColor(h_range, s_range, l_range, step = { h: 15, l: 20, s: 20 }) {

    const ValueToStep = (f1, f2, arr, step) => [f1(arr[0], step), f2(arr[1], step)]

    h_range = ValueToStep(ceilToStep, floorToStep, h_range, step.h)
    s_range = ValueToStep(ceilToStep, floorToStep, s_range, step.s)
    l_range = ValueToStep(ceilToStep, floorToStep, l_range, step.l)

    // allow wrapping
    const h = getRandomIntStep(h_range[0], h_range[1] + (h_range[1] < h_range[0] ? 360 : 0), step.h) % 361;
    const s = getRandomIntStep(s_range[0], s_range[1] + (s_range[1] < s_range[0] ? 100 : 0), step.s) % 101;
    const l = getRandomIntStep(l_range[0], l_range[1] + (l_range[1] < l_range[0] ? 100 : 0), step.l) % 101;

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
        console.log('prevColor  :>> ', prevColor);

        let diff = calculateHLSDifference(prevColor, newColor);
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














