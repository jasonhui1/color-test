
export const TriangleShape = ({ size, fill, stroke = 'none', strokeWidth = 10, transform = 'none' }) => {
    const height = size * (Math.sqrt(3) / 2);
    const points = `${size / 2},0 0,${height} ${size},${height}`;
    return <polygon
        points={points}
        fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform}
    />
}

export const StarShape = ({ points, size, fill, stroke = 'none', strokeWidth = 10, transform = 'none' }) => {
    const outerRadius = size / 2;
    const innerRadius = outerRadius / 2;
    const angleStep = (Math.PI * 2) / points;

    let pathData = "M";
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const x = radius * Math.sin(i * angleStep / 2);
        const y = radius * Math.cos(i * angleStep / 2);
        pathData += `${size / 2 + x},${size / 2 - y} `;
    }
    pathData += "Z";

    return <path d={pathData} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />

}

export const Triangle = ({ fill, size = 100, stroke = 'none', strokeWidth = 10, transform = 'none' }) => {
    const height = size * (Math.sqrt(3) / 2);

    return (
        <svg width={size} height={height} viewBox={`0 0 ${size} ${height}`}>
            <TriangleShape size={size} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />
        </svg>
    );
};


export const Star = ({ size = 100, points = 5, fill, stroke = "none", strokeWidth = 5, transform = 'none' }) => {
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <StarShape points={points} size={size} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />
        </svg>
    );
};

// export const Crescent = ({ size = 100, fill = "gold", stroke = "orange", strokeWidth = 2 }) => {
//     const radius = size / 2;
//     return (
//         <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//             <path
//                 d={`M ${size},${radius} A ${radius},${radius} 0 0 1 ${size},${radius} A ${radius * 0.8},${radius * 0.8} 0 0 0 ${size},${radius}`}
//                 fill={fill}
//                 stroke={stroke}
//                 strokeWidth={strokeWidth}
//             />
//         </svg>
//     );
// };


// export const Heart = ({ size = 100, fill = "red", stroke = "darkred", strokeWidth = 2 }) => {
//     const width = size;
//     const height = size * 0.9;
//     return (
//         <svg width={width} height={height} viewBox="0 0 100 90">
//             <path
//                 d="M50,30 A20,20 0 0,1 90,30 A20,20 0 0,1 50,70 A20,20 0 0,1 10,30 A20,20 0 0,1 50,30 Z"
//                 fill={fill}
//                 stroke={stroke}
//                 strokeWidth={strokeWidth}
//             />
//         </svg>
//     );
// };

// export const Diamond = ({ size = 100, fill = "aqua", stroke = "blue", strokeWidth = 2 }) => {
//     const points = `${size/2},0 ${size},${size/2} ${size/2},${size} 0,${size/2}`;
//     return (
//       <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
//         <polygon points={points} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
//       </svg>
//     );
//   };

export const CrossShape = ({ size, fill, stroke = 'none', strokeWidth = 10, transform = 'none' }) => {
    const third = size / 3;

    return (
        <path
            d={`M${third},0 H${2 * third} V${third} H${size} V${2 * third} H${2 * third} V${size} H${third} V${2 * third} H0 V${third} H${third} Z`}
            fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform}
        />
    )
}


export const Cross = ({ size = 100, fill = "green", stroke = "darkgreen", strokeWidth = 2, transform = 'none' }) => {
    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <CrossShape size={size} fill={fill} stroke={stroke} strokeWidth={strokeWidth} transform={transform} />
        </svg>
    );
};