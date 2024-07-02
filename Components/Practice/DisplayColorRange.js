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
                <ColorSwatchGrid dict={dict} setSelectedColor={setSelectedColor} hue={roundToStep(selectedColor.h, step.h)} />
            )}
        </>
    )
}

const ColorSwatchGrid = ({ dict, setSelectedColor, hue }) => {
    return (
        <div className="relative">
            <div className="flex flex-col items-center justify-center">
                {Object.keys(dict).map((H, index) => {
                    const h = hue;
                    let current = dict[h];
                    return (
                        <ColorSwatchColumn key={index} dict={current} setSelectedColor={setSelectedColor} color={{ h }} />
                    );
                })}
            </div>
            {/* <div className="w-full h-full top-0 absolute" style={{ backgroundColor: 'black', opacity: 0.5 }}></div> */}
        </div>
    )
}

const ColorSwatchColumn = ({ dict, setSelectedColor, color }) => {
    return (
        <div className='flex flex-col gap-2'>
            {dict && Object.keys(dict).reverse().map((L, i) => {
                const rangeArray = dict[L];
                const newColor = { ...color, l: L };

                return (
                    <ColorSwatchRow key={L} array={rangeArray} setSelectedColor={setSelectedColor} color={newColor} />
                );
            })}
        </div>
    )
}

const ColorSwatchRow = ({ array, setSelectedColor, color }) => {
    return (
        <div className='flex flex-row gap-2' >
            {array.map((s, j) => {
                const newColor = { ...color, s };
                return <ColorSwatch key={j} color={newColor} size={1} border onClick={() => setSelectedColor(newColor)} />
            })}
        </div>
    )
}

export default DisplayColorRange