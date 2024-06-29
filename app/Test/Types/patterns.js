import { hlsToString } from "../../General/color_util"

const PatternContainer = ({ children, id, width, height, rotation = 0 }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width='100%' height='100%'>
            <defs>
                <pattern id={id} patternUnits="userSpaceOnUse" width={width} height={height} patternTransform={`rotate(${rotation})`}>
                    {children}
                </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    )
}

export const CheckerboardPattern = ({ width = 80, color1, color2, rotation = 0 }) => {
    const center = width / 2
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const id = 'checkboard'

    return (
        <PatternContainer id={id} width={width} height={width} rotation={rotation}>
            <rect width={width} height={width} fill={hsl1} />
            <rect width={center} height={center} fill={hsl2} />
            <rect width={center} height={center} x={center} y={center} fill={hsl2} />
        </PatternContainer>
    )
}

export const StripePattern = ({ width = 40, color1, color2, rotation = 0 }) => {
    const center = width / 2
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const id = 'stripes'

    return (
        <PatternContainer id={id} width={width} height={width} rotation={rotation}>
            <rect width={center} height={width} fill={hsl1} />
            <rect x={center} width={center} height={width} fill={hsl2} />
        </PatternContainer>
    )
}

export const PolkaDotsPattern = ({ width = 40, color1, color2, dotRadiusRatio = 3, rotation = 0 }) => {
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const radius = width / 2
    const dotRadius = radius / dotRadiusRatio
    const id = 'polkaDots'

    return (
        <PatternContainer id={id} width={width} height={width} rotation={rotation}>
            <rect width={width} height={width} fill={hsl1} />
            <circle cx={radius} cy={radius} r={dotRadius} fill={hsl2} />
        </PatternContainer>
    )
}

export const PlusPattern = ({ color1, color2, width = 40, rotation = 0 }) => {
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const id = 'plusPattern'

    return (
        <PatternContainer id={id} width={width} height={width} rotation={rotation}>
            <rect x='0' y='0' width='100%' height='100%' fill={hsl1} />
            <path d='M3.25 10h13.5M10 3.25v13.5' strokeLinecap='square' strokeWidth='2' stroke={hsl2} fill={hsl2} />
        </PatternContainer>
    )
}

export const CircuitBoardPattern = ({ color1, color2, lineWidth = 1, dotRadius = 3, width = 40, rotation = 0 }) => {
    const hslLine = hlsToString(color2)
    const hslDot = hlsToString(color2)
    const hsl1 = hlsToString(color1)
    const id = 'circuitBoard'

    return (
        <PatternContainer id={id} width={width} height={width} rotation={rotation}>
            <rect width='100%' height='100%' fill={hsl1} />
            <path d={`M0 0 H${width} M0 ${width / 2} H${width} M${width / 2} 0 V${width}`} stroke={hslLine} strokeWidth={lineWidth} fill="none" />
            <circle cx={width / 2} cy={width / 2} r={dotRadius} fill={hslDot} />
            <circle cx="0" cy="0" r={dotRadius} fill={hslDot} />
            <circle cx={width} cy="0" r={dotRadius} fill={hslDot} />
            <circle cx="0" cy={width} r={dotRadius} fill={hslDot} />
            <circle cx={width} cy={width} r={dotRadius} fill={hslDot} />
        </PatternContainer>
    )
}

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

export const TartanPlaidPattern = ({ color1, color2, width = 40, centerWidth = 8, rotation = 0 }) => {
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const id = 'tartanPlaid'

    return (
        <PatternContainer id={id} width={width} height={width} rotation={rotation}>
            <rect width={width} height={width} fill={hsl1} />
            <rect width={width} height={centerWidth} fill={hsl2} y="0" opacity="0.6" />
            <rect width={width} height={centerWidth} fill={hsl2} y={width - centerWidth} opacity="0.6" />
            <rect width={centerWidth} height={width} fill={hsl2} x="0" opacity="0.6" />
            <rect width={centerWidth} height={width} fill={hsl2} x={width - centerWidth} opacity="0.6" />
        </PatternContainer>
    )
}

export const SpeedLinesPattern = ({ color1, color2, lineWidths = [0.5, 1, 2], width = 20, rotation = 0 }) => {
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const [width1, width2, width3] = lineWidths
    const totalWidth = width * 3
    const id = 'speedLines'

    return (
        <PatternContainer id={id} width={totalWidth} height={totalWidth} rotation={rotation}>
            <rect width='100%' height='100%' fill={hsl1} />
            <line x1="0" y1="0" x2={totalWidth} y2={totalWidth} stroke={hsl2} strokeWidth={width1} />
            <line x1={width} y1="0" x2={totalWidth + width} y2={totalWidth} stroke={hsl2} strokeWidth={width2} />
            <line x1={width * 2} y1="0" x2={totalWidth + width * 2} y2={totalWidth} stroke={hsl2} strokeWidth={width3} />
        </PatternContainer>
    )
}