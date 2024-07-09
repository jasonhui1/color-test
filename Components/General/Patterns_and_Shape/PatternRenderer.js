import {
    CheckerboardPattern,
    StripePattern,
    PolkaDotsPattern,
    PlusPattern,
    CircuitBoardPattern,
    TartanPlaidPattern,
    SpeedLinesPattern,
    CheckerboardPatternv2,
} from './patterns';

export const patternComponents = {
    Checkerboard: CheckerboardPattern,
    Checkerboardv2: CheckerboardPatternv2,
    Stripe: StripePattern,
    PolkaDots: PolkaDotsPattern,
    Plus: PlusPattern,
    CircuitBoard: CircuitBoardPattern,
    TartanPlaid: TartanPlaidPattern,
    SpeedLines: SpeedLinesPattern,
};


export const patterns = ['Plus', 'PolkaDots', 'Checkerboard', 'Stripe', 'CircuitBoard', 'SpeedLines', 'Checkerboardv2']


const PatternRenderer = ({ pattern, id, width = 60, height = null, rotation, scale, ...props }) => {
    if (!height) height = width
    const PatternComponent = patternComponents[pattern] || patternComponents['PolkaDots'];
    return (
        <pattern id={id} patternUnits="userSpaceOnUse" width={width} height={height} patternTransform={`translate(${width / 4}, ${height / 4}) rotate(${rotation}) scale(${scale})`}>
            <PatternComponent width={width} {...props} />
        </pattern>
    )
}

export default PatternRenderer
