import { useCallback, useRef, } from "react"
import { roundToStep, } from "../../Utils/utils"
import { useSettings } from "../../Contexts/setting"
import RevealEffect from "../General/RevealEffect"
import { ColorGrid, useColorDict } from "./DisplayColorRange"
import PatternRenderer from "../General/Patterns_and_Shape/PatternRenderer"
import { DisplayColorComponent } from "./DisplayGeneral"


const DisplayContrasts = ({ shape = 'Star', pattern = 'PolkaDots', refColor, selectedColor, setSelectedColor, h_range, s_range, l_range, currentTestNum = -1 }) => {
    const renderCell = useCallback((color, key) => (
        <div key={key} onClick={() => setSelectedColor(color)} className="cursor-pointer">
            <PatternRenderer
                width={60} patternWidth={25} patternHeight={25} pattern={pattern} shape={shape}
                refColor={refColor} targetColor={color}
            />
        </div>
    ), [setSelectedColor, shape, pattern, refColor]);

    return (
        <DisplayColorComponent renderCell={renderCell} selectedColor={selectedColor}
            h_range={h_range} s_range={s_range} l_range={l_range}
            currentTestNum={currentTestNum} />

    );
};

export default DisplayContrasts