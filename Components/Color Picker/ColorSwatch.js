
const ColorSwatch = ({ color, size = 1, onClick = null, style = {}, border = false, borderWidth = 2, borderColor = 'slate-700' }) => {

    const backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    const width = size * 3 + 'rem'
    // const borderStyle = border ? `border-${borderWidth} border-red-500` : ''
    const borderStyle = border ? `border-${borderWidth} border-slate-500` : ''
    return (
        <div
            style={{ backgroundColor: `${backgroundColor}`, width: width, height: width, ...style }}
            className={`w-6 h-6 rounded ${borderStyle} ${onClick ? 'cursor-pointer ' : ''}`}
            onClick={onClick}
        />
    );
};

// Not work , need maths calculation? not sure
// export const ColorGradient = ({ color1, color2, size = 1, onClick = null, style = {}, border = false, borderWidth = 2, borderColor = 'slate-700' }) => {

//     const hsl1 = `hsl(${color1.h}, ${color1.s}%, ${color1.l}%)`;
//     const hsl2 = `hsl(${color2.h}, ${color2.s}%, ${color2.l}%)`;

//     const backgroundColor = `linear-gradient(to right, ${hsl1} 0%,  ${hsl2}100% )`;
//     const width = size * 3 + 'rem'
//     // const borderStyle = border ? `border-${borderWidth} border-red-500` : ''
//     const borderStyle = border ? `border-${borderWidth} border-slate-500` : ''
//     return (
//         <div
//             style={{ background: `${backgroundColor}`, width: width, height: width, ...style }}
//             className={`w-6 h-6 rounded ${borderStyle} ${onClick ? 'cursor-pointer ' : ''}`}
//             onClick={onClick}
//         />
//     );
// };

export default ColorSwatch