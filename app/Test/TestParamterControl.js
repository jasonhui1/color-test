import React from 'react';
import { SelectBox } from '../General/SelectBox';

const allDifficulties = [
    { value: 'easy', label: 'Easy', step: 20 },
    { value: 'normal', label: 'Normal', step: 10 },
    { value: 'hard', label: 'Hard', step: 5 },
];


const colorOptions = [
    { value: 'all', label: 'All Colors', range: [0, 360] },
    { value: 'red', label: 'Red', range: [330, 15] },
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


const TestControls = ({ difficulties, setDifficulties, hSelected, setHSelected, setHRange, hRange, sSelected, setSSelected, setSRange, sRange, lSelected, setLSelected, setLRange, lRange, mode, }) => {
    const onChangeDifficulty = (e) => {
        setDifficulties(e.target.value);
    };

    return (
        <div className="mt-6">
            <div className='flex justify-between'>
                <h3 className="text-lg font-semibold mb-2">Color Test</h3>
                <SelectBox current={difficulties} onChange={onChangeDifficulty} options={allDifficulties} label={'Difficulty'} />
            </div>

            <RangeSelect hSelected={hSelected} setHSelected={setHSelected} setHRange={setHRange} hRange={hRange}
                sSelected={sSelected} setSSelected={setSSelected} setSRange={setSRange} sRange={sRange}
                lSelected={lSelected} setLSelected={setLSelected} setLRange={setLRange} lRange={lRange}
                mode={mode}
            />

        </div>
    );
};


const RangeSelect = ({
    hSelected, setHSelected, hRange, setHRange,
    sSelected, setSSelected, sRange, setSRange,
    lSelected, setLSelected, lRange, setLRange,
    mode }) => {

    function onChange(setCurrent, setRange, options) {
        return function (e) {
            const value = e.target.value
            setCurrent(value);
            if (value === 'custom') return
            setRange(options.find((option) => option.value === value).range)
        }

    }

    return (

        <div className='flex flex-col gap-4 my-4'>
            {
                mode !== 'bw' &&
                <div className='flex gap-4 items-center  justify-between'>
                    <SelectBox current={hSelected} onChange={onChange(setHSelected, setHRange, colorOptions)} options={colorOptions} label={'H'} />
                    <CustomRangeSelector range={hRange} setCustomRange={setHRange} min={0} max={720} onChange={() => setHSelected('custom')} />
                </div>
            }


            <div className='flex gap-4 items-center justify-between'>
                <SelectBox current={lSelected} onChange={onChange(setLSelected, setLRange, brightnessOptions)} options={brightnessOptions} label={'L'} />
                <CustomRangeSelector range={lRange} setCustomRange={setLRange} min={0} max={200} onChange={() => setLSelected('custom')} />
            </div>

            {
                mode !== 'bw' &&
                <div className='flex gap-4 items-center justify-between'>
                    <SelectBox current={sSelected} onChange={onChange(setSSelected, setSRange, saturationOptions)} options={saturationOptions} label={'S'} />
                    <CustomRangeSelector range={sRange} setCustomRange={setSRange} min={0} max={200} onChange={() => setSSelected('custom')} />
                </div>
            }
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


export default TestControls;