import React, { useState, useCallback } from 'react';
import { addHistory } from './Storage/test_history';
import { calculateHLSDifference, getRandomInt, getRandomIntStep } from './utils';
import { ColorPicker } from './ColorPicker';
import TestControls from './Test/TestParamterControl';
import { RenderResult, ResultDisplay } from './Test/ResultDisplay';
const all_difficulities = [
    { value: 'easy', label: 'Easy', step: 20 },
    { value: 'normal', label: 'Normal', step: 10 },
    { value: 'hard', label: 'Hard', step: 5 },

]


function generateRandomColor(h_range, s_range, l_range, step = 1) {

    // allow wrapping
    //TODO: hacking h difficulty
    const h = getRandomIntStep(h_range[0], h_range[1] + 360, step === 20 ? 15 : step) % 361;
    const s = getRandomIntStep(s_range[0], s_range[1] + 100, step) % 101;
    const l = getRandomIntStep(l_range[0], l_range[1] + 100, step) % 101;

    return { h, s, l };
}

const ColorTest = ({ selectedColor, targetColor, setTargetColor, mode, checkedResult, setCheckedResult }) => {
    const [hSelected, setHSelected] = useState('all');
    const [sSelected, setSSelected] = useState('all');
    const [lSelected, setLSelected] = useState('all');

    const [hRange, setHRange] = useState([0, 360]);
    const [sRange, setSRange] = useState([0, 100]);
    const [lRange, setLRange] = useState([0, 100]);

    const [difficulties, setDifficulties] = useState('easy')
    const [testNum, setTestNum] = useState('10')
    const [currentTestNum, setCurrentTestNum] = useState('10')
    const [test_history, setTestHistory] = useState([])

    const setRandomTargetColor = () => {
        function generateTargetColor() {
            let newTargetColor;
            do {
                const step = all_difficulities.find((option) => option.value === difficulties).step
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
        console.log('newTargetColor :>> ', newTargetColor);
        setTargetColor(newTargetColor);
    };

    const startTest = () => {
        setRandomTargetColor()
        setCheckedResult(false);

        if (currentTestNum >= testNum) {
            setCurrentTestNum(0);
            setTestHistory([]);
        }
    };

    const checkResult = () => {
        if (!checkedResult) {
            const num = currentTestNum + 1
            setCurrentTestNum(num)
            setTestHistory(history => [...history, { targetColor, selectedColor }])
            if (num >= testNum) {
                //Print Evaluation Result
            }

            addHistory(targetColor, selectedColor, mode);
        }
        setCheckedResult(true)
    };

    const nextTest = () => {
        if (currentTestNum < testNum) {
            setRandomTargetColor();
            setCheckedResult(false);
        }
    };


    const onChangeDifficulty = (setCurrent) => {
        return (e) => {
            const value = e.target.value;
            setCurrent(value);
        };
    };

    return (
        <div>
            <div className="mt-6">
                <TestControls difficulties={difficulties} setDifficulties={setDifficulties} mode={mode}
                    hSelected={hSelected} sSelected={sSelected} lSelected={lSelected} setHSelected={setHSelected} setLSelected={setLSelected} setSSelected={setSSelected}
                    hRange={hRange} sRange={sRange} lRange={lRange} setHRange={setHRange} setSRange={setSRange} setLRange={setLRange} />

                <button
                    onClick={startTest}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
                >
                    Generate Target Color
                </button>
                <button
                    onClick={checkResult}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    disabled={!targetColor}
                >
                    Check Result
                </button>
            </div>

            {checkedResult && <ResultDisplay targetColor={targetColor} selectedColor={selectedColor} />}
        </div>
    );
}



export default ColorTest;