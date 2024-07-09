
export const CheckerboardPattern = ({ width }) => {
    const center = width / 2
    return (
        <>
            <rect width={center} height={center} fill='white' />
            <rect width={center} height={center} x={center} y={center} fill='white' />
        </>
    )
}

export const CheckerboardPatternv2 = ({ width }) => {
    width *= 1.5
    const center = width / 2

    return (
        <>
            <rect width={center} height={center} fill='white' />
            <rect width={center} height={center} x={center} y={center} fill='white' />
        </>
    )
}

export const StripePattern = ({ width }) => {
    const center = width / 2

    return (
        <>
            <rect x={center} width={center} height={width} fill='white' />
        </>
    )
}

export const PolkaDotsPattern = ({ width, dotRadiusRatio = 3 }) => {
    const radius = width / 2;
    const dotRadius = radius / dotRadiusRatio;
    return (
        <>
            <circle cx={radius} cy={radius} r={dotRadius} fill='white' />
        </>
    );
};

export const PlusPattern = ({ width }) => (
    <>
        <path d='M3.25 10h13.5M10 3.25v13.5' strokeLinecap='square' strokeWidth='3' stroke={'white'} fill={'white'} />
    </>
);

export const CircuitBoardPattern = ({ width, lineWidth = 1, dotRadius = 3 }) => {
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
}

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

export const TartanPlaidPattern = ({ width = 40, centerWidth = 8 }) => {
    return (
        <>
            <rect width={width} height={centerWidth} y="0" opacity="0.6" fill={'white'} />
            <rect width={width} height={centerWidth} y={width - centerWidth} opacity="0.6" fill={'white'} />
            <rect width={centerWidth} height={width} x="0" opacity="0.6" fill={'white'} />
            <rect width={centerWidth} height={width} x={width - centerWidth} opacity="0.6" fill={'white'} />
        </>
    )
}

export const SpeedLinesPattern = ({ width = 20, lineWidths = [0.5, 2, 5] }) => {
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
}