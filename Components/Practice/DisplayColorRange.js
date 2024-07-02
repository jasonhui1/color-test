import { memo, useMemo, useRef } from "react";
import { generateAllColorFromTriangle } from "../../Utils/color_util";
import { roundToStep } from "../../Utils/utils";
import ColorSwatch from "../Color Picker/ColorSwatch";
import { useSettings } from "../../Contexts/setting";
import RevealEffect from "../General/RevealEffect";

const DisplayColorRange = ({ selectedColor, setSelectedColor, h_range, s_range, l_range }) => {
    const { step, practicing, mode } = useSettings()
    const gridRef = useRef(null);

    const rounded_hue = roundToStep(selectedColor.h, step.h)

    const { dict } = useMemo(() => {
        if (mode === 'bw') return generateAllColorFromTriangle([rounded_hue, rounded_hue], l_range, [0, 0], step)
        else return generateAllColorFromTriangle([rounded_hue, rounded_hue], l_range, s_range, step)
    }, [selectedColor.h, step]);


    return (
        <div ref={gridRef} className="relative">
            <ColorSwatchGrid
                dict={dict}
                setSelectedColor={setSelectedColor}
                hue={rounded_hue}
            />

            {!practicing && (
                <RevealEffect gridRef={gridRef} />
            )}


        </div>
    )
}

const ColorSwatchGrid = memo(({ dict, setSelectedColor, hue }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            {Object.keys(dict).map((H, index) => {
                const h = hue;
                let current = dict[h];
                return (
                    <ColorSwatchColumn key={index} dict={current} setSelectedColor={setSelectedColor} color={{ h }} />
                );
            })}
        </div>
    )
})

const ColorSwatchColumn = ({ dict, setSelectedColor, color }) => {
    return (
        <div className='flex flex-col gap-2'>
            {dict && Object.keys(dict).reverse().map((L, i) => {
                const rangeArray = dict[L];
                const newColor = { ...color, l: Number(L) };

                return (
                    <ColorSwatchRow key={L} array={rangeArray} setSelectedColor={setSelectedColor} color={newColor} />
                );
            })}
        </div>
    )
}

const ColorSwatchRow = ({ array, setSelectedColor, color, }) => {
    return (
        <div className='flex flex-row gap-2'>
            {array.map((s, j) => {
                const newColor = { ...color, s };
                return <ColorSwatch key={j} color={newColor} size={1} border onClick={() => setSelectedColor(newColor)}
                />
            })}
        </div>
    )
}


export default DisplayColorRange