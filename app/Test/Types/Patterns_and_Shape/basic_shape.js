const createShapeComponent = (ShapeComponent, defaultSize = 100) => {
    return ({ size = defaultSize, fill, stroke = 'none', strokeWidth = 2, transform = '', ...props }) => (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <ShapeComponent
                size={size}
                fill={fill}
                stroke={stroke}
                strokeWidth={strokeWidth}
                transform={transform}
                {...props}
            />
        </svg>
    );
};

const withCommonProps = (Component) => ({ commonProps, ...rest }) => <Component {...commonProps} {...rest} />;

export const TriangleShape = withCommonProps(({ size, ...props }) => {
    const height = size * (Math.sqrt(3) / 2);
    const points = `${size / 2},0 0,${height} ${size},${height}`;
    return <polygon points={points} {...props} />
})

export const StarShape = withCommonProps(({ points = 5, size, ...props }) => {
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

    return <path d={pathData} {...props} />
}
)

export const CrossShape = withCommonProps(({ size, ...props }) => {
    const third = size / 3;

    return (
        <path
            d={`M${third},0 H${2 * third} V${third} H${size} V${2 * third} H${2 * third} V${size} H${third} V${2 * third} H0 V${third} H${third} Z`}
            {...props}
        />
    )
})
export const HeartShape = withCommonProps(({ size, transform = '', ...props }) => {
    const width = size * 1.7;
    const height = size;


    const topLeftX = width * 0.4
    const centerX = width / 2
    const centerY = height / 3

    const translateX = (width - size) / 2

    transform += ` translate(-${translateX} 0)`

    const pathData = `
        M ${centerX} ${centerY}
        C ${topLeftX} 0, 0 ${centerY}, ${centerX} ${height}
        C ${width} ${centerY}, ${width - topLeftX} 0, ${centerX} ${centerY}
    `;

    //     const width = size * 0.7;  // Make the heart narrower
    //     const height = size;

    //     const pathData = `
    //         M ${width / 2} ${height * 0.1}
    //         C ${width * 0.1} ${height * 0.2}, 0 ${height * 0.5}, ${width / 2} ${height}
    //         C ${width} ${height * 0.5}, ${width * 0.9} ${height * 0.2}, ${width / 2} ${height * 0.1}
    // `
    return <path d={pathData} transform={transform}  {...props} />
})

export const CrescentShape = withCommonProps(({ size, ...props }) => {
    const center = size / 2;

    const subtractCenterX = center * 0.6
    const subtractR = size / 3

    return <>
        <defs>
            <mask id="crescent-mask">
                <rect width="600" height="250" fill="white" />
                <circle cx={subtractCenterX} cy={center} r={subtractR} fill="black" />
            </mask>
        </defs>
        <circle cx={center} cy={center} r={center} {...props} />
    </>;
})

export const RhombusShape = withCommonProps((({ size, transform = '', ...props }) => {
    const half = size / 2;
    transform += ` scale(0.7,1)`

    return (
        <polygon
            points={`${half},0 ${size},${half} ${half},${size} 0,${half}`} transform={transform} {...props}
        />
    )
}))
export const Triangle = createShapeComponent(TriangleShape);
export const Star = createShapeComponent(StarShape);
export const Cross = createShapeComponent(CrossShape);
export const Crescent = createShapeComponent(CrescentShape);
export const Heart = createShapeComponent(HeartShape);
export const Rhombus = createShapeComponent(RhombusShape);
