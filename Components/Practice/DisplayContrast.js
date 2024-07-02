import { memo, useEffect, useMemo, useRef, useState } from "react"
import { defaultHLS, generateAllColorFromTriangle, generateRandomColorAdvanced } from "../../Utils/color_util"
import { getRandomValue, roundToStep, stepInDifficulty } from "../../Utils/utils"
import { patterns, shapes } from "../General/Patterns_and_Shape/ShapeRenderer."
import PatternRenderer from "../General/Patterns_and_Shape/PatternRenderer"
import { useSettings } from "../../Contexts/setting"
import RevealEffect from "../General/RevealEffect"

const DisplayContrasts = ({ shape = 'Star', pattern = 'PolkaDots', refColor, selectedColor, setSelectedColor, h_range, s_range, l_range }) => {

    const { mode, step, practicing } = useSettings()
    const gridRef = useRef(null);

    const rounded_hue = roundToStep(selectedColor.h, step.h)

    const { dict } = useMemo(() => {
        if (mode === 'bw') return generateAllColorFromTriangle([rounded_hue, rounded_hue], l_range, [0, 0], step)
        else return generateAllColorFromTriangle([rounded_hue, rounded_hue], l_range, s_range, step)
    }, [selectedColor.h, step, refColor]);

    console.log('l_range :>> ', l_range);
    return (
        <div ref={gridRef} className="relative">
            <ColorSwatchGrid
                dict={dict}
                refColor={refColor}
                setSelectedColor={setSelectedColor}
                hue={rounded_hue}
                shape={shape}
                pattern={pattern}
            />

            {/* Reveal effect */}
            {!practicing && (
                <RevealEffect gridRef={gridRef} />
            )}
        </div>
    )
}


const ColorSwatchGrid = memo(({ dict, refColor, setSelectedColor, hue, shape, pattern }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            {Object.keys(dict).map((H, index) => {
                const h = hue;
                let current = dict[h];
                return (
                    <ColorSwatchColumn key={index} dict={current} refColor={refColor} setSelectedColor={setSelectedColor} color={{ h }} shape={shape} pattern={pattern} />
                );
            })}
        </div>
    )
})

const ColorSwatchColumn = ({ dict, refColor, setSelectedColor, color, shape, pattern }) => {
    return (
        <div className='flex flex-col gap-2'>
            {dict && Object.keys(dict).reverse().map((L, i) => {
                const rangeArray = dict[L];
                const newColor = { ...color, l: Number(L) };

                return (
                    <ColorSwatchRow key={L} array={rangeArray} refColor={refColor} setSelectedColor={setSelectedColor} color={newColor} shape={shape} pattern={pattern} />
                );
            })}
        </div>
    )
}

const ColorSwatchRow = ({ array, refColor, setSelectedColor, color, shape, pattern }) => {
    return (
        <div className='flex flex-row gap-2'>
            {array.map((s, j) => {
                const newColor = { ...color, s };
                return (

                    <div onClick={() => setSelectedColor(newColor)} className="cursor-pointer">
                        <PatternRenderer width={60} patternWidth={25} patternHeight={25} pattern={pattern} refColor={refColor} targetColor={newColor} shape={shape} />
                    </div>
                )
            })}
        </div>
    )
}



export default DisplayContrasts