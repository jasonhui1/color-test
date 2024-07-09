import { memo } from 'react';

import { getIds, useDefs } from './SVGDefContext';
import { hlsToString } from '../../../Utils/color_util';

const SVGRenderer = memo(({ width = 150, refColor, targetColor,
    shape = 'Star', shapeRotation = 45,
    pattern = 'PolkaDots', patternWidth = null, patternHeight = null, patternRotation = 45, patternScale = null, ...props
}) => {
    //Scale automatially if not set
    if (!patternWidth) patternWidth = patternHeight
    if (!patternHeight) patternHeight = patternWidth
    if (!patternScale) patternScale = Math.max(width / 150, 1)

    const { addDef } = useDefs()
    if (addDef) addDef({ shape, pattern, width, patternWidth, patternHeight, patternRotation, patternScale, ...props })

return (
    <SVGRender
        width={width}
        height={width}
        color1={refColor}
        color2={targetColor}
        shape={shape}
        pattern={pattern}
        shapeRotation={shapeRotation}
    />
);
})


const SVGRender = ({ color1, color2, width, height, viewBox = '0 0 100% 100%', shape = 'Star', pattern = 'PolkaDots', shapeRotation = 0 }) => {
    const hsl1 = hlsToString(color1);
    const hsl2 = hlsToString(color2);
    const { shapeMaskId, combinedMaskId } = getIds(shape, pattern, width)

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={viewBox}>
            <g transform={`rotate(${shapeRotation})`} transformOrigin={'center'}>
                <rect width={width} height={height} fill={hsl2} mask={`url(#${shapeMaskId})`} />
                <rect width={width} height={height} fill={hsl1} mask={`url(#${combinedMaskId})`} />
            </g>
        </svg>
    )
}
export default SVGRenderer