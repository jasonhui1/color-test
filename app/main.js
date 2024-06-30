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
import { SettingProvider, useSettings } from './Context/setting';

const ColorTrainingTool = () => {
    const [selectedColor, setSelectedColor] = useState({ h: 40, s: 100, l: 50 });

    return (
        <div>
            <div className='flex flex-col justify-center items-center'>
                <div className="mx-auto p-4  flex flex-row items-center">
                    <div className='flex gap-4'>
                        <SettingProvider >
                            <Test selectedColor={selectedColor} />
                        </SettingProvider>
                        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                    </div>
                </div>
                <DisplayColorRange hue={selectedColor.h} step={20} />
            </div>
            {/* <ColorHistoryTable history={getHistory()} mode='bw' difficulty='easy'/> */}
            {/* <Evaluation history={getHistory()} mode={'normal'} difficulty={'easy'} /> */}

        </div>

    );
}

const Test = ({ selectedColor }) => {
    const { practicing, setPracticing, setSaveToHistory } = useSettings();

    return (
        <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md">

            <div className='flex items-center justify-end gap-4'>
                <CheckBox checked={practicing} onChange={(e) => { setPracticing(!practicing); setSaveToHistory(practicing) }} label={'Practice'} />
            </div>
            <ColorTest selectedColor={selectedColor} />
        </div>
    )
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