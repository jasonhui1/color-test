import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateAllColorFromTriangle } from "../../Utils/color_util";
import { roundToStep } from "../../Utils/utils";
import { useSettings } from "../../Contexts/setting";
import RevealEffect from "../General/RevealEffect";

export const useColorDict = (selectedColor, l_range, s_range, step, mode) => {
    const rounded_hue = roundToStep(selectedColor.h, step.h);

    return useMemo(() => {
        if (mode === 'bw') return generateAllColorFromTriangle([rounded_hue, rounded_hue], l_range, [0, 0], step);
        return generateAllColorFromTriangle([rounded_hue, rounded_hue], l_range, s_range, step);
    }, [rounded_hue, l_range[0], l_range[1], s_range[0], s_range[1], step, mode]);
};

export const DisplayColorComponent = ({ selectedColor, h_range, s_range, l_range, renderCell, currentTestNum = -1 }) => {
    const { step, practicing, mode } = useSettings();
    const gridRef = useRef(null);

    const { dict } = useColorDict(selectedColor, l_range, s_range, step, mode);

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

export const ColorGrid = memo(({ dict, renderCell, hue }) => {
    // console.log('updaing :>> ',);
    return (
        <div className="flex flex-col items-center justify-center">
            {Object.keys(dict).map((H, index) => {
                const h = hue;
                let current = dict[h];
                return (
                    <ColorColumn key={index} dict={current} renderCell={renderCell} hue={hue} />
                );
            })}
        </div>
    )
})

const ColorColumn = ({ dict, renderCell, hue }) => {
    return (
        <div className='flex flex-col gap-1'>
            {dict && Object.keys(dict).reverse().map((L, i) => {
                const rangeArray = dict[L];
                const newColor = { h: hue, l: Number(L) };

                return (
                    <ColorRow key={L} array={rangeArray} renderCell={renderCell} hue={hue} lightness={L} />
                );
            })}
        </div>
    )
}

const ColorRow = ({ array, renderCell, hue, lightness }) => {
    return (
        <div className='flex flex-row gap-1'>
            {array.map((s, j) => renderCell({ h: hue, l: lightness, s }, j))}
        </div>
    )
}
