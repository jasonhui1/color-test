'use client'
import { useEffect, useState } from "react"
import { getTests } from "../Storage/test_parameters"
import Evaluation from "../Test/Result/Evaluation";
import { getHistory } from "../Storage/test_history";
import { SelectBox } from "../General/SelectBox";
import { all_modes } from "../Test/Paramaters/parameters";

export default function Page() {
  const [createdTests, setCreatedTests] = useState([]);
  const [testId, setTestId] = useState('0');
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState('normal');

  useEffect(() => {
    //Newest show first
    setCreatedTests(getTests().toReversed())

  }, [])

  useEffect(() => {
    //Newest show first
    setHistory(getHistory({ testId, mode }))
  }, [mode, testId])

  const onSelectTest = (testId) => {
    // setTestId();
    const index = createdTests.findIndex(test => test.id === testId);
    const test = createdTests[index]
    setTestId(test.id)
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

