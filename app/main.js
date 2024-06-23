import React, { useState, useCallback } from 'react';
import { ColorPicker, TriangularColorPicker } from './ColorPicker';
import { FaCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import ColorTest from './test';

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

const ColorTrainingTool = () => {
    const [selectedColor, setSelectedColor] = useState({ h: 40, s: 100, v: 100 });
    const [targetColor, setTargetColor] = useState(null);

    const backgroundColor = `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.v}%)`;
    return (
        <div className="max-w-3xl mx-auto p-4 h-lvh flex flex-row items-center">
            <div className='flex gap-4'>
                <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md">

                    <div className="flex space-x-4 mb-4">
                        <div className="w-1/2">
                            <h3 className="text-lg font-semibold mb-2">Your Color</h3>
                            <div
                                className="w-full h-40 rounded border-4 border-slate-300"
                                style={{ backgroundColor }}
                            ></div>
                        </div>
                        <div className="w-1/2">
                            <h3 className="text-lg font-semibold mb-2">Target Color</h3>
                            <div
                                className="w-full h-40 rounded border-4 border-slate-300"
                                style={{ backgroundColor: targetColor ? `hsl(${targetColor.h}, ${targetColor.s}%, ${targetColor.v}%)` : 'white' }}
                            ></div>
                        </div>
                    </div>
                    <ColorTest selectedColor={selectedColor} targetColor={targetColor} setTargetColor={setTargetColor}/>
                </div>
                <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
            </div>
        </div>

    );
}

export default ColorTrainingTool;