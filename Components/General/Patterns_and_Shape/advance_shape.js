import { hlsToString } from "../../../Utils/color_util"


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

export const FakeSphere = ({ color1, color2, width = 100, radius = 40, lightDirection = { x: -20, y: -20 } }) => {

    const center = width / 2
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)

    // Adjust the second circle position based on light direction
    const shadowX = center + lightDirection.x;
    const shadowY = center + lightDirection.y;

    return (
        <svg width={width} height={width} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="base">
                    <circle cx={center} cy={center} r={radius} />
                </clipPath>
            </defs>
            <circle cx={center} cy={center} r={radius} fill={hsl1} />
            <circle cx={shadowX} cy={shadowY} r={radius * 1.1} fill={hsl2} clipPath="url(#base)" />
        </svg>
    );
}

export const FakeLaptop = ({ color1, color2, }) => {
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)

    return (
        <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" transform="">

            {/* <polygon points="50,10 150,10 190,50 90,50" fill="url(#grad1)" /> */}
            {/* <polygon points="50,10 90,50 90,150 50,110" fill="url(#grad2)" /> */}
            <polygon points="150,10 190,50 190,150 150,110" fill={hsl1} />
            <polygon points="50,110 90,150 190,150 150,110" fill={hsl2} />
        </svg>
    )
}

export const ShapeBorder = ({ color1, color2, width = 100, radius = 40 }) => {
    const center = width / 2
    const hsl1 = hlsToString(color1)
    const hsl2 = hlsToString(color2)

    return (
        <svg width={width} height={width} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60">
            <circle cx={center} cy={center} r={radius} fill={hsl1} stroke={hsl2} strokeWidth="10" />
        </svg>
    );
}


// Crescent component
const Crescent = ({ size = 100, fill = "gold", stroke = "orange", strokeWidth = 2 }) => {
    const radius = size / 2;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <path
                d={`M ${size},${radius} A ${radius},${radius} 0 0 1 ${size},${radius} A ${radius * 0.8},${radius * 0.8} 0 0 0 ${size},${radius}`}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

// Heart component
const Heart = ({ size = 100, fill = "red", stroke = "darkred", strokeWidth = 2 }) => {
    const width = size;
    const height = size * 0.9;
    return (
        <svg width={width} height={height} viewBox="0 0 100 90">
            <path
                d="M50,30 A20,20 0 0,1 90,30 A20,20 0 0,1 50,70 A20,20 0 0,1 10,30 A20,20 0 0,1 50,30 Z"
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};

// Diamond component
const Diamond = ({ size = 100, fill = "aqua", stroke = "blue", strokeWidth = 2 }) => {
    const points = `${size / 2},0 ${size},${size / 2} ${size / 2},${size} 0,${size / 2}`;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
        </svg>
    );
};

// Cross component
const Cross = ({ size = 100, fill = "green", stroke = "darkgreen", strokeWidth = 2 }) => {
    const third = size / 3;
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <path
                d={`M${third},0 H${2 * third} V${third} H${size} V${2 * third} H${2 * third} V${size} H${third} V${2 * third} H0 V${third} H${third} Z`}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
            />
        </svg>
    );
};
