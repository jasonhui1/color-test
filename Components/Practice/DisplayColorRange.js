import { generateAllColorFromTriangle } from "../../Utils/color_util";
import ColorSwatch from "../Color Picker/ColorSwatch";

const DisplayColorRange = ({ step = { h: 15, s: 20, l: 20 }, selectedColor }) => {
    // const { practicing } = useSettings();
    const practicing = true;

    const { array, dict } = generateAllColorFromTriangle([15, 15], [0, 100], [0, 100], step)

    const rangeArray = [];
    for (let i = 0; i <= 100; i += step) {
        rangeArray.push(i);
    }

    const rangeArray10 = [];
    for (let i = 0; i <= 100; i += 10) {
        rangeArray10.push(i);
    }

    return (
        <>
            {/* {practicing &&
                <div className="flex flex-col items-center justify-center">
                    <div className='flex flex-col gap-2'>
                        {rangeArray10.toReversed().map((l, index) => (
                            <ColorSwatch key={index} color={{ h: selectedColor.h, s: 0, l }} size={1} />
                        )
                        )}
                    </div>
                    <div className='flex flex-col gap-2' >

                        {
                            rangeArray.toReversed().map((l, index) => {
                                return (
                                    <div className='flex flex-row gap-2' key={index}>
                                        {rangeArray.map((s, j) => {

                                            return (
                                                <ColorSwatch key={j} color={rangeArray[selectedColor.h][]} size={1} />
                                            )
                                        })}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            } */}
        </>

    )
}

export default DisplayColorRange