import React, { useState, useCallback } from 'react';
import { addHistory } from './Storage/test_history';
import { calculateHLSDifference, getRandomInt, getRandomIntStep, stepInDifficulty } from './utils';
import { ColorPicker } from './ColorPicker';
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

        if (saveToHistory) addHistory(targetColor, selectedColor, mode);
        setCheckedResult(true)
    };



    const testStarted = currentTestNum > 0
    const testEnded = currentTestNum >= testNum && checkedResult

    return (
        <div>
            <div className="mt-6 min-w-[300px]">
                {!testStarted &&
                    <TestControls difficulties={difficulties} setDifficulties={setDifficulties} mode={mode}
                        hRange={hRange} sRange={sRange} lRange={lRange}
                        setHRange={setHRange} setSRange={setSRange} setLRange={setLRange} />
                }

                {(!testStarted || checkedResult) && <NextButton testStarted={testStarted} testEnded={testEnded} onClick={startTest} />}
                {testStarted && !checkedResult && <CheckResultButton onClick={checkResult} />}

            </div>

            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} mode={mode} difficulties={difficulties} />}
            {testEnded && <Evaluation history={test_history} mode={mode} difficulty={difficulties} />}
        </div>
    );
}

const NextButton = ({ testStarted, testEnded, onClick }) => {
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

const CheckResultButton = ({ onClick, }) => {

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