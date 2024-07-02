import { hlsToId, hlsToString } from "../../../Utils/color_util"
import ShapeRenderer from "./ShapeRenderer.";
import { CrescentShape, HeartShape, StarShape, TriangleShape } from "./basic_shape"

const PatternContainer = ({ children, id, width, height, rotation = 0, scale = 1, viewBox = '0 0 100% 100%', shape = 'Star' }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width='200' height='100%' viewBox={viewBox}>
            <defs>
                <pattern id={id} patternUnits="userSpaceOnUse" width={width} height={height} patternTransform={`rotate(${rotation}) scale(${scale})`}>
                    {children}
                </pattern>
            </defs>
            {/* <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} /> */}
            {/* {(shape === 'Star') && <CrescentShape size='200' fill={`url(#${id})`} />} */}
            <ShapeRenderer size='200' fill={`url(#${id})`} shape={shape} />
        </svg>
    )
}

const createPatternComponent = (patternName, renderPattern) => {
    return ({ width, color1, color2, rotation = 0, shape = 'Star', ...props }) => {
        const hsl1 = hlsToString(color1);
        const hsl2 = hlsToString(color2);
        const id = `${patternName}-${hlsToId(color1)}-${hlsToId(color2)}`;

        return (
            <PatternContainer id={id} width={width} height={width} rotation={rotation} shape={shape}>
                {renderPattern({ width, hsl1, hsl2, ...props })}
            </PatternContainer>
        );
    };
}


export const CheckerboardPattern = createPatternComponent('checkboard', ({ width, hsl1, hsl2 }) => {
    const center = width / 2

    return (
        <>
            <rect width={width} height={width} fill={hsl1} />
            <rect width={center} height={center} fill={hsl2} />
            <rect width={center} height={center} x={center} y={center} fill={hsl2} />
        </>
    )
})

export const CheckerboardPatternv2 = createPatternComponent('checkboard', ({ width, hsl1, hsl2 }) => {
    width *= 1.5
    const center = width / 2

    return (
        <>
            <rect width={width} height={width} fill={hsl1} />
            <rect width={center} height={center} fill={hsl2} />
            <rect width={center} height={center} x={center} y={center} fill={hsl2} />
        </>
    )
})

export const StripePattern = createPatternComponent('stripes', ({ width, hsl1, hsl2 }) => {
    const center = width / 2

    return (
        <>
            <rect width={center} height={width} fill={hsl1} />
            <rect x={center} width={center} height={width} fill={hsl2} />
        </>
    )
})

export const PolkaDotsPattern = createPatternComponent('polkaDots', ({ width, hsl1, hsl2, dotRadiusRatio = 3 }) => {
    const radius = width / 2;
    const dotRadius = radius / dotRadiusRatio;
    return (
        <>
            <rect width={width} height={width} fill={hsl1} />
            <circle cx={radius} cy={radius} r={dotRadius} fill={hsl2} />
        </>
    );
});

export const PlusPattern = createPatternComponent('plus', ({ width, hsl1, hsl2 }) => (
    <>
        <rect x='0' y='0' width='100%' height='100%' fill={hsl1} />
        <path d='M3.25 10h13.5M10 3.25v13.5' strokeLinecap='square' strokeWidth='3' stroke={hsl2} fill={hsl2} />
    </>
));

export const CircuitBoardPattern = createPatternComponent('circuitBoard', ({ width, hsl1, hsl2, lineWidth = 1, dotRadius = 3 }) => {
    const hslLine = hsl2
    const hslDot = hsl2

    return (
        <>
            <rect width='100%' height='100%' fill={hsl1} />
            <path d={`M0 0 H${width} M0 ${width / 2} H${width} M${width / 2} 0 V${width}`} stroke={hslLine} strokeWidth={lineWidth} fill="none" />
            <circle cx={width / 2} cy={width / 2} r={dotRadius} fill={hslDot} />
            <circle cx="0" cy="0" r={dotRadius} fill={hslDot} />
            <circle cx={width} cy="0" r={dotRadius} fill={hslDot} />
            <circle cx="0" cy={width} r={dotRadius} fill={hslDot} />
            <circle cx={width} cy={width} r={dotRadius} fill={hslDot} />
        </>
    )
})

// = Checkboard (rotate 45)
// export const CrosshatchPattern = ({ color1, color2, lineWidth = 2, width = 30, rotation = 0 }) => {
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

export const TartanPlaidPattern = createPatternComponent('tartanPlaid', ({ width = 40, hsl1, hsl2, centerWidth = 8 }) => {
    return (
        <>
            <rect width={width} height={width} fill={hsl1} />
            <rect width={width} height={centerWidth} fill={hsl2} y="0" opacity="0.6" />
            <rect width={width} height={centerWidth} fill={hsl2} y={width - centerWidth} opacity="0.6" />
            <rect width={centerWidth} height={width} fill={hsl2} x="0" opacity="0.6" />
            <rect width={centerWidth} height={width} fill={hsl2} x={width - centerWidth} opacity="0.6" />
        </>
    )
})

export const SpeedLinesPattern = createPatternComponent('speedLines', ({ width = 20, hsl1, hsl2, lineWidths = [0.5, 2, 5] }) => {
    let [width1, width2, width3] = lineWidths.map(w => w)

    const pos2 = width1 + width2
    const pos3 = pos2 + width2 + width3
    const totalWidth = 30

    return (
        <>
            <rect width='100%' height='100%' fill={hsl1} />
            <line x1="0" y1="0" x2={totalWidth} y2={totalWidth} stroke={hsl2} strokeWidth={width1} />
            <line x1={pos2} y1="0" x2={pos2 + totalWidth} y2={totalWidth} stroke={hsl2} strokeWidth={width2} />
            <line x1={pos3} y1="0" x2={totalWidth + pos3} y2={totalWidth} stroke={hsl2} strokeWidth={width3} />
        </>
    )
})