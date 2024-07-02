import { useEffect, useState } from "react";
import ColorSwatch from "../../../Components/Color Picker/ColorSwatch";
import { defaultHLS, defaultLS, generateRandomColorAdvanced, getIsCorrect } from "../../General/color_util";
import { stepInDifficulty } from "../../General/utils";
import { useSettings } from "../../../Contexts/setting";
import { ResultDisplay, } from "../Result/ResultDisplay";
import TestBottom from "../../../Components/Test/TestBottom";
import Evaluation from "../Result/Evaluation";
import { addHistorySB } from "../../../Storage/test_history_supabase";

function SingleTest({ selectedColor, hRange = [0, 360], sRange = [0, 100], lRange = [0, 100], testId, setTestStarted, setSelectedColor }) {
    const [targetColor, setTargetColor] = useState(defaultHLS)
    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [testHistory, setTestHistory] = useState([])
    const [checkedResult, setCheckedResult] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());

    const [retrying, setRetrying] = useState(false);
    const [currentRetryingNum, setCurrentRetryingNume] = useState(0);

    const { mode, difficulty, testNum, saveToHistory, practicing } = useSettings()

    useEffect(() => {
        setup();
    }, [])

    const setup = () => {
        setRandomTargetColor()
        setCurrentTestNum(currentTestNum + 1)
    }

    const setRandomTargetColor = () => {
        const newTargetColor = generateRandomColorAdvanced(hRange, lRange, sRange, mode, stepInDifficulty(difficulty), targetColor);
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
    }

    const nextRetry = () => {
        setTargetColor(incorrectHistory[currentRetryingNum].targetColor)
        setCurrentRetryingNume(num => num + 1)
    }

    const checkResult = () => {
        if (checkedResult) return
        setCheckedResult(true)

        const correct = getIsCorrect(targetColor, selectedColor, mode, difficulty)
        const ellapsedTime = Date.now() - startTime
        if (saveToHistory) addHistorySB({ testId, targetColor, selectedColor, mode, difficulty: difficulty, correct, time: ellapsedTime });
        setTestHistory(history => [...history, { targetColor, selectedColor, correct, isRetry: retrying, time: ellapsedTime }]);
    };

    const incorrectHistory = testHistory.filter(({ correct, isRetry }) => !correct && !isRetry)
    const retryEnded = currentRetryingNum >= incorrectHistory.length && checkedResult

    const testEnded = currentTestNum >= testNum && checkedResult && (!retrying || retryEnded)
    const canRetry = incorrectHistory.length > 0 && !retrying && testEnded

    return (
        <div>
            <label>{!retrying ? (currentTestNum) : (currentRetryingNum)} / {!retrying ? (testNum) : incorrectHistory.length}</label>
            {targetColor &&
                <div className="flex mb-4 justify-center items-center gap-5">
                    <div className="">
                        <h3 className="text-lg font-semibold mb-2">Target Color</h3>
                        <ColorSwatch color={targetColor} size={3} border={true} />

                    </div>

                    {(checkedResult || practicing) && (
                        <div >
                            <h3 className="text-lg font-semibold mb-2">Your Color</h3>
                            <ColorSwatch color={selectedColor} size={3} border={true} />
                        </div>
                    )}
                </div>
            }

            {testEnded && (!retrying || retryEnded) && <Evaluation history={testHistory.toReversed()} mode={mode} difficulty={difficulty} />}
            <TestBottom showRetryButton={canRetry} onRetry={handleRetry} showBackButton={currentTestNum <= 1} testEnded={testEnded} checkedResult={checkedResult} onNext={handleNext} onCheck={checkResult} onBack={handleBack} />
            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} />}

        </div>

    )

}


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