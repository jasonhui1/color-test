import ShapeRenderer from "./ShapeRenderer.";
import { hlsToId, hlsToString } from "../../../Utils/color_util";

const createPatternComponent = (patternName, renderPattern) => {
    return ({ width, patternWidth = 40, patternHeight = 40, ...props }) => {
        // const hsl1 = hlsToString(color1);
        // const hsl2 = hlsToString(color2);
        // const id = `${patternName}-${hlsToId(color1)}-${hlsToId(color2)}-${width}`;

        return (
            <PatternContainer name={patternName} width={width} height={width} patternWidth={patternWidth} patternHeight={patternHeight} {...props}>
                {renderPattern({ width: patternWidth, ...props })}
            </PatternContainer>
        );
    };
}

// const PatternDefinitions = ({ shape, pattern, width, height, patternWidth, patternHeight }) => {

//     const idSuffix = `-${width}`;
//     const patternId = `${pattern}${idSuffix}`;
//     const shapeMaskId = `${shape}shapeMask${idSuffix}`;
//     const patternMaskId = `${pattern}patternMask${idSuffix}`;
//     const combinedMaskId = `combinedMask${idSuffix}`;
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox}>
//             <defs>
//                 <pattern id={patternId} patternUnits="userSpaceOnUse" width={patternWidth} height={patternHeight} patternTransform={`translate(${patternWidth / 4}, ${patternHeight / 4}) rotate(${patternRotation}) scale(${patternScale})`}>
//                     {children}
//                 </pattern>

//                 <mask id={shapeMaskId}>
//                     <ShapeRenderer size={width} shape={shape} fill={'white'} />
//                 </mask>

//                 <mask id={patternMaskId}>
//                     <rect width={width} height={height} fill={`url(#${patternId})`} />
//                 </mask>


//                 <mask id={combinedMaskId}>
//                     <rect width={width} height={height} fill="white" mask={`url(#${shapeMaskId})`} />
//                     <rect width={width} height={height} fill="black" mask={`url(#${patternMaskId})`} />
//                 </mask>
//             </defs>
//         </svg>
//     )
// }

const PatternContainer = ({ children, color1, color2, name, width, height, patternWidth, patternHeight, patternRotation = 0, patternScale = 1, viewBox = '0 0 100% 100%', shape = 'Star', shapeRotation = 0 }) => {
    const hsl1 = hlsToString(color1);
    const hsl2 = hlsToString(color2);

    const idSuffix = `-${width}`;
    const patternId = `${name}${idSuffix}`;
    const shapeMaskId = `${shape}shapeMask${idSuffix}`;
    const patternMaskId = `${name}patternMask${idSuffix}`;
    const combinedMaskId = `combinedMask${idSuffix}`;

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox}>
            <defs>
                <pattern id={patternId} patternUnits="userSpaceOnUse" width={patternWidth} height={patternHeight} patternTransform={`translate(${patternWidth / 4}, ${patternHeight / 4}) rotate(${patternRotation}) scale(${patternScale})`}>
                    {children}
                </pattern>

                <mask id={shapeMaskId}>
                    <ShapeRenderer size={width} shape={shape} fill={'white'} />
                </mask>

                <mask id={patternMaskId}>
                    <rect width={width} height={height} fill={`url(#${patternId})`} />
                </mask>


                <mask id={combinedMaskId}>
                    <rect width={width} height={height} fill="white" mask={`url(#${shapeMaskId})`} />
                    <rect width={width} height={height} fill="black" mask={`url(#${patternMaskId})`} />
                </mask>
            </defs>

            <g transform={`rotate(${shapeRotation})`} transform-origin={'center'}>
                <rect width={width} height={height} fill={hsl2} mask={`url(#${shapeMaskId})`} />
                <rect width={width} height={height} fill={hsl1} mask={`url(#${combinedMaskId})`} />
            </g>
        </svg>
    )
}

export const CheckerboardPattern = createPatternComponent('checkboard', ({ width }) => {
    const center = width / 2
    return (
        <>
            <rect width={center} height={center} fill='white' />
            <rect width={center} height={center} x={center} y={center} fill='white' />
        </>
    )
})

