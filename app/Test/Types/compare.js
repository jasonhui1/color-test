
import { useEffect, useState } from "react"
import { calculateHLSDifference, generateId, getRandomIntStep, getRandomValue, stepInDifficulty } from "../../General/utils";
import { defaultHLS, generateRandomColorAdvanced, getIsCorrect, hlsToString } from "../../General/color_util";
import ColorSwatch from "../../Color Picker/ColorSwatch";
import { TriangularColorPickerDisplayHistory } from "../../Color Picker/ColorPicker";
import { useSettings } from "../../Context/setting";
import TestBottom from "../General/TestBottom";
import { ResultDisplay } from "../Result/ResultDisplay";
import Evaluation from "../Result/Evaluation";
import { addHistory } from "../../Storage/test_history";
import { addHistorySB } from "../../Storage/test_history_supabase";
import PatternRenderer, { patterns, shapes } from "./Patterns_and_Shape/PatternRenderer";


const CompareTest = ({ hRange, sRange, lRange, selectedColor, length = 2, testId, setTestStarted, setSelectedColor }) => {

    const [refColor, setRefColor] = useState(defaultHLS)
    const [targetColor, setTargetColor] = useState(defaultHLS)
    const [pattern, setPattern] = useState('PolkaDots')
    const [shape, setShape] = useState('Star')

    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [testHistory, setTestHistory] = useState([])
    const [checkedResult, setCheckedResult] = useState(false);

    const [retrying, setRetrying] = useState(false);
    const [currentRetryingNum, setCurrentRetryingNume] = useState(0);

    const { mode, difficulty, testNum, saveToHistory, practicing } = useSettings()

    // Guessing Bright/Dark
    const [chosenDirection, setChosenDirection] = useState('L')

    useEffect(() => {
        setup();
    }, [])

    const setup = () => {
        setColors();
        setPattern(getRandomValue(patterns))
        setShape(getRandomValue(shapes))
        setCurrentTestNum(currentTestNum + 1)
    }

    const direction = ['S', 'L']
    const setColors = () => {
        let [color1, color2] = generatePair(hRange, lRange, sRange, mode, stepInDifficulty(difficulty));
        setSelectedColor(color1)
        setRefColor(color1)
        setTargetColor(color2)
    }


    const handleNext = () => {
        setCheckedResult(false);
        if (testEnded) {
            setTestStarted(false)

        } else {
            if (!retrying) {
                setup()
            } else {
                nextRetry()
            }
        }
    }

    const handleBack = () => {
        if (currentTestNum === 0) {
            setTestStarted(false)
        }
    }

    const handleRetry = () => {
        setRetrying(true)
        setCheckedResult(false)
        nextRetry()
        // setTargetColor(incorrectHistory[currentRetryingNum].targetColor)
    }

    const nextRetry = () => {
        setTargetColor(incorrectHistory[currentRetryingNum].targetColor)
        setRefColor(incorrectHistory[currentRetryingNum].refColor)
        setPattern(incorrectHistory[currentRetryingNum].pattern)
        setCurrentRetryingNume(num => num + 1)
        setShape(incorrectHistory[currentRetryingNum].shape)
    }


    const checkResult = () => {
        if (checkedResult) return
        setCheckedResult(true)

        const correct = getIsCorrect(targetColor, selectedColor, mode, difficulty)
        const newHistory = [...testHistory, { refColor, targetColor, selectedColor, pattern, shape, isRetry: retrying, correct }];
        setTestHistory(newHistory)

        if (saveToHistory) addHistorySB({ testId, targetColor, selectedColor, mode, difficulty: difficulty, refColor, correct });
    };
    const incorrectHistory = testHistory.filter(({ correct, isRetry }) => !correct && !isRetry)
    const retryEnded = currentRetryingNum >= incorrectHistory.length && checkedResult

    const testEnded = currentTestNum >= testNum && checkedResult && (!retrying || retryEnded)
    const canRetry = incorrectHistory.length > 0 && !retrying && testEnded

    return (
        <div>
            <label>{!retrying ? (currentTestNum) : (currentRetryingNum)} / {!retrying ? (testNum) : incorrectHistory.length}</label>

            {/* <ReorderList guessList={guessList} setGuessList={setGuessList} /> */}
            {/* {checkedResult && <p>{checkSortResult().toString()}</p>} */}
            <TestDisplay refColor={refColor} targetColor={targetColor} selectedColor={selectedColor} showGuess={practicing || checkedResult} showTarget={checkedResult} />

            {testEnded && <Evaluation history={testHistory} mode={mode} difficulty={difficulty} />}
            <TestBottom showRetryButton={canRetry} onRetry={handleRetry} showBackButton={currentTestNum === 0} testEnded={testEnded} checkedResult={checkedResult} onNext={handleNext} onCheck={checkResult} onBack={handleBack} />
            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} />}
            <div className="flex h-[200px]">
                <PatternRenderer refColor={refColor} targetColor={targetColor} pattern={pattern} />
                {checkedResult && <PatternRenderer refColor={refColor} targetColor={selectedColor} pattern={pattern} />}
            </div>


        </div>
    )
}




const TestDisplay = ({ refColor, targetColor, selectedColor, showGuess = false, showTarget = false }) => {
    // const [currentIndex, setCurrentIndex] = useState(0)
    // const [guesses, setGuesses] = useState([])
    // const [checkedResult, setCheckedResult] = useState(false)
    const incorrect = showTarget ? [targetColor] : []

    return (
        <div>

            <div className="flex flex-row justify-center items-center gap-4 ">
                {/* <ColorSwatch color={guessColor} /> */}
                <TriangularColorPickerDisplayHistory hue={refColor.h} correct={[refColor]} incorrect={incorrect} size={150} />
                <div className="">
                    <h3 className="text-lg font-semibold mb-2">Ref Color</h3>
                    <ColorSwatch color={refColor} size={3} border={true} />

                </div>
                {showTarget && <div className="">
                    <h3 className="text-lg font-semibold mb-2">Target Color</h3>
                    <ColorSwatch color={targetColor} size={3} border={true} />

                </div>}

                {showGuess && <div className="">
                    <h3 className="text-lg font-semibold mb-2">Selected Color</h3>
                    <ColorSwatch color={selectedColor} size={3} border={true} />

                </div>
                }

            </div>
        </div>
    )
}

export default CompareTest;

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
        console.log('color1, color2, diff :>> ', color1, color2, diff);
        if (Math.abs(diff.h) >= 5 || Math.abs(diff.s) >= 5 || Math.abs(diff.l) >= 5) break;
    } while (true)

    if (color1.l < color2.l || (color1.l === color2.l && color1.s > color2.s)) {
        [color1, color2] = [color2, color1];
    }
    return [color1, color2]
}