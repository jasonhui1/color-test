import { memo } from 'react';
import {
    CheckerboardPattern,
    StripePattern,
    PolkaDotsPattern,
    PlusPattern,
    CircuitBoardPattern,
    TartanPlaidPattern,
    SpeedLinesPattern,
    CheckerboardPatternv2
} from './patterns'; // Assuming this is the file where we defined our pattern components

const patternComponents = {
    Checkerboard: CheckerboardPattern,
    Checkerboardv2: CheckerboardPatternv2,
    Stripe: StripePattern,
    PolkaDots: PolkaDotsPattern,
    Plus: PlusPattern,
    CircuitBoard: CircuitBoardPattern,
    TartanPlaid: TartanPlaidPattern,
    SpeedLines: SpeedLinesPattern,
};

export const patterns = ['Plus', 'PolkaDots', 'Checkerboard', 'Stripe', 'Circuit board', 'Speed lines', 'Checkerboardv2', "SpeedLines"]

const PatternRenderer = memo(({ width = 150, refColor, targetColor,
    shape = 'Star', shapeRotation = 45,
    pattern = 'PolkaDots', patternWidth = -1, patternHeight = -1, patternRotation = 45, patternScale = -1,
}) => {
    //Scale automatially if not set
    patternWidth = patternWidth > 0 ? patternWidth : width / 10
    patternHeight = patternHeight > 0 ? patternHeight : patternWidth
    patternScale = patternScale > 0 ? patternScale : Math.max(width / 150, 1)

    const PatternComponent = patternComponents[pattern] || PolkaDotsPattern;
    return (
        <PatternComponent
            width={width}
            color1={refColor}
            color2={targetColor}
            shape={shape}
            shapeRotation={shapeRotation}
            patternRotation={patternRotation}
            patternWidth={patternWidth}
            patternHeight={patternHeight}
            patternScale={patternScale}
        />
    );
})

export default PatternRenderer