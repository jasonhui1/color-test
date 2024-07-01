import { useEffect, useState } from "react";
import ColorSwatch from "../../Color Picker/ColorSwatch";
import { defaultHLS, generateRandomColorAdvanced, getIsCorrect } from "../../General/color_util";
import { stepInDifficulty } from "../../General/utils";
import { useSettings } from "../../Context/setting";
import { addHistory } from "../../Storage/test_history";
import { Result, ResultDisplay,  } from "../Result/ResultDisplay";
import TestBottom from "../General/TestBottom";
import Evaluation from "../Result/Evaluation";
import { addHistorySB } from "../../Storage/test_history_supabase";

function SingleTest({ selectedColor, hRange = [0, 360], sRange = [0, 100], lRange = [0, 100], testId, setTestStarted }) {
    const [targetColor, setTargetColor] = useState(defaultHLS)
    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [testHistory, setTestHistory] = useState([])
    const [checkedResult, setCheckedResult] = useState(false);
    const [retrying, setRetrying] = useState(false);

    const { mode, difficulty, testNum, saveToHistory, practicing } = useSettings()

    useEffect(() => {
        setRandomTargetColor();
    }, [])

    const setRandomTargetColor = () => {
        const newTargetColor = generateRandomColorAdvanced(hRange, lRange, sRange, mode, stepInDifficulty(difficulty), targetColor);
        setTargetColor(newTargetColor);
    };

    const handleNext = () => {
        const nextTest = () => {
            setRandomTargetColor();
            setCurrentTestNum(num => num + 1)
        };
        const restartTest = () => {
            setRandomTargetColor();
            setCurrentTestNum(0)
            setRetrying(false)
        };

        if (testEnded) {
            setTestStarted(false)
            restartTest()
        } else {
            nextTest()
        }

        setCheckedResult(false);
    };

    const handleBack = () => {

        if (currentTestNum === 0) {
            setTestStarted(false)
        }
        // else {
        //     const { prevRef, prevTarget, prevSelected } = testHistory[currentTestNum - 1]
        // }
    }

    const handleRetry = () => {
        setCheckedResult(false)
    }


    const checkResult = () => {
        if (checkedResult) return
        setCheckedResult(true)

        const correct = getIsCorrect(targetColor, selectedColor)
        if (saveToHistory) addHistorySB({ testId, targetColor, selectedColor, mode, difficulty: difficulty, correct });
        setTestHistory(history => [...history, { targetColor, selectedColor, correct }]);
    };

    const testEnded = currentTestNum >= (testNum - 1) && checkedResult
    const canRetry = testHistory.filter(({ correct }) => correct).length > 0 && !retrying && testEnded

    return (
        <div>
            <label>{(currentTestNum + 1)} / {(testNum)}</label>
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

            {testEnded && <Evaluation history={testHistory} mode={mode} difficulty={difficulty} />}
            <TestBottom showRetryButton={canRetry} onRetry={() => setRetrying(true)} showBackButton={currentTestNum === 0} testEnded={testEnded} checkedResult={checkedResult} onNext={handleNext} onCheck={checkResult} onBack={handleBack} />
            {checkedResult && <Result targetColor={targetColor} selectedColor={selectedColor} testId={testId} setHistory={setTestHistory} />}

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