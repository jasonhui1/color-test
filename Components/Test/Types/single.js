import { useEffect, useState } from "react";
import ColorSwatch from "../../Color Picker/ColorSwatch";
import { defaultHLS, defaultLS, generateRandomColorAdvanced, checkIfCorrect } from "../../../Utils/color_util";
import { roundToStep, stepInDifficulty } from "../../../Utils/utils";
import { useSettings } from "../../../Contexts/setting";
import { ResultDisplay, } from "../../Evaluation/ResultDisplay";
import TestBottom from "../TestBottom";
import Evaluation from "../../Evaluation/Evaluation";
import DisplayColorRange from "../../Practice/DisplayColorRange";
import { getPositionFromSV, getSVFromPosition } from "../../../Utils/calculation_util";
import { useAddHistory } from "../../../Storage/hooks/useAddHistory";

function SingleTest({ selectedColor, hRange = [0, 360], sRange = [0, 100], lRange = [0, 100], testId, setTestStarted, setSelectedColor }) {
    const [targetColor, setTargetColor] = useState(defaultHLS)
    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [testHistory, setTestHistory] = useState([])
    const [checkedResult, setCheckedResult] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());

    const [retrying, setRetrying] = useState(false);
    const [currentRetryingNum, setCurrentRetryingNume] = useState(0);

    const { mode, difficulty, testNum, saveToHistory, practicing, step, testMethod } = useSettings()
    const { addHistory: addHistoryDB } = useAddHistory();

    useEffect(() => {
        setup();
    }, [])

    const setup = () => {
        setRandomTargetColor()
        setCurrentTestNum(currentTestNum + 1)
    }

    const setRandomTargetColor = () => {
        const newTargetColor = generateRandomColorAdvanced(hRange, lRange, sRange, mode, step, targetColor);
        setTargetColor(newTargetColor);
    };

    const nextTest = () => {
        if (!retrying) setup()
        else nextRetry()
    };

    const handleNext = () => {
        setCheckedResult(false);
        if (testEnded) {
            setTestStarted(false)
        } else {
            nextTest()
        }

        // if (mode === ' bw') setSelectedColor(defaultLS(selectedColor.h))
        // else setSelectedColor(defaultHLS)

        setSelectedColor(defaultLS(selectedColor.h))
        setStartTime(Date.now())
    };

    const handleBack = () => {
        setTestStarted(false)
    }

    const handleRetry = () => {
        setRetrying(true)
        setCheckedResult(false)
        nextRetry()
        setStartTime(Date.now())
    }

    const nextRetry = () => {
        setTargetColor(incorrectHistory[currentRetryingNum].targetColor)
        setCurrentRetryingNume(num => num + 1)
    }

    const checkResult = () => {
        if (checkedResult) return
        setCheckedResult(true)
        const color = getApproximateColor(targetColor, selectedColor, step, testMethod)
        const correct = checkIfCorrect(targetColor, color, mode, difficulty)
        const ellapsedTime = Date.now() - startTime
        if (saveToHistory) addHistoryDB({ testId, targetColor, selectedColor: color, mode, difficulty: difficulty, correct, time: ellapsedTime, testMethod });

        setTestHistory(history => [...history, { targetColor, selectedColor: color, correct, isRetry: retrying, time: ellapsedTime }]);
    };

    const incorrectHistory = testHistory.filter(({ correct, isRetry }) => !correct && !isRetry)
    const retryEnded = currentRetryingNum >= incorrectHistory.length && checkedResult

    const testEnded = currentTestNum >= testNum && checkedResult && (!retrying || retryEnded)
    const canRetry = incorrectHistory.length > 0 && !retrying && testEnded

    return (
        <div >

            <div className="flex flex-col gap-3">
                <label>{!retrying ? (currentTestNum) : (currentRetryingNum)} / {!retrying ? (testNum) : incorrectHistory.length}</label>
                <div className="flex flex-row justify-center gap-5">
                    {targetColor &&
                        <div>
                            <div className="flex mb-4 justify-center items-center gap-5">
                                <div className="">
                                    <h3 className="text-lg font-semibold mb-2">Target Color</h3>
                                    <ColorSwatch color={targetColor} size={3} border={true} />

                                </div>

                                {(checkedResult || practicing) && (
                                    <DisplaySelectedColor targetColor={targetColor} selectedColor={selectedColor} />
                                )}
                            </div>
                            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} />}
                        </div>
                    }
                    {<DisplayColorRange selectedColor={selectedColor} setSelectedColor={setSelectedColor} h_range={hRange} s_range={sRange} l_range={lRange}
                        resetVariable={currentTestNum + currentRetryingNum} />}
                </div>
                {testEnded && (!retrying || retryEnded) && <Evaluation history={testHistory.toReversed()} mode={mode} difficulty={difficulty} />}
                <TestBottom showRetryButton={canRetry} onRetry={handleRetry} showBackButton={currentTestNum <= 1} testEnded={testEnded} checkedResult={checkedResult} onNext={handleNext} onCheck={checkResult} onBack={handleBack} />

            </div>

            <div>



            </div>
        </div>

    )

}

