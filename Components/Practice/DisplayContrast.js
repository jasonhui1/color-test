import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { defaultHLS, generateAllColorFromTriangle, generateRandomColorAdvanced } from "../../Utils/color_util"
import { getRandomValue, roundToStep, stepInDifficulty } from "../../Utils/utils"
import { patterns, shapes } from "../General/Patterns_and_Shape/ShapeRenderer."
import PatternRenderer from "../General/Patterns_and_Shape/PatternRenderer"
import { useSettings } from "../../Contexts/setting"
import RevealEffect from "../General/RevealEffect"
import { ColorGrid, useColorDict } from "./DisplayColorRange"

const DisplayContrasts = ({ shape = 'Star', pattern = 'PolkaDots', refColor, selectedColor, setSelectedColor, h_range, s_range, l_range, currentTestNum = -1 }) => {
    const { step, practicing, mode } = useSettings();
    const gridRef = useRef(null);

    const { dict } = useColorDict(selectedColor, l_range, s_range, step, mode);

    const renderCell = useCallback((color, key) => (
        <div key={key} onClick={() => setSelectedColor(color)} className="cursor-pointer">
            <PatternRenderer
                width={60} patternWidth={25} patternHeight={25} pattern={pattern} shape={shape}
                refColor={refColor} targetColor={color} 
            />
        </div>
    ), [setSelectedColor, shape, pattern, refColor]);

    return (
        <div ref={gridRef} className="relative">
            <ColorGrid
                dict={dict}
                renderCell={renderCell}
                hue={roundToStep(selectedColor.h, step.h)}
            />
            {!practicing && (
                <RevealEffect gridRef={gridRef} maxLife={5000} resetVariable={currentTestNum} />
            )}
        </div>
    );
};

export default DisplayContrasts