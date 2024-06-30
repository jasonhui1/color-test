
import { memo, useEffect, useState } from "react"
import { CheckResultButton, NextButton } from "../test";
import { calculateHLSDifference, generateId, getRandomIntStep } from "../../General/utils";
import { defaultHLS, generateRandomColorAdvanced, hlsToString } from "../../General/color_util";
import ColorSwatch from "../../Color Picker/ColorSwatch";
import { CheckerboardPattern, CircuitBoardPattern, PlusPattern, PolkaDotsPattern, SpeedLinesPattern, StripePattern, TartanPlaidPattern } from "./Patterns_and_Shape/patterns";
import { FakeLaptop, FakeSphere, ShapeBorder } from "./Patterns_and_Shape/advance_shape";
import { TriangularColorPickerDisplayHistory } from "../../Color Picker/ColorPicker";
import { Cross, Star, Triangle } from "./Patterns_and_Shape/basic_shape";
import { useSettings } from "../../Context/setting";
import TestBottom from "../General/TestBottom";
import { ResultDisplay } from "../Result/ResultDisplay";
import Evaluation from "../Result/Evaluation";


function generatePair(hRange, lRange, sRange, mode, step, direction = ['L']) {

    // // Not the maximum
    // let newLRange = [lRange[0], lRange[1] - step]
    // let newSRange = [sRange[0], sRange[1] - step]

    let color1 = generateRandomColorAdvanced(hRange, lRange, sRange, mode, step);

    // Not less than ref
    // newLRange = [color1.l + step, lRange[1]]
    // newSRange = [sRange[0], color1.s]

    let color2;
    do {
        color2 = generateRandomColorAdvanced(hRange, lRange, sRange, mode, step);
        let diff = calculateHLSDifference(color1, color2);
        if (Math.abs(diff.h) >= 5 || Math.abs(diff.s) >= 5 || Math.abs(diff.l) >= 5) break;
    } while (true)

    if (color1.l < color2.l || (color1.l === color2.l && color1.s > color2.s)) {
        [color1, color2] = [color2, color1];
    }
    return [color1, color2]
}

const CompareTest = ({ hRange, sRange, lRange, selectedColor, length = 2, step = 20, testId, setTestStarted }) => {

    const [refColor, setRefColor] = useState(defaultHLS)
    const [targetColor, setTargetColor] = useState(defaultHLS)

    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [testHistory, setTestHistory] = useState([])
    const [checkedResult, setCheckedResult] = useState(false);
    const { mode, difficulties, testNum, saveToHistory, practicing } = useSettings()

    const [chosenDirection, setChosenDirection] = useState('L')

    useEffect(() => {
        setColors();
    }, [])


    const direction = ['S', 'L']
    const setColors = () => {
        let color1, color2;
        // if (testHistory.length > currentTestNum) {
        //     const { refColor , targetColor } = testHistory[currentTestNum]
        //     [color1, color2] = [refColor, targetColor]
        // } else {
        [color1, color2] = generatePair(hRange, lRange, sRange, mode, step);
        // const newHistory = [...testHistory, { color1, color2 }];
        // setTestHistory(newHistory)
        // }
        // 
        setRefColor(color1)
        setTargetColor(color2)

    }

    const handleNext = () => {
        if (testEnded) {
            setTestStarted(false)
        } else {
            setColors()
            setCurrentTestNum(num => num + 1)
        }

        setCheckedResult(false);
    }

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
        const newHistory = [...testHistory, { refColor, targetColor, selectedColor }];
        setTestHistory(newHistory)

        if (currentTestNum >= testNum) {
            //Print Evaluation Result
            console.log('test ended, print result :>> ',);
            console.log('AllHistory :>> ', newHistory);
        }

        // if (saveToHistory) addHistory(targetColor, selectedColor, mode, testId);
        setCheckedResult(true)
    };
    const testEnded = currentTestNum >= (testNum - 1) && checkedResult

    return (
        <div>
            {/* <ReorderList guessList={guessList} setGuessList={setGuessList} /> */}
            {/* {checkedResult && <p>{checkSortResult().toString()}</p>} */}
            <TestDisplay refColor={refColor} targetColor={targetColor} selectedColor={selectedColor} showGuess={practicing || checkedResult} />
            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} mode={mode} difficulties={difficulties} />}

            <TestBottom showBackButton={currentTestNum === 0} testEnded={testEnded} checkedResult={checkedResult} onNext={handleNext} onCheck={checkResult} onBack={handleBack} />
            <ExampleDisplay refColor={refColor} targetColor={targetColor} />
            {testEnded && <Evaluation history={testHistory} mode={mode} difficulty={difficulties} />}


        </div>
    )
}

const TestDisplay = ({ refColor, targetColor, selectedColor, showGuess = false }) => {
    // const [currentIndex, setCurrentIndex] = useState(0)
    // const [guesses, setGuesses] = useState([])
    // const [checkedResult, setCheckedResult] = useState(false)

    return (
        <div>

            <div className="flex flex-row justify-center items-center gap-4">
                {/* <ColorSwatch color={guessColor} /> */}
                <TriangularColorPickerDisplayHistory hue={refColor.h} correct={[refColor]} size={150} />
                <div className="">
                    <h3 className="text-lg font-semibold mb-2">Ref Color</h3>
                    <ColorSwatch color={refColor} size={3} border={true} />

                </div>
                <div className="">
                    <h3 className="text-lg font-semibold mb-2">Target Color</h3>
                    <ColorSwatch color={targetColor} size={3} border={true} />

                </div>

                {showGuess && <div className="">
                    <h3 className="text-lg font-semibold mb-2">Selected Color</h3>
                    <ColorSwatch color={selectedColor} size={3} border={true} />

                </div>
                }

            </div>
        </div>
    )
}

const ExampleDisplay = memo(({ refColor, targetColor, patternDensity = 30, }) => {
    return (
        <>
            <PlusPattern width={25} color1={refColor} color2={targetColor} rotation={45} />
            {/* <PolkaDotsPattern width={25} color1={refColor} color2={targetColor} rotation={45} />

        <FakeSphere color1={refColor} color2={targetColor} /> */}
            {/* <svg width="100" height="100" viewBox="0 0 24 24">
            <polygon fill="gold" points="12,17.27 18.18,21 15.64,13.97 21.82,9.24 14.47,8.63 12,2 9.53,8.63 2.18,9.24 8.36,13.97 5.82,21" />
        </svg>
        <Gradient color1={refColor} color2={targetColor} />
        <YingYangLike color1={refColor} color2={targetColor} radius={60} />
        <CircleOverSquare color1={refColor} color2={targetColor} width={100} radius={40} /> */}

            {/* <MoveOver color1={refColor} color2={targetColor} /> */}
            {/* <FakeLaptop color1={refColor} color2={targetColor} />
        <ShapeBorder color1={refColor} color2={targetColor} /> */}
        </>

    )
})

export default CompareTest;
// patternUnits='userSpaceOnUse'  patternTransform='scale(4) rotate(70)'> stroke-width='1' stroke='none' fill='hsla(15,94.3%,6.9%,1)' /></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' /></svg>

