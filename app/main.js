import React, { useState, useCallback } from 'react';
import { ColorPicker } from './ColorPicker';
import ColorTest from './test';
import ColorHistoryTable from './history';
import OrderTest from './Test/reorder';
import { getHistory } from './Storage/test_history';

const all_modes = [
    { value: 'normal', label: 'normal' },
    { value: 'bw', label: 'black and white' },
    { value: 'compare', label: 'compare' },
];


const ModeSelection = ({ mode, setMode }) => {
    return (<div className="flex items-center space-x-4 mb-4">
        <label className="font-medium">Mode: </label>
        <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border rounded px-2 py-1"
        >
            {all_modes.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>)
}

const ColorTrainingTool = () => {
    const [selectedColor, setSelectedColor] = useState({ h: 40, s: 100, l: 50 });
    const [targetColor, setTargetColor] = useState(null);
    const [mode, setMode] = useState('normal')
    const [checkedResult, setCheckedResult] = useState(false);
    const [practiceMode, setPracticeMode] = useState(true);

    const backgroundColor = `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.l}%)`;
    return (
        <div>
            <div className='flex flex-col justify-center items-center'>
                <div className="mx-auto p-4  flex flex-row items-center">
                    <div className='flex gap-4'>
                        <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                            <div className='flex justify-between'>
                                <ModeSelection mode={mode} setMode={setMode} />
                                <div className="flex items-center justify-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={practiceMode}
                                        id="hideChooseCheckbox"
                                        onChange={(e) => setPracticeMode(!practiceMode)}
                                    />
                                    <label htmlFor="hideChooseCheckbox" className="text-sm">
                                        Practice
                                    </label>
                                </div>
                            </div>



                            {targetColor &&
                                <div className="flex space-x-4 mb-4 justify-center">


                                    <div className="w-1/2">
                                        <h3 className="text-lg font-semibold mb-2">Target Color</h3>
                                        <div
                                            className="w-full h-40 rounded border-4 border-slate-300"
                                            style={{ backgroundColor: targetColor ? `hsl(${targetColor.h}, ${targetColor.s}%, ${targetColor.l}%)` : 'white' }}
                                        ></div>
                                    </div>

                                    {(checkedResult || practiceMode) && (

                                        <div className="w-1/2">
                                            <h3 className="text-lg font-semibold mb-2">Your Color</h3>
                                            <div
                                                className="w-full h-40 rounded border-4 border-slate-300"
                                                style={{ backgroundColor }}
                                            ></div>
                                        </div>
                                    )}
                                </div>
                            }


                            <ColorTest selectedColor={selectedColor} targetColor={targetColor} setTargetColor={setTargetColor}
                                mode={mode} checkedResult={checkedResult} setCheckedResult={setCheckedResult} saveToHistory={!practiceMode}
                            />
                        </div>
                        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                    </div>
                </div>
                <DisplayColorRange hue={targetColor&&targetColor.h} step={20} />
                <OrderTest />
            </div>
            {/* <ColorHistoryTable history={getHistory()} mode='bw' difficulty='easy'/> */}

        </div>

    );
}

const DisplayColorRange = ({ hue, step = 20 }) => {
    const rangeArray = [];
    for (let i = 0; i <= 100; i += step) {
        rangeArray.push(i);
    }

    return (
        <div className='flex flex-col gap-2'>
            {rangeArray.toReversed().map((l, index) => {
                return (
                    <div className='flex flex-row gap-2' key={index}>
                        {rangeArray.map((s, j) => {

                            return (
                                <div key={j}
                                    className="w-12 h-12 border border-gray-300"
                                    style={{ backgroundColor: `hsl(${hue}, ${s}%, ${l}%)` }}
                                ></div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}


export default ColorTrainingTool;