import { hlsToString } from "../../General/color_util"

export const YingYangLike = ({ color1, color2, radius }) => {
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const d = radius * 2

    return (
        <svg width={d} height={d} >
            <circle cx={radius} cy={radius} r={radius} fill={hsl1} />
            <path d={`M${radius} 0 a${radius},${radius} 0 0,1 0,${d} a${radius / 2},${radius / 2} 0 0,1 0,-${radius} a${radius / 2},${radius / 2} 0 0,0 0,-${radius}`} fill={hsl2} />
        </svg>
    )
}

export const Gradient = ({ color1, color2 }) => {
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const background =
        `linear-gradient(to right, ${hsl1} 0%,  ${hsl2}100% `

    return (
        <div style={{ background }} className="h-24 w-full"></div>
    )
}

export const MoveOver = ({ color1, color2, height = 100 }) => {
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)

    const cy = height / 2
    return (
        <svg height={height}>
            <g id="stripes">
                <rect x="0" y="0" width="100%" height="100%" fill={hsl1} />
                <rect x="30" y="0" width="100%" height="100%" fill={hsl2} stroke="none">
                    <animate attributeName="x" from="10" to="140" dur="5s" repeatCount="indefinite" />
                </rect>
            </g>
        </svg>
    )
}



export const CircleOverSquare = ({ color1, color2, width = 100, radius = 40 }) => {

    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)
    const center = width / 2

    return (
        <svg width={width} height={width} >
            <rect x="0" y="0" width={width} height={width} fill={hsl1} />
            <circle cx={center} cy={center} r={radius} fill={hsl2} />
        </svg>
    )
}
