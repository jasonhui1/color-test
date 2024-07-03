// export const allDifficulties = [
//     { value: 'easy', label: 'Level 1', step: { h: 15, l: 20, s: 20 } },
//     { value: 'normal-', label: 'Level 2', step: { h: 15, l: 10, s: 20 } },
//     { value: 'normal', label: 'Level 3', step: { h: 15, l: 10, s: 10 } },
//     { value: 'normal+', label: 'Level 4', step: { h: 10, l: 10, s: 10 } },
//     { value: 'hard-', label: 'Level 5', step: { h: 10, l: 5, s: 10 } },
//     { value: 'hard', label: 'Level 6', step: { h: 10, l: 5, s: 5 } },
//     { value: 'hard+', label: 'Level 7', step: { h: 5, l: 5, s: 5 } },
// ];

export const allDifficulties = [
    { value: 'easy', label: 'Level 1', step: { h: 15, l: 25, s: 25 } },
    { value: 'normal-', label: 'Level 2', step: { h: 15, l: 12.5, s: 25 } },
    { value: 'normal-altS', label: 'Level 2 altS', step: { h: 15, l: 25, s: 12.5 } },
    { value: 'normal', label: 'Level 3', step: { h: 15, l: 12.5, s: 12.5 } },
    { value: 'normal+', label: 'Level 4', step: { h: 10, l: 12.5, s: 12.5 } },
    { value: 'hard-', label: 'Level 5', step: { h: 10, l: 6.25, s: 12.5 } },
    { value: 'hard', label: 'Level 6', step: { h: 10, l: 6.25, s: 6.25 } },
    { value: 'hard+', label: 'Level 7', step: { h: 6.25, l: 6.25, s: 6.25 } },
];

export const colorOptions = [
    { value: 'all', label: 'All Colors', range: [0, 360] },
    { value: 'red', label: 'Red', range: [330, 15] },
    { value: 'orange', label: 'Orange', range: [15, 45] },
    { value: 'yellow', label: 'Yellow', range: [45, 75] },
    { value: 'green', label: 'Green', range: [75, 150] },
    { value: 'cyan', label: 'Cyan', range: [150, 210] },
    { value: 'blue', label: 'Blue', range: [210, 240] },
    { value: 'indigo', label: 'Indigo', range: [240, 270] },
    { value: 'purple', label: 'Purple', range: [270, 330] },
    { value: 'custom', label: 'Custom', range: [] },
];

export const brightnessOptions = [
    { value: 'all', label: 'All Brightness', range: [0, 100] },
    { value: 'very bright', label: 'Very Bright', range: [75, 97] },
    { value: 'bright', label: 'Bright', range: [50, 75] },
    { value: 'dim', label: 'Dim', range: [25, 50] },
    { value: 'very dim', label: 'Very Dim', range: [10, 25] },
    { value: 'custom', label: 'Custom', range: [] },

];
export const saturationOptions = [
    { value: 'all', label: 'All Saturation', range: [0, 100] },
    { value: 'very saturated', label: 'Very Saturated', range: [75, 100] },
    { value: 'saturated', label: 'Saturated', range: [50, 75] },
    { value: 'less saturated', label: 'Less Saturated', range: [25, 50] },
    { value: 'desaturated', label: 'Desaturated', range: [0, 25] },
    { value: 'custom', label: 'Custom', range: [] },
];

export const all_testNum = [
    { value: 5, label: '5' },
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
]

export const all_modes = [
    { value: 'normal', label: 'normal' },
    { value: 'bw', label: 'black and white' },
    { value: 'compare', label: 'compare' },
];

