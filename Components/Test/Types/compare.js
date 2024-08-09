
import { useEffect, useState } from "react"
import { calculateHLSDifference, generateId, getRandomIntStep, getRandomValue, stepInDifficulty } from "../../../Utils/utils";
import { defaultHLS, defaultLS, generateRandomColorAdvanced, checkIfCorrect, hlsToString } from "../../../Utils/color_util";
import ColorSwatch from "../../Color Picker/ColorSwatch";
import { TriangularColorPickerDisplayHistory } from "../../Color Picker/ColorPicker";
import { useSettings } from "../../../Contexts/setting";
import TestBottom from "../TestBottom";
import { ResultDisplay } from "../../Evaluation/ResultDisplay";
import Evaluation from "../../Evaluation/Evaluation";
import { shapes } from "../../General/Patterns_and_Shape/ShapeRenderer.";
import DisplayContrasts from "../../Practice/DisplayContrast";
import { SVGDefsProvider } from "../../General/Patterns_and_Shape/SVGDefContext";
import SVGRenderer from "../../General/Patterns_and_Shape/SVGRenderer";
import { patterns } from "../../General/Patterns_and_Shape/PatternRenderer";
import { useAddHistory } from "../../../Storage/hooks/useAddHistory";


const CompareTest = ({ hRange, sRange, lRange, selectedColor, length = 2, testId, setTestStarted, setSelectedColor }) => {

    const [refColor, setRefColor] = useState(defaultHLS)
    const [targetColor, setTargetColor] = useState(defaultHLS)
    const [pattern, setPattern] = useState('PolkaDots')
    const [shape, setShape] = useState('Star')
    const [patternRotation, setPatternRotation] = useState(0)
    const [shapeRotation, setShapeRotation] = useState(0)

    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [testHistory, setTestHistory] = useState([])
    const [checkedResult, setCheckedResult] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());

    const [retrying, setRetrying] = useState(false);
    const [currentRetryingNum, setCurrentRetryingNume] = useState(0);

    const { mode, difficulty, testNum, saveToHistory, practicing, testMethod } = useSettings()
    const { addHistory: addHistoryDB } = useAddHistory();


    // Guessing Bright/Dark
    const [chosenDirection, setChosenDirection] = useState('L')

    useEffect(() => {
        setup();
    }, [])

    const setup = () => {
        setColors();
        setPattern(getRandomValue(patterns))
        setPatternRotation(getRandomIntStep(-45, 45, 45))


        setShape(getRandomValue(shapes))
        setShapeRotation(getRandomIntStep(-45, 45, 45))
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

        setStartTime(Date.now())

    }

    const handleBack = () => {
        setTestStarted(false)
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

        const correct = checkIfCorrect(targetColor, selectedColor, mode, difficulty)
        const ellapsedTime = Date.now() - startTime
        const newHistory = [...testHistory, { refColor, targetColor, selectedColor, pattern, shape, isRetry: retrying, correct, time: ellapsedTime }];
        setTestHistory(newHistory)

        if (saveToHistory) addHistoryDB({ testId, targetColor, selectedColor, mode, difficulty: difficulty, refColor, correct, time: ellapsedTime, testMethod });
    };
    const incorrectHistory = testHistory.filter(({ correct, isRetry }) => !correct && !isRetry)
    const retryEnded = currentRetryingNum >= incorrectHistory.length && checkedResult

    const testEnded = currentTestNum >= testNum && checkedResult && (!retrying || retryEnded)
    const canRetry = incorrectHistory.length > 0 && !retrying && testEnded

    return (
        <div>
            <div className="flex flex-col gap-3">

                <label>{!retrying ? (currentTestNum) : (currentRetryingNum)} / {!retrying ? (testNum) : incorrectHistory.length}</label>
                <div className="flex flex-row justify-center gap-5">

                    {/* <ReorderList guessList={guessList} setGuessList={setGuessList} /> */}
                    {/* {checkedResult && <p>{checkSortResult().toString()}</p>} */}
                    <div>
                        <TestDisplay refColor={refColor} targetColor={targetColor} selectedColor={selectedColor} showGuess={practicing || checkedResult} showTarget={checkedResult} />
                        <SVGDisplay show={(checkedResult || practicing)} refColor={refColor} targetColor={targetColor} selectedColor={selectedColor} pattern={pattern} patternRotation={patternRotation} shape={shape} shapeRotation={shapeRotation} />
                        {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} />}
                    </div>
                    {<DisplayContrasts pattern={pattern} shape={shape} patternRotation={patternRotation} shapeRotation={shapeRotation} refColor={refColor}
                        selectedColor={selectedColor} setSelectedColor={setSelectedColor}
                        h_range={hRange} s_range={sRange} l_range={[lRange[0], refColor.l]} resetVariable={currentTestNum + currentRetryingNum} />}
                </div>
            </div>
            {testEnded && <Evaluation history={testHistory} mode={mode} difficulty={difficulty} />}
            <TestBottom showRetryButton={canRetry} onRetry={handleRetry} showBackButton={currentTestNum <= 1} testEnded={testEnded} checkedResult={checkedResult} onNext={handleNext} onCheck={checkResult} onBack={handleBack} />



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

const SVGDisplay = ({ refColor, targetColor, selectedColor, show = false, pattern, shape, patternRotation, shapeRotation }) => {
    return (
        <div className="flex h-[300] gap-5">
            <SVGDefsProvider>
                <SVGRenderer refColor={refColor} targetColor={targetColor} pattern={pattern} shape={shape} width={300} patternRotation={patternRotation} shapeRotation={shapeRotation} />
                <div className={show ? "opacity-100" : " opacity-0"}>
                    {<SVGRenderer refColor={refColor} targetColor={selectedColor} pattern={pattern} shape={shape} width={300} patternRotation={patternRotation} shapeRotation={shapeRotation} />}
                </div>
            </SVGDefsProvider>
        </div>
    )
}

export default CompareTest;

function generatePair(hRange, lRange, sRange, mode, step, direction = ['L']) {

    let color1 = generateRandomColorAdvanced(hRange, lRange, sRange, mode, step);
    let color2 = generateRandomColorAdvanced(hRange, lRange, sRange, mode, step, color1)

    if (color1.l < color2.l || (color1.l === color2.l && color1.s > color2.s)) {
        [color1, color2] = [color2, color1];
    }
    return [color1, color2]
}