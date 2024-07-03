import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ColorSwatch from "../Color Picker/ColorSwatch";
import { DisplayColorComponent } from "./DisplayGeneral";


const DisplayColorRange = ({  selectedColor, setSelectedColor, h_range, s_range, l_range, currentTestNum = -1 }) => {
    const renderCell = useCallback((color, key) => (
        <ColorSwatch key={key} color={color} size={1} border onClick={() => setSelectedColor(color)} />
    ), [setSelectedColor,]);

    return (
        <DisplayColorComponent renderCell={renderCell} selectedColor={selectedColor} 
        h_range={h_range} s_range={s_range} l_range={l_range} 
        currentTestNum={currentTestNum} />
    )
}

export default DisplayColorRange;