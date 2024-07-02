import React, { useState, useCallback } from 'react';
import TestControls from '../../app/Test/Paramaters/TestParamterControl';
import { RenderResult, ResultDisplay } from '../../app/Test/Result/ResultDisplay';
import Evaluation from '../../app/Test/Result/Evaluation';
import OrderTest from '../../app/Test/Types/reorder';
import { generateRandomColorAdvanced } from '../../app/General/color_util';
import { stepInDifficulty } from '../../app/General/utils';
import CompareTest from '../../app/Test/Types/compare';
import { useSettings } from '../../Contexts/setting';
import SingleTest from '../../app/Test/Types/single';
import { BackButton } from './TestBottom';

const ColorTest = ({ selectedColor, setSelectedColor }) => {

    const [hRange, setHRange] = useState([0, 360]);
    const [sRange, setSRange] = useState([0, 100]);
    const [lRange, setLRange] = useState([0, 100]);


    // do later
    const [testId, setTestId] = useState('0');
    const [testStarted, setTestStarted] = useState(false);
    const testSelected = testId !== '0';
    const confirming = testSelected && !testStarted;


    return (
        <div>
            <div className="mt-6 min-w-[300px] h-full">
                {!testStarted &&
                    <TestControls
                        setHRange={setHRange} setSRange={setSRange} setLRange={setLRange}
                        testId={testId} setTestId={setTestId}
                    />
                }

                <div>
                    {confirming &&
                        <>
                            <TestParameterDisplay hRange={hRange} sRange={sRange} lRange={lRange} name={name} />
                            <div className='flex flex-row justify-between'>
                                <BackButton onClick={() => setTestId('0')} />
                                <StartButton onClick={() => setTestStarted(true)} />
                            </div>
                        </>
                    }
                </div>

                {testStarted && <RenderTest hRange={hRange} sRange={sRange} lRange={lRange} selectedColor={selectedColor} testId={testId} setTestStarted={setTestStarted} setSelectedColor={setSelectedColor} />}

            </div>

            {/* {testEnded && <Evaluation history={test_history} mode={mode} difficulty={difficulty} />} */}
            {/* <OrderTest hRange={hRange} sRange={sRange} lRange={lRange} length={4} step={20} checkedResult={checkedResult} setCheckedResult={setCheckedResult}/> */}
            {/* <CompareTest hRange={hRange} sRange={sRange} lRange={lRange} step={stepInDifficulty(difficulty)} checkedResult={checkedResult} setCheckedResult={setCheckedResult} /> */}

        </div>
    );
}

const RenderTest = ({ hRange, sRange, lRange, selectedColor, testId, setTestStarted, setSelectedColor }) => {
    const { mode } = useSettings()

    return (
        <>

            {
                (mode === 'normal' || mode === 'bw') ?
                    <SingleTest hRange={hRange} sRange={sRange} lRange={lRange} selectedColor={selectedColor} testId={testId} setTestStarted={setTestStarted} setSelectedColor={setSelectedColor} /> :
                    <CompareTest hRange={hRange} sRange={sRange} lRange={lRange} selectedColor={selectedColor} testId={testId} setTestStarted={setTestStarted} setSelectedColor={setSelectedColor} />
            }
        </>
    )
}

const StartButton = ({ onClick }) => {

    return (
        <button
            onClick={onClick}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Start
        </button>
    )
}

const TestParameterDisplay = ({ hRange, sRange, lRange, name }) => {

    const { mode } = useSettings()

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


export default ColorTest;