export const CheckerboardPatternv2 = createPatternComponent('checkboardv2', ({ width }) => {
    width *= 1.5
    const center = width / 2

    return (
        <>
            <rect width={center} height={center} fill='white' />
            <rect width={center} height={center} x={center} y={center} fill='white' />
        </>
    )
})

export const StripePattern = createPatternComponent('stripes', ({ width }) => {
    const center = width / 2

    return (
        <>
            <rect x={center} width={center} height={width} fill='white' />
        </>
    )
})

export const PolkaDotsPattern = createPatternComponent('polkaDots', ({ width, dotRadiusRatio = 3 }) => {
    const radius = width / 2;
    const dotRadius = radius / dotRadiusRatio;
    return (
        <>
            <circle cx={radius} cy={radius} r={dotRadius} fill='white' />
        </>
    );
});

export const PlusPattern = createPatternComponent('plus', ({ width }) => (
    <>
        <path d='M3.25 10h13.5M10 3.25v13.5' strokeLinecap='square' strokeWidth='3' stroke={'white'} fill={'white'} />
    </>
));

export const CircuitBoardPattern = createPatternComponent('circuitBoard', ({ width, lineWidth = 1, dotRadius = 3 }) => {
    // const hslLine = hsl2
    // const hslDot = hsl2

    return (
        <>
            <path d={`M0 0 H${width} M0 ${width / 2} H${width} M${width / 2} 0 V${width}`} stroke={'white'} strokeWidth={lineWidth} fill="none" />
            <circle cx={width / 2} cy={width / 2} r={dotRadius} fill={'white'} />
            <circle cx="0" cy="0" r={dotRadius} fill={'white'} />
            <circle cx={width} cy="0" r={dotRadius} fill={'white'} />
            <circle cx="0" cy={width} r={dotRadius} fill={'white'} />
            <circle cx={width} cy={width} r={dotRadius} fill={'white'} />
        </>
    )
})

// = Checkboard (rotate 45)
// export const CrosshatchPattern = ({color1, color2, lineWidth = 2, width = 30, rotation = 0}) => {
//     const hsl1 = hlsToString(color1)
//     const hsl2 = hlsToString(color2)
//     const id = 'crosshatch'

//     return (
//         <PatternContainer id={id} width={width} height={width} rotation={rotation}>
//             <rect width='100%' height='100%' fill={hsl1} />
//             <path d={`M0 0 L${width} ${width} M${width} 0 L0 ${width}`} stroke={hsl2} strokeWidth={lineWidth} fill="none" />
//         </PatternContainer>
//     )
// }

export const TartanPlaidPattern = createPatternComponent('tartanPlaid', ({ width = 40, centerWidth = 8 }) => {
    return (
        <>
            <rect width={width} height={centerWidth} y="0" opacity="0.6" fill={'white'} />
            <rect width={width} height={centerWidth} y={width - centerWidth} opacity="0.6" fill={'white'} />
            <rect width={centerWidth} height={width} x="0" opacity="0.6" fill={'white'} />
            <rect width={centerWidth} height={width} x={width - centerWidth} opacity="0.6" fill={'white'} />
        </>
    )
})

export const SpeedLinesPattern = createPatternComponent('speedLines', ({ width = 20, lineWidths = [0.5, 2, 5] }) => {
    let [width1, width2, width3] = lineWidths.map(w => w)

    const pos2 = width1 + width2
    const pos3 = pos2 + width2 + width3
    const totalWidth = 30

    return (
        <>
            <line x1="0" y1="0" x2={totalWidth} y2={totalWidth} stroke={'white'} strokeWidth={width1} />
            <line x1={pos2} y1="0" x2={pos2 + totalWidth} y2={totalWidth} stroke={'white'} strokeWidth={width2} />
            <line x1={pos3} y1="0" x2={totalWidth + pos3} y2={totalWidth} stroke={'white'} strokeWidth={width3} />
        </>
    )
})