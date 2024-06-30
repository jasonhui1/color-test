import React, { useEffect, useState } from 'react';
import { SelectBox } from '../../General/SelectBox';
import { allDifficulties, all_modes, all_testNum } from './parameters';
import { addNewTest, getTests } from '../../Storage/test_parameters';
import TestCreate from '../Create/TestCreate';
import { FaEdit } from "react-icons/fa";
import { generateId } from '../../General/utils';
import { useSettings } from '../../Context/setting';
const TestControls = ({ setHRange, setSRange, setLRange, testId, setTestId }) => {

    //Create New Test
    //Select from existing tests
    const [creatingTest, setCreatingTest] = useState(false);
    const [createdTests, setCreatedTests] = useState([]);

    const { difficulties, setDifficulties, mode, setMode, testNum, setTestNum } = useSettings();

    useEffect(() => {
        //Newest show first
        setCreatedTests(getTests()?.toReversed())

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
        const id = generateId()
        addNewTest(id, hRange, lRange, sRange, name);
        updatePara({ id, hRange, sRange, lRange })
        setCreatingTest(false);
        // setCreatedTests([{ id, hRange, sRange, lRange, name }, ...createdTests])
    }

    // const editName = (newName) => {
    //     const 

    // }

    const testSelected = testId !== '0'
    const inInitial = !creatingTest && !testSelected
    // const name = testSelected ? createdTests.find(test => test.id === testId).name : 'N/A'

    return (
        <div className="mt-6">
            <div className='flex flex-col justify-between'>
                <h3 className="text-lg font-semibold mb-2">Color Test</h3>
                <div className='flex gap-4 flex-row'>
                    {testSelected && <SelectBox current={difficulties} onChange={setDifficulties} options={allDifficulties} label={'Difficulty'} />}
                    {testSelected && <SelectBox current={mode} onChange={setMode} options={all_modes} label={'Mode'} />}
                    {testSelected && <SelectBox current={testNum} onChange={setTestNum} options={all_testNum} label={'TestNum'} />}
                </div>
            </div>

            {inInitial &&
                <div>
                    <TestsSelect tests={createdTests} onSelect={onSelectTest} />
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => setCreatingTest(true)}>Create New Test </button>
               
                </div>
            }

            {creatingTest && <TestCreate createTest={createTest} />}
        </div>
    );
};

const TestsSelect = ({ tests, onSelect }) => {
    return (
        <ul>
            {tests?.map((test, index) =>
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



export default TestControls;