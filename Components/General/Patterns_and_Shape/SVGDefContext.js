import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import ShapeRenderer from "./ShapeRenderer.";
import PatternRenderer from "./PatternRenderer";

export const getIds = (shape, pattern, width) => {
    const idSuffix = width;
    const patternId = pattern + idSuffix
    const shapeMaskId = `${shape}shapeMask${idSuffix}`;
    const patternMaskId = `${pattern}patternMask${idSuffix}`;
    const combinedMaskId = `combinedMask${shape}${pattern}${idSuffix}`;

    const id = shape + pattern + idSuffix;

    return { id, patternId, shapeMaskId, patternMaskId, combinedMaskId }
}

const SVGDefsContext = createContext(undefined);

export const SVGDefsProvider = ({ children }) => {
    const [defs, setDefs] = useState({});
    const defsRef = useRef({});

    const addDef = useCallback(({ shape, pattern, width, height = null, patternWidth = null, patternHeight = null, patternRotation = 0, patternScale = null, ...props }) => {
        const { id, patternId, shapeMaskId, patternMaskId, combinedMaskId } = getIds(shape, pattern, width)
        if (defsRef.current[id]) return

        if (!patternWidth) patternWidth = width / 10
        if (!patternHeight) patternHeight = patternWidth
        if (!patternScale) patternScale = Math.max(width / 150, 1)
        if (!height) height = width

        console.log('pattern, shape, width :>> ', pattern, shape, width);
        const Pattern = (<PatternRenderer id={patternId} pattern={pattern} width={patternWidth} height={patternHeight} rotation={patternRotation} scale={patternScale} />)
        const ShapeMask = (
            <mask id={shapeMaskId}>
                <ShapeRenderer size={width} shape={shape} fill={'white'} />
            </mask>
        )

        const PatternMask = (
            <mask id={patternMaskId}>
                <rect width={width} height={height} fill={`url(#${patternId})`} />
            </mask>
        )

        const CombineMask = (
            <mask id={combinedMaskId}>
                <rect width={width} height={height} fill="white" mask={`url(#${shapeMaskId})`} />
                <rect width={width} height={height} fill="black" mask={`url(#${patternMaskId})`} />
            </mask>
        )

        defsRef.current[id] = true;

        setDefs(prevDefs => ({ ...prevDefs, [patternId]: Pattern, [shapeMaskId]: ShapeMask, [patternMaskId]: PatternMask, [combinedMaskId]: CombineMask }));
    }, []);


    return (
        <SVGDefsContext.Provider value={{ addDef }}>
            <svg className="absolute" width={0} height={0}>
                <defs>{Object.values(defs)}</defs>
            </svg>
            {children}
        </SVGDefsContext.Provider>
    );
};

export const useDefs = () => {
    const context = useContext(SVGDefsContext);
    if (context === undefined) {
        throw new Error('useDefs must be used within a SVGDefProvider');
    }
    return context;
};