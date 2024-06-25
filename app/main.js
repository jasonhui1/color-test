import React, { useState, useCallback } from 'react';
import { ColorPicker } from './ColorPicker';
import ColorTest from './test';
import ColorHistoryTable from './history';

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
    const [selectedColor, setSelectedColor] = useState({ h: 40, s: 100, v: 100 });
    const [targetColor, setTargetColor] = useState(null);
    const [mode, setMode] = useState('normal')
    const [checkedResult, setCheckedResult] = useState(false);
    const [hideChoose, setHideChoose] = useState(true);

    const backgroundColor = `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.v}%)`;
    return (
        <div>
            <div className='flex h-lvh flex-col justify-center items-center'>
                <div className="mx-auto p-4  flex flex-row items-center">
                    <div className='flex gap-4'>
                        <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                            <div className='flex justify-between'>
                                <ModeSelection mode={mode} setMode={setMode} />
                                <div className="flex items-center justify-center mb-4">
                                    <input
                                        type="checkbox"
                                        checked={hideChoose}
                                        id="hideChooseCheckbox"
                                        onChange={(e) => setHideChoose(e.target.checked)}
                                    />
                                    <label htmlFor="hideChooseCheckbox" className="text-sm">
                                        Test
                                    </label>
                                </div>
                            </div>

                            {targetColor &&

                                <div className="flex space-x-4 mb-4 justify-center">


                                    <div className="w-1/2">
                                        <h3 className="text-lg font-semibold mb-2">Target Color</h3>
                                        <div
                                            className="w-full h-40 rounded border-4 border-slate-300"
                                            style={{ backgroundColor: targetColor ? `hsl(${targetColor.h}, ${targetColor.s}%, ${targetColor.v}%)` : 'white' }}
                                        ></div>
                                    </div>

                                    {(checkedResult || !hideChoose) && (

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
                                mode={mode} checkedResult={checkedResult} setCheckedResult={setCheckedResult}
                            />
                        </div>
                        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                    </div>
                </div>
            </div>
            <ColorHistoryTable />
        </div>

    );
}

const DisplayColorRange = ({ step = 20 }) => {
    const rangeArray = [];
    for (let i = 0; i <= 100; i += step) {
        rangeArray.push(i);
    }

    return (
        <div className='flex my-2'>
            {rangeArray.map((val) => {

                return (
                    <div
                        className="w-12 h-12 mr-2 border border-gray-300"
                        style={{ backgroundColor: `hsl(0, 0%, ${val}%)` }}
                    ></div>
                )
            })}
        </div>
    )
}


export default ColorTrainingTool;