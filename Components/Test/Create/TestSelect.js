import React, { useEffect, useState } from 'react';
import { SelectBox } from '../../General/SelectBox';
import { allDifficulties, all_modes, all_testNum, all_test_methods } from '../Parameters/parameters';
import TestCreate from './TestCreate';
import { useSettings } from '../../../Contexts/setting';
import { useFetchTests } from '../../../Storage/hooks/useFetchTest';
import { useUserId } from '../../../Hooks/useUserId';
import { createTest } from '../../../lib/supabase/testParams';
import { useCreateTests } from '../../../Storage/hooks/useCreateTest';

const TestSelect = ({ setHRange, setSRange, setLRange, testSelected, setTestId }) => {

    //Create New Test
    //Select from existing tests
    const [creatingTest, setCreatingTest] = useState(false);
    const { userId } = useUserId();
    const { createdTests } = useFetchTests(userId)
    const { createTest: createTestDB, loading, error } = useCreateTests()

    const { difficulty, setDifficulty, mode, setMode, testNum, setTestNum, testMethod, setTestMethod } = useSettings();

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
        const id = await createTestDB({ hRange, lRange, sRange, name });
        updatePara({ id, hRange, sRange, lRange });
        setCreatingTest(false);
    }

    // const editName = (newName) => {
    //     const 
    // }

    const inSelect = !creatingTest && !testSelected
    // const name = testSelected ? createdTests.find(test => test.id === testId).name : 'N/A'

    return (
        <div className="mt-6">
            <h3 className="text-3xl font-bold mb-6 text-blue-600 text-center">Color Test</h3>
            {inSelect &&
                <div>
                    <TestsDisplay tests={createdTests} onSelect={onSelectTest} />
                    <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={() => setCreatingTest(true)}>Create New Test </button>

                </div>
            }

            {testSelected &&
                <div className='flex gap-4 flex-col'>
                    <>
                        <SelectBox current={difficulty} onChange={setDifficulty} options={allDifficulties} label={'Difficulty'} />
                        <SelectBox current={mode} onChange={setMode} options={all_modes} label={'Mode'} />
                        <SelectBox current={testNum} onChange={setTestNum} options={all_testNum} label={'TestNum'} />
                        <SelectBox current={testMethod} onChange={setTestMethod} options={all_test_methods} label={'TestNum'} />
                    </>
                </div>
            }

            {creatingTest && <TestCreate createTest={createTest} />}
        </div>
    );
};

const TestsDisplay = ({ tests, onSelect }) => {
    console.log('tests :>> ', tests);
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