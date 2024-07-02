import React, { useState, useCallback } from 'react';
import { ColorPicker } from '../Components/Color Picker/ColorPicker';
import ColorTest from '../Components/Test/test';
import ColorSwatch from '../Components/Color Picker/ColorSwatch';
import CheckBox from './General/CheckBox';
import { SelectBox } from './General/SelectBox';
import { SettingProvider, useSettings } from '../Contexts/setting';
import GoogleLogin from '../Components/General/GoogleLogin';
import supabase from '../Storage/supabase_client';


const ColorTrainingTool = () => {
    const [selectedColor, setSelectedColor] = useState({ h: 30, s: 100, l: 50 });

    // console.log('supabase.getSession() :>> ', await supabase.auth.getSession().session);
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
                <DisplayColorRange hue={selectedColor.h} step={20} />
            </div>
            {/* <ColorHistoryTable history={getHistory()} mode='bw' difficulty='easy'/> */}
            {/* <Evaluation history={getHistory()} mode={'normal'} difficulty={'easy'} /> */}

        </div>

    );
}

const Test = ({ selectedColor, setSelectedColor }) => {
    const { practicing, setPracticing, setSaveToHistory } = useSettings();

    return (
        <div className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md min-w">

            <div className='flex items-center justify-end gap-4'>
                <CheckBox checked={practicing} onChange={(e) => { setPracticing(!practicing); setSaveToHistory(practicing) }} label={'Practice'} />
            </div>
            <ColorTest selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        </div>
    )
}

const DisplayColorRange = ({ hue, step = 20 }) => {
    // const { practicing } = useSettings();
    const practicing = true;

    const rangeArray = [];
    for (let i = 0; i <= 100; i += step) {
        rangeArray.push(i);
    }

    const rangeArray10 = [];
    for (let i = 0; i <= 100; i += 10) {
        rangeArray10.push(i);
    }

    return (
        <>
            {practicing &&
                <>
                    <div className='flex flex-row gap-2'>
                        {rangeArray10.toReversed().map((l, index) => (
                            <ColorSwatch key={index} color={{ h: hue, s: 0, l }} size={1} />
                        )
                        )}
                    </div>
                    <div className='flex flex-col gap-2' >

                        {
                            rangeArray.toReversed().map((l, index) => {
                                return (
                                    <div className='flex flex-row gap-2' key={index}>
                                        {rangeArray.map((s, j) => {

                                            return (
                                                <ColorSwatch key={j} color={{ h: hue, s, l }} size={1} />
                                            )
                                        })}
                                    </div>
                                )
                            })
                        }
                    </div>
                </>
            }
        </>

    )
}


export default ColorTrainingTool;