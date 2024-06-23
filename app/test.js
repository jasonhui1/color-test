import React, { useEffect, useState } from 'react';
import { TriangularColorPicker } from './ColorPicker';

const ColorTrainingTool = () => {
    const [selectedColor, setSelectedColor] = useState({ h: 40, s: 100, v: 100 });
    const backgroundColor = `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.v}%)`;

    return (
        <div className="max-w-lg mx-auto p-4">
            <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md">
                <h2 className="mt-0 mb-4 text-xl font-bold">Color Training Tool for Anime Illustration</h2>
                <div
                    className="w-full h-40 mb-4 rounded border-4 border-slate-300"
                    style={{ backgroundColor }}
                ></div>
                <TriangularColorPicker size={300} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

                <div>
                    <div className="mb-4">
                        <label className="block mb-2">Hue: {selectedColor.h}°</label>
                        <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={selectedColor.h}
                            onChange={(e) => setSelectedColor({ ...selectedColor, h: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Saturation: {selectedColor.s}%</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={selectedColor.s}
                            onChange={(e) => setSelectedColor({ ...selectedColor, s: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Brightness: {selectedColor.v}%</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={selectedColor.v}
                            onChange={(e) => setSelectedColor({ ...selectedColor, v: Number(e.target.value) })}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>
            {/* <SquareColorPicker size={300} setSelectedColor={setSelectedColor} /> */ }
        </div>



    );
};


export default ColorTrainingTool;