const getApproximateColor = (targetColor, selectedColor, step, testMethod) => {
    let color = selectedColor;

    if (testMethod === 'h_only') {
        color = { ...targetColor, h: selectedColor.h }
    }
    else if (testMethod === 'l_only') {
        // Target -> shift lightness , assume s is correct, need to recalculate s from selected l
        const { x: tx, y: ty } = getPositionFromSV(targetColor.s, targetColor.l)
        const offset = -(selectedColor.l - targetColor.l) / 100
        let { s, v: l } = getSVFromPosition(tx, ty + offset)

        s = Math.max(0, Math.min(100, s))
        color = { ...targetColor, s, l }

    } else if (testMethod === 's_only') {
        // Target -> shift saturation , assume l is correct, but recalculate l if s is not possible (>100) -> recalculate s from selected position
        const { x } = getPositionFromSV(selectedColor.s, selectedColor.l)
        const y = (100 - targetColor.l)
        let { s, v: l } = getSVFromPosition(x, y / 100)

        // Search for lightness that can fit this saturation
        let i = 0
        while (s > 100) {
            let increaseStep = i * step.l / 100
            increaseStep *= l > 50 ? 1 : -1
            const y_ = roundToStep(y / 100 + increaseStep, step.l / 100)
            const { s: s_, v: l_ } = getSVFromPosition(x, y_)
            s = s_
            l = l_
            i += 1
        }

        color = { ...targetColor, s, l }
    }
    console.log('color :>> ', color);

    return color
}

// Display selected color, use assumed if not testing exact, i.e. only testing one (h/s/v)
const DisplaySelectedColor = ({ targetColor, selectedColor, getApproximate = false }) => {
    const { testMethod, step } = useSettings()

    let color = selectedColor;
    if (!getApproximate) {
        color = getApproximateColor(targetColor, selectedColor, step, testMethod);
    }

    // const showSwatch = true
    const showSwatch = testMethod === 'exact' || testMethod === 'h_only'
    // const showGradient = !showSwatch
    console.log('selectedColor :>> ', selectedColor);

    return (
        <div >
            <h3 className="text-lg font-semibold mb-2">Your Color</h3>
            {<ColorSwatch color={color} size={3} border={true} />}
        </div>
    )
}

// `linear-gradient(to right, ${hsl1} 0%,  ${hsl2}100% `
// const NumberSelector = ({ setSelectedColor, targetColor }) => {

//     const { mode, difficulty } = useSettings()
//     const [options, setOptions] = useState([])

//     useEffect(() => {
//         const step = stepInDifficulty(difficulty)
//         if (mode === 'bw') {
//             const l = targetColor.l
//             const newOptions = []

//             // Range [-2*step, +2*step]
//             for (let i = -2; i <= 2; i++) {
//                 const answer = targetColor.l + step.l * i
//                 if (answer < 0 || answer > 100) continue
//                 newOptions.push(answer)
//             }

//             // remove 3 random options, could include the actual answer
//             while (newOptions.length > 5) {
//                 if (Math.random() > 0.5) newOptions.pop()
//                 else newOptions.shift()
//             }

//             setOptions(newOptions)
//         }
//     }, [targetColor])

//     return (

//     )
// }


export default SingleTest