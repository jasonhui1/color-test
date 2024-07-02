import { useEffect } from "react";
import { generateAllColorFromTriangle } from "../../Utils/color_util";
import { roundToStep } from "../../Utils/utils";
import ColorSwatch from "../Color Picker/ColorSwatch";

const DisplayColorRange = ({ step = { h: 15, s: 20, l: 20 }, selectedColor, setSelectedColor }) => {
    // const { practicing } = useSettings();
    const practicing = true;

    // useEffect(() => {
    //     console.log(selectedColor)
    // }, [selectedColor.h])

    const { array, dict } = generateAllColorFromTriangle([selectedColor.h, selectedColor.h], [0, 100], [0, 100], step)

    const LRangeArray = [];
    for (let i = 0; i <= 100; i += step.l) {
        LRangeArray.push(i);
    }

    return (
        <>
            {practicing && (
                <div className="flex flex-col items-center justify-center">
                    {Object.keys(dict).map((H, index) => {
                        const h = roundToStep(selectedColor.h, step.h);
                        let current = dict[h];
                        return (
                            <div key={index} className='flex flex-col gap-2'>
                                {current && Object.keys(current).reverse().map((L) => {
                                    const rangeArray = current[L];
                                    const l = L
                                    return (
                                        <div key={L} className='flex flex-row gap-2' >
                                            {rangeArray.map((s, j) => (
                                                <ColorSwatch key={j} color={{ h, s, l }} size={1} border onClick={() => setSelectedColor({ h, s, l })} />
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </>


    )
}

export default DisplayColorRange