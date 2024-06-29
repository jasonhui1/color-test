import { useState } from "react";
import { SelectBox } from "../../General/SelectBox";
import { brightnessOptions, colorOptions, saturationOptions } from "../Paramaters/parameters";

const TestCreate = ({ createTest }) => {
    const [hRange, setHRange] = useState([0, 360]);
    const [lRange, setLRange] = useState([0, 100]);
    const [sRange, setSRange] = useState([0, 100]);
    const [name, setName] = useState('New Test');

    return (
        <div className='flex flex-col gap-4'>
            <div>
                <label>Test Name: </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <RangeSelect setHRange={setHRange} hRange={hRange}
                setSRange={setSRange} sRange={sRange}
                setLRange={setLRange} lRange={lRange}
            />
            <div className='flex justify-end'>

                <CreateNewTestButton onClick={() => createTest(hRange, lRange, sRange, name)} />
            </div>
        </div>
    )
}

const CreateNewTestButton = ({ onClick, }) => {
    return (
        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={onClick}>
            Create
        </button>
    )
}

const RangeSelect = ({
    hRange, setHRange,
    sRange, setSRange,
    lRange, setLRange,
}) => {

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
            <div className='flex gap-4 items-center  justify-between'>
                <SelectBox current={hSelected} onChange={onChange(setHSelected, setHRange, colorOptions)} options={colorOptions} label={'H'} />
                <CustomRangeSelector range={hRange} setCustomRange={setHRange} min={0} max={360} onChange={() => setHSelected('custom')} />
            </div>

            <div className='flex gap-4 items-center justify-between'>
                <SelectBox current={lSelected} onChange={onChange(setLSelected, setLRange, brightnessOptions)} options={brightnessOptions} label={'L'} />
                <CustomRangeSelector range={lRange} setCustomRange={setLRange} min={0} max={100} onChange={() => setLSelected('custom')} />
            </div>

            <div className='flex gap-4 items-center justify-between'>
                <SelectBox current={sSelected} onChange={onChange(setSSelected, setSRange, saturationOptions)} options={saturationOptions} label={'S'} />
                <CustomRangeSelector range={sRange} setCustomRange={setSRange} min={0} max={100} onChange={() => setSSelected('custom')} />
            </div>
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

export default TestCreate;