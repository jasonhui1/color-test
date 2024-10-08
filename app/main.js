import React, { useState, useCallback, useEffect } from 'react';
import { ColorPicker } from '../Components/Color Picker/ColorPicker';
import ColorTest from '../Components/Test/test';
import CheckBox from '../Components/General/CheckBox';
import { SettingProvider, useSettings } from '../Contexts/setting';
import GoogleLogin from '../Components/General/GoogleLogin';
import { useUserId } from '../Hooks/useUserId';

const ColorTrainingTool = () => {
    const [selectedColor, setSelectedColor] = useState({ h: 30, s: 100, l: 50 });
    const { userId } = useUserId();
    return (
        <div>
            <div className='flex flex-col justify-center items-center '>
                {<div className='flex justify-start w-full p-3'>

                    <GoogleLogin />
                </div>}
                <div className="p-4  flex flex-row items-center">
                    <div className='flex gap-4'>
                        <SettingProvider >
                            <Test selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                            <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                        </SettingProvider>
                    </div>
                </div>

            </div>
            {/* <ColorHistoryTable history={getHistory()} mode='bw' difficulty='easy'/> */}
            {/* <Evaluation history={getHistory()} mode={'normal'} difficulty={'easy'} /> */}

        </div>

    );
}

const Test = ({ selectedColor, setSelectedColor }) => {
    const { practicing, setPracticing, saveToHistory, setSaveToHistory, useColorWheel, toggleUseColorWheel } = useSettings();

    return (
        <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md min-w">

            <div className='flex items-center justify-end gap-4'>
                <div className='flex flex-row gap-4'>
                    {/* <CheckBox checked={useColorWheel} onChange={toggleUseColorWheel} label={'use Color Wheel'} /> */}
                    <CheckBox checked={saveToHistory} onChange={(e) => { setSaveToHistory(!practicing ? !saveToHistory : false) }} label={'Save to history'} />
                    <CheckBox checked={practicing} onChange={(e) => { setPracticing(!practicing); setSaveToHistory(false) }} label={'Practice'} />
                </div>
            </div>
            <ColorTest selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        </div>
    )
}

export default ColorTrainingTool;