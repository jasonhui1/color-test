'use client'
import { useEffect, useState } from "react"
import Evaluation from "../../Components/Evaluation/Evaluation";
import { SelectBox } from "../../Components/General/SelectBox";
import { all_modes } from "../../Components/Test/Parameters/parameters";
import CheckBox from "../../Components/General/CheckBox";
import { useFetchTests } from "../../Storage/hooks/useFetchTest";
import { useFetchHistory } from "../../Storage/hooks/useFetchTestHistory";
import { useUserId } from "../../Hooks/useUserId";

export default function Page() {
  const [testId, setTestId] = useState('0');
  const [mode, setMode] = useState('normal');
  const [useHeatmap, setUseHeatmap] = useState(false);

  const { userId } = useUserId()
  const { createdTests, loading: createdTestsLoading, error: createdTestsError } = useFetchTests(userId);
  const { history, loading: historyLoading, error: historyError } = useFetchHistory(testId, mode);

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
      <div className="flex flex-row gap-5 my-2">
        <SelectBox current={mode} onChange={setMode} options={all_modes} label={'Mode'} />
        <CheckBox checked={useHeatmap} onChange={() => setUseHeatmap(!useHeatmap)} label={'Heatmap'} />
      </div>
      <label>Length: {history.length}</label>
      {testSelected && <Evaluation history={history} mode={mode} useHeatmap={useHeatmap} />}
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

