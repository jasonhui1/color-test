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

const PatternRenderer = memo(({ pattern = 'PolkaDots', refColor, targetColor, shape = 'Star', width = 40, rotation = 45 }) => {
    const PatternComponent = patternComponents[pattern] || PolkaDotsPattern;
    return (
        <PatternComponent
            width={width}
            color1={refColor}
            color2={targetColor}
            rotation={rotation}
            shape={shape}
        />
    );
})

export default PatternRenderer