import { HeartShape, StarShape, TriangleShape, CrescentShape, CrossShape, RhombusShape } from "./basic_shape";

const shapePathComponents = {
    Triangle: TriangleShape,
    Star: StarShape,
    Cross: CrossShape,
    Crescent: CrescentShape,
    Heart: HeartShape,
    Rhombus: RhombusShape,

};

export const patterns = ['Plus', 'PolkaDpots', 'Checkerboard', 'Stripe', 'Circuit board', 'Speed lines', 'Checkerboardv2']
export const shapes = ['Star',  'Triangle', 'Cross', 'Heart', 'Cross', 'Crescent']

const ShapeRenderer = ({ shape = 'Star', size, fill, ...props }) => {
    const ShapePathComponent = shapePathComponents[shape] || StarShape;
    return (
        <ShapePathComponent
            size={size}
            shape={shape}
            fill={fill}
            {...props}
        />
    );
}

export default ShapeRenderer