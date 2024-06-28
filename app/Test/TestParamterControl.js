import React, { useEffect, useState } from 'react';
import { SelectBox } from '../General/SelectBox';
import { allDifficulties } from './parameters';
import { addNewTest, getTests } from '../Storage/test_parameters';
import { v4 as uuidv4 } from 'uuid';
import TestCreate from './Create/TestCreate';

const TestControls = ({ difficulties, setDifficulties, setHRange, hRange, setSRange, sRange, setLRange, lRange, mode, }) => {


    //Create New Test
    //Select from existing tests
    const [creatingTest, setCreatingTest] = useState(false);
    const [createdTests, setCreatedTests] = useState([]);
    const [testId, setTestId] = useState('0');

    useEffect(() => {
        //Newest show first
        setCreatedTests(getTests().toReversed())

    }, [])

    const updatePara = (test) => {
        setTestId(test.id)
        setHRange(test.hRange);
        setSRange(test.sRange);
        setLRange(test.lRange);
    }

    const onSelectTest = (testId) => {
        // setTestId();
        const index = createdTests.findIndex(test => test.id === testId);
        const test = createdTests[index]
        updatePara(test)
    }

    const createTest = (hRange, lRange, sRange, name) => {
        const id = uuidv4()
        addNewTest(id, hRange, lRange, sRange, name);
        updatePara({ id, hRange, sRange, lRange })
        setCreatingTest(false);
    }

    const onChangeDifficulty = (e) => {
        setDifficulties(e.target.value);
    };

    const testSelected = testId !== '0'
    const inInitial = !creatingTest && !testSelected

    return (
        <div className="mt-6">
            <div className='flex justify-between'>
                <h3 className="text-lg font-semibold mb-2">Color Test</h3>
                <SelectBox current={difficulties} onChange={onChangeDifficulty} options={allDifficulties} label={'Difficulty'} />
            </div>

            {inInitial &&
                <div>
                    <TestsSelect tests={createdTests} onSelect={onSelectTest} />
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setCreatingTest(true)}>Create New Test </button>
                </div>
            }

            {testSelected && <TestParameterDisplay hRange={hRange} sRange={sRange} lRange={lRange} mode={mode} />}
            {creatingTest && <TestCreate createTest={createTest} />}
        </div>
    );
};

const TestsSelect = ({ tests, onSelect }) => {
    return (
        <ul>
            {tests.map((test, index) =>
                <TestDisplay key={index} test={test} onSelect={() => onSelect(test.id)} />)
            }
        </ul>
    )
}


const TestDisplay = ({ test, onSelect }) => {
    const { id, hRange, sRange, lRange, mode, name } = test
    return (
        <li onClick={onSelect}>
            <div className='flex flex-row gap-2 px-4 py-2 hover:bg-gray-200 hover:cursor-pointer'>
                <span>{name}</span>
            </div>
        </li>
    )
}


const TestParameterDisplay = ({ hRange, sRange, lRange, mode }) => {

    return (
        <div className='flex flex-col gap-4 my-4'>
            {mode !== 'bw' &&
                <label className="font-medium">H: {`${hRange[0]} - ${hRange[1]}`}</label>
            }
            <label className="font-medium">L: {`${lRange[0]} - ${lRange[1]}`}</label>

            {mode !== 'bw' &&
                <label className="font-medium">S: {`${sRange[0]} - ${sRange[1]}`}</label>
            }
        </div>)
}


export default TestControls;