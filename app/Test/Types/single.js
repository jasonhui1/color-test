import { useEffect, useState } from "react";
import ColorSwatch from "../../Color Picker/ColorSwatch";
import { defaultHLS, generateRandomColorAdvanced } from "../../General/color_util";
import { stepInDifficulty } from "../../General/utils";
import { useSettings } from "../../Context/setting";
import { addHistory } from "../../Storage/test_history";
import { ResultDisplay } from "../Result/ResultDisplay";
import TestBottom from "../General/TestBottom";
import Evaluation from "../Result/Evaluation";
import { addHistorySB } from "../../Storage/test_history_supabase";

function SingleTest({ selectedColor, hRange = [0, 360], sRange = [0, 100], lRange = [0, 100], testId, setTestStarted }) {
    const [targetColor, setTargetColor] = useState(defaultHLS)
    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [test_history, setTestHistory] = useState([])
    const [checkedResult, setCheckedResult] = useState(false);

    const { mode, difficulties, testNum, saveToHistory, practicing } = useSettings()

    useEffect(() => {
        setRandomTargetColor();
    }, [])

    const setRandomTargetColor = () => {
        const newTargetColor = generateRandomColorAdvanced(hRange, lRange, sRange, mode, stepInDifficulty(difficulties), targetColor);
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


    const checkResult = () => {
        if (checkedResult) return
        const newHistory = [...test_history, { targetColor, selectedColor }];

        setTestHistory(newHistory)
        if (currentTestNum >= testNum) {
            //Print Evaluation Result
            console.log('test ended, print result :>> ',);
            console.log('AllHistory :>> ', newHistory);
        }

        // if (saveToHistory) addHistory(testId, targetColor, selectedColor, mode, difficulties ); 
        if (saveToHistory) addHistorySB({ testId, targetColor, selectedColor, mode, difficulty: difficulties });

        setCheckedResult(true)
    };

    const testEnded = currentTestNum >= (testNum - 1) && checkedResult

    return (
        <div>
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

            {testEnded && <Evaluation history={test_history} mode={mode} difficulty={difficulties} />}
            <TestBottom showBackButton={currentTestNum === 0} testEnded={testEnded} checkedResult={checkedResult} onNext={handleNext} onCheck={checkResult} onBack={handleBack} />
            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} mode={mode} difficulties={difficulties} />}



        </div>

    )

}

export default SingleTest