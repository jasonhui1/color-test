import React, { useState, useCallback } from 'react';
import { FaCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { addHistory } from './Storage/test_history';
import { getRandomInt } from './utils';

const colorOptions = [
    { value: 'all', label: 'All Colors', range: [0, 360] },
    { value: 'red', label: 'Red', range: [330, 375] },
    { value: 'orange', label: 'Orange', range: [15, 45] },
    { value: 'yellow', label: 'Yellow', range: [45, 75] },
    { value: 'green', label: 'Green', range: [75, 150] },
    { value: 'cyan', label: 'Cyan', range: [150, 210] },
    { value: 'blue', label: 'Blue', range: [210, 240] },
    { value: 'indigo', label: 'Indigo', range: [240, 270] },
    { value: 'purple', label: 'Purple', range: [270, 330] },
    { value: 'custom', label: 'Custom', range: [] },
];

const brightnessOptions = [
    { value: 'all', label: 'All Brightness', range: [0, 100] },
    { value: 'very bright', label: 'Very Bright', range: [75, 97] },
    { value: 'bright', label: 'Bright', range: [50, 75] },
    { value: 'dim', label: 'Dim', range: [25, 50] },
    { value: 'very dim', label: 'Very Dim', range: [10, 25] },
    { value: 'custom', label: 'Custom', range: [] },

];

const saturationOptions = [
    { value: 'all', label: 'All Saturation', range: [0, 100] },
    { value: 'very saturated', label: 'Very Saturated', range: [75, 100] },
    { value: 'saturated', label: 'Saturated', range: [50, 75] },
    { value: 'less saturated', label: 'Less Saturated', range: [25, 50] },
    { value: 'desaturated', label: 'Desaturated', range: [0, 25] },
    { value: 'custom', label: 'Custom', range: [] },
];

function generateRandomColor(h_range, s_range, v_range) {
    // allow wrapping
    const h = getRandomInt(h_range[0], h_range[1]) % 361;
    const s = getRandomInt(s_range[0], s_range[1]) % 101;
    const v = getRandomInt(v_range[0], v_range[1]) % 101;

    return { h, s, v };
}

const ColorTest = ({ selectedColor, targetColor, setTargetColor }) => {
    const [hSelected, setHSelected] = useState('all');
    const [sSelected, setSSelected] = useState('all');
    const [vSelected, setVSelected] = useState('all');
    const [showResult, setShowResult] = useState(false);

    const [hRange, setHRange] = useState([0, 360]);
    const [sRange, setSRange] = useState([0, 100]);
    const [vRange, setVRange] = useState([0, 100]);

    const startTest = () => {
        const newTargetColor = generateRandomColor(hRange, sRange, vRange);
        setTargetColor(newTargetColor);
        setShowResult(false);
    };

    const checkResult = () => {
        if (!showResult) {
            addHistory(targetColor, selectedColor);
        }
        setShowResult(true);
    };

    const getAccuracy = () => {
        if (!targetColor) return { hue: 'N/A', saturation: 'N/A', value: 'N/A' };

        const hue_diff = Math.abs(targetColor.h - selectedColor.h);
        const sat_diff = Math.abs(targetColor.s - selectedColor.s);
        const val_diff = Math.abs(targetColor.v - selectedColor.v);

        const hueAccuracy = hue_diff <= 5 || hue_diff >= 355;
        const satAccuracy = sat_diff <= 5;
        const valAccuracy = val_diff <= 5;

        return {
            hue: hueAccuracy ? 'correct' : selectedColor.h < targetColor.h ? 'low' : 'high',
            saturation: satAccuracy ? 'correct' : selectedColor.s < targetColor.s ? 'low' : 'high',
            value: valAccuracy ? 'correct' : selectedColor.v < targetColor.v ? 'low' : 'high',
            hue_diff, sat_diff, val_diff

        };
    };
    return (
        <div>
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Color Test</h3>

                <div className='flex flex-col gap-4 mb-4'>

                    <div className='flex gap-4 items-center  justify-between'>
                        <RangeSelection current={hSelected} setCurrent={setHSelected} setRange={setHRange} options={colorOptions} label={'H'} />
                        <CustomRangeSelector range={hRange} setCustomRange={setHRange} min={0} max={720} onChange={() => setHSelected('custom')} />
                    </div>


                    <div className='flex gap-4 items-center justify-between'>
                        <RangeSelection current={vSelected} setCurrent={setVSelected} setRange={setVRange} options={brightnessOptions} label={'L'} />
                        <CustomRangeSelector range={vRange} setCustomRange={setVRange} min={0} max={200} onChange={() => setVSelected('custom')} />
                    </div>

                    <div className='flex gap-4 items-center justify-between'>
                        <RangeSelection current={sSelected} setCurrent={setSSelected} setRange={setSRange} options={saturationOptions} label={'S'} />
                        <CustomRangeSelector range={sRange} setCustomRange={setSRange} min={0} max={200} onChange={() => setSSelected('custom')} />
                    </div>
                </div>
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

            {showResult && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Result</h3>
                    {(() => {
                        const accuracy = getAccuracy();
                        return (
                            <div>
                                <RenderResult type='Hue' result={accuracy.hue} difference={accuracy.hue_diff} />
                                <RenderResult type='Saturation' result={accuracy.saturation} difference={accuracy.sat_diff} />
                                <RenderResult type='Value' result={accuracy.value} difference={accuracy.val_diff} />
                            </div>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}

const RangeSelection = ({ current, setCurrent, setRange, options, label }) => {
    return (
        <div className="flex items-center space-x-4">
            <label className="font-medium">{label}:</label>
            <select
                value={current}
                onChange={(e) => {
                    setCurrent(e.target.value);
                    if (e.target.value === 'custom') return
                    setRange(options.find((option) => option.value === e.target.value).range)
                }}
                className="border rounded px-2 py-1"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>)
}

const CustomRangeSelector = ({ onChange, range, setCustomRange, min, max }) => {
    const handleRangeChange = (index, newValue) => {
        const updatedRange = [...range];
        updatedRange[index] = Number(newValue);
        setCustomRange(updatedRange);
        onChange();
    };

    return (
        <div>
            <input
                type="number"
                value={range[0]}
                onChange={(e) => { handleRangeChange(0, e.target.value); }}
                min={min}
                max={max}
            />
            <input
                type="number"
                value={range[1]}
                onChange={(e) => handleRangeChange(1, e.target.value)}
                min={min}
                max={max}
            />
        </div>
    );
};


const RenderResult = ({ type, result, difference }) => {
    return (<div className="space-y-2">
        <div className='flex space-x-2'>
            <span className="font-semibold">{type}:</span>
            <RenderResultIcon result={result} />
        </div>
        <p className="text-sm">Differnece {difference}</p>
    </div>)
}

const RenderResultIcon = ({ result }) => {
    switch (result) {
        case 'correct':
            return <FaCheck className="text-green-500" />;
        case 'high':
            return <FaArrowUp />;
        case 'low':
            return <FaArrowDown />;
        default:
            return null;
    }
};

export default ColorTest;