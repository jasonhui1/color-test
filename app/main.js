import React, { useState, useCallback } from 'react';
import { ColorPicker } from './Color Picker/ColorPicker';
import ColorTest from './Test/test';
import ColorHistoryTable from './history';
import OrderTest from './Test/Types/reorder';
import { getHistory } from './Storage/test_history';
import Evaluation from './Test/Result/Evaluation';
import ColorSwatch from './Color Picker/ColorSwatch';
import CheckBox from './General/CheckBox';
import { SelectBox } from './General/SelectBox';

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
    return (
        <div>
            <div className='flex flex-col justify-center items-center'>
                <div className="mx-auto p-4  flex flex-row items-center">
                    <div className='flex gap-4'>
                        <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                            <div className='flex items-center justify-between gap-4'>
                                <SelectBox current={mode} onChange={setMode} options={all_modes} label={'Mode'} />
                                <CheckBox checked={practiceMode} onChange={(e) => setPracticeMode(!practiceMode)} label={'Practice'} />
                            </div>


                            {targetColor &&
                                <div className="flex space-x-4 mb-4 justify-center">
                                    <div className="w-1/2">
                                        <h3 className="text-lg font-semibold mb-2">Target Color</h3>
                                        <ColorSwatch color={targetColor} size={3} border={true} />

                                    </div>

                                    {(checkedResult || practiceMode) && (
                                        <div className="w-1/2">
                                            <h3 className="text-lg font-semibold mb-2">Your Color</h3>
                                            <ColorSwatch color={selectedColor} size={3} border={true} />
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
                <DisplayColorRange hue={targetColor && targetColor.h} step={20} />
            </div>
            {/* <ColorHistoryTable history={getHistory()} mode='bw' difficulty='easy'/> */}
            {/* <Evaluation history={getHistory()} mode={'normal'} difficulty={'easy'} /> */}

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
                                <ColorSwatch key={j} color={{ h: hue, s, l }} size={1} />
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}


export default ColorTrainingTool;