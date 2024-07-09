import { useCallback, useRef, } from "react"
import { roundToStep, } from "../../Utils/utils"
import { useSettings } from "../../Contexts/setting"
import RevealEffect from "../General/RevealEffect"
import { ColorGrid, useColorDict } from "./DisplayColorRange"
import SVGRenderer from "../General/Patterns_and_Shape/SVGRenderer"
import { DisplayColorComponent } from "./DisplayGeneral"
import { SVGDefsProvider } from "../General/Patterns_and_Shape/SVGDefContext"


const DisplayContrasts = ({ shape = 'Star', pattern = 'PolkaDots', refColor, selectedColor, setSelectedColor, h_range, s_range, l_range, resetVariable = -1, ...props }) => {
    const cellWidth = 60

    const renderCell = useCallback((color, key) => (
        <div key={key} onClick={() => setSelectedColor(color)} className="cursor-pointer">
            <SVGRenderer
                width={cellWidth} patternWidth={25} patternHeight={25} pattern={pattern} shape={shape}
                refColor={refColor} targetColor={color} {...props}
            />
        </div>
    ), [setSelectedColor, shape, pattern, refColor]);

    return (
        <SVGDefsProvider>
            <DisplayColorComponent renderCell={renderCell} selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                h_range={h_range} s_range={s_range} l_range={l_range}
                resetVariable={resetVariable} cellWidth={cellWidth} />
        </SVGDefsProvider>

    );
};

export default DisplayContrasts