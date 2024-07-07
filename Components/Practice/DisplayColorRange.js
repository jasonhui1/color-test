import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ColorSwatch from "../Color Picker/ColorSwatch";
import { DisplayColorComponent } from "./DisplayGeneral";


const DisplayColorRange = ({  selectedColor, setSelectedColor, h_range, s_range, l_range, currentTestNum = -1 }) => {
    const renderCell = useCallback((color, key) => (
        <ColorSwatch key={key} color={color} size={1} border onClick={() => setSelectedColor(color)}  borderWidth={selectedColor.h === color.h && selectedColor.l === color.l && selectedColor.s === color.s ?4:2} borderColor={selectedColor.h === color.h && selectedColor.l === color.l && selectedColor.s === color.s ?'slate-700':'slate-700'}/>
    ), [setSelectedColor,selectedColor]);

    return (
        <DisplayColorComponent renderCell={renderCell} selectedColor={selectedColor}  setSelectedColor={setSelectedColor}
        h_range={h_range} s_range={s_range} l_range={l_range} 
        currentTestNum={currentTestNum} />
    )
}

export default DisplayColorRange;