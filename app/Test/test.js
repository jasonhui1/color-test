import React, { useState, useCallback } from 'react';
import { addHistory } from '../Storage/test_history';
import TestControls from './Paramaters/TestParamterControl';
import { RenderResult, ResultDisplay } from './Result/ResultDisplay';
import Evaluation from './Result/Evaluation';
import OrderTest from './Types/reorder';
import { generateRandomColorAdvanced } from '../General/color_util';

const ColorTest = ({ selectedColor, targetColor, setTargetColor, mode, checkedResult, setCheckedResult, saveToHistory }) => {

    const [hRange, setHRange] = useState([0, 360]);
    const [sRange, setSRange] = useState([0, 100]);
    const [lRange, setLRange] = useState([0, 100]);

    const [difficulties, setDifficulties] = useState('easy')
    const [testNum, setTestNum] = useState(25)
    const [currentTestNum, setCurrentTestNum] = useState(0)
    const [test_history, setTestHistory] = useState([])

    // do later
    // const [creatingTest, setCreatingTest] = useState(false);
    const [testId, setTestId] = useState('0');


    const setRandomTargetColor = () => {
        const newTargetColor = generateRandomColorAdvanced(hRange, lRange, sRange, mode, difficulties, targetColor);
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

        if (currentTestNum >= testNum) {
            restartTest()
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

                <div className={"flex flex-row " + (showBackButton ? ' justify-between' : 'justify-end')}>
                    {showBackButton && <BackButton onClick={() => setTestId('0')} />}
                    {showNextButton && <NextButton testStarted={testStarted} testEnded={testEnded} onClick={handleNext} />}
                    {showCheckButton && <CheckResultButton onClick={checkResult} />}
                </div>

            </div>

            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} mode={mode} difficulties={difficulties} />}
            {testEnded && <Evaluation history={test_history} mode={mode} difficulty={difficulties} />}
            <OrderTest hRange={hRange} sRange={sRange} lRange={lRange} length={4} step={20} />

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
