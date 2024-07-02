'use client'
import { useEffect, useState } from "react"
import Evaluation from "../../Components/Evaluation/Evaluation";
import { SelectBox } from "../../Components/General/SelectBox";
import { all_modes } from "../../Components/Test/Parameters/parameters";
import { useFetchHistory, useFetchTests } from "../../Storage/useFetch";

export default function Page() {
  const createdTests = useFetchTests();
  const [testId, setTestId] = useState('0');
  const [mode, setMode] = useState('normal');
  const history = useFetchHistory(testId, mode);

  const onSelectTest = (testId) => {
    // setTestId();
    const index = createdTests.findIndex(test => test.id === testId);
    const test = createdTests[index]
    setTestId(test.id)
    // addHistorySB({ testId: 4, targetColor: { h: 0, s: 50, l: 50 }, selectedColor: { h: 0, s: 50, l: 45 }, mode: 'normal', difficulty: 'easy' })
  }

  const testSelected = testId !== '0'
  return (
    /** Your content */
    <div>

      <TestsSelect tests={createdTests} onSelect={onSelectTest} />
      <SelectBox current={mode} onChange={setMode} options={all_modes} label={'Mode'} />
      <label>Length: {history.length}</label>
      {testSelected && <Evaluation history={history} mode={mode} />}
    </div>
  )
}

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

