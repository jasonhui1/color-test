import React, { useEffect, useState } from 'react';
import { SelectBox } from '../../General/SelectBox';
import { allDifficulties, all_modes, all_testNum, all_test_methods } from '../Parameters/parameters';
import TestCreate from './TestCreate';
import { useSettings } from '../../../Contexts/setting';
import { addTestSB } from '../../../Storage/test_parameters_sb';
import { useFetchTests } from '../../../Storage/useFetch';

const TestSelect = ({ setHRange, setSRange, setLRange, testId, setTestId }) => {

    //Create New Test
    //Select from existing tests
    const [creatingTest, setCreatingTest] = useState(false);
    const createdTests = useFetchTests()

    const { difficulty, setDifficulty, mode, setMode, testNum, setTestNum, testMethod, setTestMethod } = useSettings();
    const [loading, setLoading] = useState(false);

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

    const createTest = async (hRange, lRange, sRange, name) => {
        try {
            setLoading(true);

            const id = await addTestSB(hRange, lRange, sRange, name);
            updatePara({ id, hRange, sRange, lRange });
            setCreatingTest(false);
        } catch (error) {
            console.error("Failed to create test", error);
        } finally {
            setLoading(false);
        }
    }

    // const editName = (newName) => {
    //     const 

    // }

    const testSelected = testId !== '0'
    const inInitial = !creatingTest && !testSelected
    // const name = testSelected ? createdTests.find(test => test.id === testId).name : 'N/A'

    return (
        <div className="mt-6">
            <h3 className="text-3xl font-bold mb-6 text-blue-600 text-center">Color Test</h3>
            <div className='flex gap-4 flex-col'>
                {testSelected &&
                    <>
                        <SelectBox current={difficulty} onChange={setDifficulty} options={allDifficulties} label={'Difficulty'} />
                        <SelectBox current={mode} onChange={setMode} options={all_modes} label={'Mode'} />
                        <SelectBox current={testNum} onChange={setTestNum} options={all_testNum} label={'TestNum'} />
                        <SelectBox current={testMethod} onChange={setTestMethod} options={all_test_methods} label={'TestNum'} />
                    </>
                }
            </div>

            {inInitial &&
                <div>
                    <TestsDisplay tests={createdTests} onSelect={onSelectTest} />
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => setCreatingTest(true)}>Create New Test </button>

                </div>
            }

            {creatingTest && <TestCreate createTest={createTest} />}
        </div>
    );
};

const TestsDisplay = ({ tests, onSelect }) => {
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


export default TestSelect;