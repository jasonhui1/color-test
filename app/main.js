import React, { useState, useCallback } from 'react';
import { ColorPicker } from '../Components/Color Picker/ColorPicker';
import ColorTest from '../Components/Test/test';
import CheckBox from '../Components/General/CheckBox';
import { SettingProvider, useSettings } from '../Contexts/setting';
import GoogleLogin from '../Components/General/GoogleLogin';
import supabase from '../Storage/supabase_client';
import DisplayColorRange from '../Components/Practice/DisplayColorRange';
import DisplayContrasts from '../Components/Practice/DisplayContrast';


const ColorTrainingTool = () => {
    const [selectedColor, setSelectedColor] = useState({ h: 30, s: 100, l: 50 });

    return (
        <div>
            <div className='flex flex-col justify-center items-center '>
                {!supabase && <div className='flex justify-start w-full p-3'>

                    <GoogleLogin />
                </div>}
                <div className="p-4  flex flex-row items-center">
                    <div className='flex gap-4'>
                        <SettingProvider >
                            <Test selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                        </SettingProvider>
                        <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
                    </div>
                </div>

            </div>
            {/* <ColorHistoryTable history={getHistory()} mode='bw' difficulty='easy'/> */}
            {/* <Evaluation history={getHistory()} mode={'normal'} difficulty={'easy'} /> */}

        </div>

    );
}

const Test = ({ selectedColor, setSelectedColor }) => {
    const { practicing, setPracticing, saveToHistory ,setSaveToHistory } = useSettings();

    return (
        <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md min-w">

            <div className='flex items-center justify-end gap-4'>
                <div className='flex flex-row gap-4'>
                    <CheckBox checked={saveToHistory} onChange={(e) => {setSaveToHistory(!practicing?!saveToHistory:false) }} label={'Save to history'} />
                    <CheckBox checked={practicing} onChange={(e) => { setPracticing(!practicing); setSaveToHistory(false) }} label={'Practice'} />
                </div>
            </div>
            <ColorTest selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        </div>
    )
}

export default ColorTrainingTool;