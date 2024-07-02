import ColorSwatch from "../Color Picker/ColorSwatch";

const DisplayColorRange = ({ step = 20, selectedColor }) => {
    // const { practicing } = useSettings();
    const practicing = true;

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
            {practicing &&
                <div className="flex flex-col items-center justify-center">
                    <div className='flex flex-row gap-2'>
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
                                                <ColorSwatch key={j} color={{ h: selectedColor.h, s, l }} size={1} />
                                            )
                                        })}
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </>

    )
}

export default DisplayColorRange