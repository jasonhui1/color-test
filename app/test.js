import React, { useState, useCallback } from 'react';
import { addHistory } from './Storage/test_history';
import { calculateHLSDifference, getRandomInt, getRandomIntStep, stepInDifficulty } from './General/utils';
import { ColorPicker } from './Color Picker/ColorPicker';
import TestControls from './Test/TestParamterControl';
import { RenderResult, ResultDisplay } from './Test/ResultDisplay';
import ColorHistoryTable from './history';
import { allDifficulties } from './Test/parameters';
import Evaluation from './Test/Evaluation';



function generateRandomColor(h_range, s_range, l_range, step = 1) {

    // allow wrapping
    //TODO: hacking h difficulty
    const h = getRandomIntStep(h_range[0], h_range[1] + (h_range[1] < h_range[0] ? 360 : 0), step === 20 ? 15 : step) % 361;
    const s = getRandomIntStep(s_range[0], s_range[1] + (s_range[1] < s_range[0] ? 100 : 0), step) % 101;
    const l = getRandomIntStep(l_range[0], l_range[1] + (l_range[1] < l_range[0] ? 100 : 0), step) % 101;

    return { h, s, l };
}

const ColorTest = ({ selectedColor, targetColor, setTargetColor, mode, checkedResult, setCheckedResult, saveToHistory }) => {

    const [hRange, setHRange] = useState([0, 360]);
    const [sRange, setSRange] = useState([0, 100]);
    const [lRange, setLRange] = useState([0, 100]);

    const [difficulties, setDifficulties] = useState('easy')
    const [testNum, setTestNum] = useState(10)
    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [test_history, setTestHistory] = useState([])

    // do later
    // const [creatingTest, setCreatingTest] = useState(false);
    const [testId, setTestId] = useState('0');


    const setRandomTargetColor = () => {
        function generateTargetColor() {
            let newTargetColor;
            do {
                const step = stepInDifficulty(difficulties);
                if (mode === 'bw') {
                    newTargetColor = generateRandomColor([0, 0], [0, 0], lRange, step);
                } else {
                    newTargetColor = generateRandomColor(hRange, sRange, lRange, step);
                }

                if (!targetColor) break;

                let diff = calculateHLSDifference(targetColor, newTargetColor);
                if (Math.abs(diff.h) >= 5 || Math.abs(diff.s) >= 5 || Math.abs(diff.l) >= 5) break;

            } while (true);

            return newTargetColor
        }

        let newTargetColor = generateTargetColor();
        setTargetColor(newTargetColor);
    };

    const startTest = () => {

        const nextTest = () => {
            setRandomTargetColor();
            setCurrentTestNum(num => num + 1)
        };

        if (currentTestNum >= testNum) {
            setCurrentTestNum(0);
            setTestHistory([]);
        } else {
            nextTest()
        }

        setCheckedResult(false);
    };

    const checkResult = () => {
        if (checkedResult) return
        const newHistory = [...test_history, { targetColor, selectedColor }];

        setTestHistory(newHistory)
        if (currentTestNum >= testNum) {
            //Print Evaluation Result
            console.log('test ended, print result :>> ',);
            console.log('AllHistory :>> ', newHistory);
        }

        if (saveToHistory) addHistory(targetColor, selectedColor, mode, testId);
        setCheckedResult(true)
    };


    const testSelected = testId !== '0';
    const testStarted = currentTestNum > 0
    const testEnded = currentTestNum >= testNum && checkedResult

    const showBackButton = testSelected && (!testStarted)
    const showNextButton = testSelected && (!testStarted || checkedResult)
    const showCheckButton = testStarted && !checkedResult

    return (
        <div>
            <div className="mt-6 min-w-[300px] h-full">
                {!testStarted &&
                    <TestControls difficulties={difficulties} setDifficulties={setDifficulties} mode={mode}
                        hRange={hRange} sRange={sRange} lRange={lRange}
                        setHRange={setHRange} setSRange={setSRange} setLRange={setLRange}
                        testId={testId} setTestId={setTestId}
                    />
                }

                <div className="flex flex-row justify-between">
                    {showBackButton && <BackButton onClick={() => setTestId('0')} />}
                    {showNextButton && <NextButton testStarted={testStarted} testEnded={testEnded} onClick={startTest} />}
                    {showCheckButton && <CheckResultButton onClick={checkResult} />}
                </div>

            </div>

            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} mode={mode} difficulties={difficulties} />}
            {testEnded && <Evaluation history={test_history} mode={mode} difficulty={difficulties} />}
        </div>
    );
}

export const BackButton = ({ onClick }) => {

    return (
        <div className="flex justify-end">
            <button
                onClick={onClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                Back
            </button>
        </div>
    )
}

export const NextButton = ({ testStarted, testEnded, onClick }) => {
    let label = 'Start Test'
    if (testStarted) {
        if (!testEnded) {
            label = 'Next'
        } else {
            label = 'End Test'
        }
    }

    return (
        <div className="flex justify-end">
            <button
                onClick={onClick}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
                {label}
            </button>
        </div>
    )
}

export const CheckResultButton = ({ onClick, }) => {

    return (
        <div className="flex justify-end">

            <button
                onClick={onClick}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
                Check Result
            </button>
        </div>
    )
}

export default ColorTest;