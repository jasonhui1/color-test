import { calculateHLSDifference, getRandomIntStep, stepInDifficulty } from "./utils";


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
            newColor = generateRandomColor(hRange, sRange, lRange, step);
        }

        if (!prevColor) break;

        let diff = calculateHLSDifference(prevColor, newColor);
        if (Math.abs(diff.h) >= 5 || Math.abs(diff.s) >= 5 || Math.abs(diff.l) >= 5) break;

    } while (true);

    return newColor
};

export const defaultHLS = { h: 0, l: 0, s: 0, }
export const hlsToString = (hsl) => `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;