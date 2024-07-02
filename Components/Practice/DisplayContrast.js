import { useEffect, useState } from "react"
import { defaultHLS, generateRandomColorAdvanced } from "../../Utils/color_util"
import { getRandomValue, roundToStep, stepInDifficulty } from "../../Utils/utils"
import { patterns, shapes } from "../General/Patterns_and_Shape/ShapeRenderer."
import PatternRenderer from "../General/Patterns_and_Shape/PatternRenderer"
import { useSettings } from "../../Contexts/setting"

const DisplayContrasts = ({ step = 20, selectedColor }) => {

    const [targetColor, setTargetColor] = useState(defaultHLS)
    const [pattern, setPattern] = useState('PolkaDots')
    const [shape, setShape] = useState('Star')

    const { mode, difficulty } = useSettings()

    useEffect(() => {
        resetTargetColor()
        resetShape()
        resetPattern()
    }, [])

    // useEffect(() => {
    //     setTargetColor((color) => ({
    //         ...color,
    //         h: selectedColor.h
    //     }))
    // }, [selectedColor.h])

    const resetTargetColor = () => {
        setTargetColor(generateRandomColorAdvanced([selectedColor.h, selectedColor.h], [0, 100], [0, 100], mode, stepInDifficulty(difficulty)))
    }
    const resetShape = () => setShape(getRandomValue(shapes))
    const resetPattern = () => setPattern(getRandomValue(patterns))
    const rangeArray = [];
    for (let i = 0; i <= 100; i += step) {
        rangeArray.push(i);
    }

    return (

        <div className="flex flex-col items-center justify-center">
            <div className='flex flex-col gap-2' >

                {
                    rangeArray.toReversed().map((l, index) => {
                        return (
                            <div className='flex flex-row gap-1' key={index}>
                                {rangeArray.map((s, j) => {
                                    const chosenColor = s === roundToStep(selectedColor.s,step) && l === roundToStep(selectedColor.l,step)
                                    return (
                                        <div className={`${chosenColor ? 'border-2 border-black' : ''}`}>

                                            <PatternRenderer width={50} patternWidth={25} patternHeight={25} pattern={pattern} refColor={selectedColor} targetColor={{ h: selectedColor.h, s, l }} shape={shape} />
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })
                }
            </div>

        </div>
    )
}


export default DisplayContrasts