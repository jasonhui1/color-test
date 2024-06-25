// First, let's include our previous RGB to HSL conversion function
export function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [
        Math.round(h * 360),
        Math.round(s * 100),
        Math.round(l * 100)
    ];
}

// Now, let's create a function to convert hex to HSL
export function hexToHsl(hex) {
    // Remove the hash if it's there
    hex = hex.replace(/^#/, '');

    // Parse the hex string
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    // Use our rgbToHsl function
    return rgbToHsl(r, g, b);
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomIntStep(min, max, step) {
    const steps = Math.floor((max - min) / step);
    const randomStep = Math.floor(Math.random() * (steps + 1));
    return min + (randomStep * step);
}


export const calculateHLSDifference = (color1, color2, abs = true) => {
    const HDiff = Math.abs(color1.h - color2.h);
    let LDiff = -(color1.v - color2.v);
    let SDiff = -(color1.s - color2.s);

    LDiff = abs ? LDiff : Math.abs(LDiff);
    SDiff = abs ? SDiff : Math.abs(SDiff);

    return {
        h: HDiff > 180 ? 360 - HDiff : HDiff,
        l: LDiff,
        s: SDiff,
    };
};