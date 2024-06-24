import React, { useState, useCallback } from 'react';
import { FaCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { addHistory } from './Storage/test_history';

const colorOptions = [
    { value: 'all', label: 'All Colors', range: [0, 360] },
    { value: 'red', label: 'Red', range: [[0, 15], [330, 360]] },
    { value: 'orange', label: 'Orange', range: [15, 45] },
    { value: 'yellow', label: 'Yellow', range: [45, 75] },
    { value: 'green', label: 'Green', range: [75, 150] },
    { value: 'cyan', label: 'Cyan', range: [150, 210] },
    { value: 'blue', label: 'Blue', range: [210, 240] },
    { value: 'indigo', label: 'Indigo', range: [240, 270] },
    { value: 'purple', label: 'Purple', range: [270, 330] },
];

const ColorTest = ({ selectedColor, targetColor, setTargetColor }) => {
    const [colorRange, setColorRange] = useState('all');
    const [showResult, setShowResult] = useState(false);

    const generateRandomColor = useCallback(() => {
        let h, s, v;

        const selectedColor = colorOptions.find(option => option.value === colorRange);

        if (Array.isArray(selectedColor.range[0])) {
            //red
            const randomIndex = Math.floor(Math.random() * selectedColor.range.length);
            const [start, end] = selectedColor.range[randomIndex];
            h = Math.floor(Math.random() * (end - start)) + start;
        } else {
            const [start, end] = selectedColor.range;
            h = Math.floor(Math.random() * (end - start)) + start;
        }

        s = Math.floor(Math.random() * 101); // Saturation between 0 and 100
        v = Math.floor(Math.random() * 90 + 5); // Value between 5 and 95
        // v = Math.floor(Math.random() * 101); // Value between 0 and 100

        return { h, s, v };
    }, [colorRange]);

    const startTest = () => {
        const newTargetColor = generateRandomColor();
        setTargetColor(newTargetColor);
        setShowResult(false);
    };

    const checkResult = () => {
        setShowResult(true);
        addHistory(targetColor, selectedColor);
    };

    const getAccuracy = () => {
        if (!targetColor) return { hue: 'N/A', saturation: 'N/A', value: 'N/A' };

        const hue_diff = Math.abs(targetColor.h - selectedColor.h);
        const sat_diff = Math.abs(targetColor.s - selectedColor.s);
        const val_diff = Math.abs(targetColor.v - selectedColor.v);

        const hueAccuracy = hue_diff <= 5 || hue_diff >= 355;
        const satAccuracy = sat_diff <= 3;
        const valAccuracy = val_diff <= 3;

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
                <div className="flex items-center space-x-4 mb-4">
                    <label className="font-medium">Color Range:</label>
                    <select
                        value={colorRange}
                        onChange={(e) => setColorRange(e.target.value)}
                        className="border rounded px-2 py-1"
                    >
                        {colorOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
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
    console.log('result :>> ', result);
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