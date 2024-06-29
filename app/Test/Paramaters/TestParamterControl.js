import React, { useEffect, useState } from 'react';
import { SelectBox } from '../../General/SelectBox';
import { allDifficulties } from './parameters';
import { addNewTest, getTests } from '../../Storage/test_parameters';
import TestCreate from '../Create/TestCreate';
import { FaEdit } from "react-icons/fa";
import { generateId } from '../../General/utils';
const TestControls = ({ difficulties, setDifficulties, setHRange, hRange, setSRange, sRange, setLRange, lRange, mode, testId, setTestId }) => {


    //Create New Test
    //Select from existing tests
    const [creatingTest, setCreatingTest] = useState(false);
    const [createdTests, setCreatedTests] = useState([]);

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
        const id = generateId()
        addNewTest(id, hRange, lRange, sRange, name);
        updatePara({ id, hRange, sRange, lRange })
        setCreatingTest(false);
        // setCreatedTests([{ id, hRange, sRange, lRange, name }, ...createdTests])
    }

    const onChangeDifficulty = (e) => {
        setDifficulties(e.target.value);
    };

    // const editName = (newName) => {
    //     const 

    // }

    const testSelected = testId !== '0'
    const inInitial = !creatingTest && !testSelected
    // const name = testSelected ? createdTests.find(test => test.id === testId).name : 'N/A'

    return (
        <div className="mt-6">
            <div className='flex justify-between'>
                <h3 className="text-lg font-semibold mb-2">Color Test</h3>
                {testSelected && <SelectBox current={difficulties} onChange={onChangeDifficulty} options={allDifficulties} label={'Difficulty'} />}
            </div>

            {inInitial &&
                <div>
                    <TestsSelect tests={createdTests} onSelect={onSelectTest} />
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => setCreatingTest(true)}>Create New Test </button>
                </div>
            }

            {testSelected && <TestParameterDisplay hRange={hRange} sRange={sRange} lRange={lRange} mode={mode} name={name} />}
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


const TestParameterDisplay = ({ hRange, sRange, lRange, mode, name }) => {

    return (
        <div className='flex flex-col gap-4 my-4'>

            {/* <div className='flex gap-2 flex-row items-center'>

                <label className="font-medium">{name} </label>
                <span><FaEdit className="w-5 h-5" /></span>
            </div> */}
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