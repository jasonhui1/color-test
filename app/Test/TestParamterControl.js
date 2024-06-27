import React, { useEffect, useState } from 'react';
import { SelectBox } from '../General/SelectBox';
import { allDifficulties, brightnessOptions, colorOptions, saturationOptions } from './parameters';
import { getTests } from '../Storage/test_parameters';

const TestControls = ({ difficulties, setDifficulties, setHRange, hRange, setSRange, sRange, setLRange, lRange, mode, }) => {


    //Create New Test
    //Select from existing tests
    const [creatingTest, setCreatingTest] = useState(false);
    const [createdTests, setCreatedTests] = useState([]);
    const [testId, setTestId] = useState(0);

    useEffect(() => {
        setCreatedTests(getTests())

    }, [])

    const onSelectTest = (e) => {
        // setTestId();
        const index = createdTests.findIndex(test => test.id === testId);
        setHRange(createdTests[index].hRange);
        setSRange(createdTests[index].sRange);
        setLRange(createdTests[index].lRange);
    }



    const onChangeDifficulty = (e) => {
        setDifficulties(e.target.value);
    };


    return (
        <div className="mt-6">
            <div className='flex justify-between'>
                <h3 className="text-lg font-semibold mb-2">Color Test</h3>
                <SelectBox current={difficulties} onChange={onChangeDifficulty} options={allDifficulties} label={'Difficulty'} />
            </div>

            {creatingTest && <RangeSelect setHRange={setHRange} hRange={hRange}
                setSRange={setSRange} sRange={sRange}
                setLRange={setLRange} lRange={lRange}
                mode={mode}
            />}

            {!creatingTest && <RangeDisplay hRange={hRange} sRange={sRange} lRange={lRange} mode={mode} />}

        </div>
    );
};

const CreateNewTestButton = ({ onClick, }) => {
    return (
        <></>
    )
}

const RangeDisplay = ({ hRange, sRange, lRange, mode }) => {

    return (
        <div className='flex flex-col gap-4 my-4'>
            {mode !== 'bw' &&
                <label className="font-medium">H: {`${hRange[0]} - ${hRange[1]}`}</label>
            }
            <label className="font-medium">L: {`${lRange[0]} - ${lRange[1]}`}</label>

            {mode !== 'bw' &&
                <label className="font-medium">S: {`${lRange[0]} - ${sRange[1]}`}</label>
            }
        </div>)
}


const RangeSelect = ({
    hRange, setHRange,
    sRange, setSRange,
    lRange, setLRange,
    mode }) => {


    const [hSelected, setHSelected] = useState('all');
    const [sSelected, setSSelected] = useState('all');
    const [lSelected, setLSelected] = useState('all');
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