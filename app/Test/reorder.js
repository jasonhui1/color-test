
import { Reorder } from "framer-motion"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

function generateList(step = 20, length = 4) {
    const rangeList = [];
    for (let i = 0; i <= 100; i += step) {
        rangeList.push({ id: uuidv4(), h: 0, s: 0, l: i })
    }

    const j = Math.floor((rangeList.length - length - 1) * Math.random())
    const targetList = rangeList.slice(j, j + length)

    const guessList = targetList
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return { target: targetList.reverse(), guess: guessList };
}

function ReorderList({ guessList, setGuessList }) {

    return (
        <Reorder.Group axis="x" values={guessList} onReorder={setGuessList}>
            <div className="flex flex-row gap-2">
                {guessList.map((item) => (
                    <Reorder.Item key={item.id} value={item}>
                        <div
                            className="w-24 h-24 border border-gray-300"
                            style={{ backgroundColor: `hsl(${item.h}, ${item.s}%, ${item.l}%)` }}
                        ></div>
                    </Reorder.Item>
                ))}
            </div>
        </Reorder.Group>
    )
}



const OrderTest = () => {

    const [targetList, setTargetList] = useState([])
    const [guessList, setGuessList] = useState([])
    const [checkedResult, setCheckedResult] = useState(false)

    const setList = () => {

        setCheckedResult(false)
        const { target, guess } = generateList(10)

        setTargetList(target)
        setGuessList(guess)
    }

    const checkResult = () => {

        for (let i = 0; i < targetList.length; i++) {
            if (targetList[i].l !== guessList[i].l) {
                return false
            }
        }
        return true
    }



    return (
        <div>
            <ReorderList guessList={guessList} setGuessList={setGuessList} />
            {checkedResult && <p>{checkResult().toString()}</p>}
            <button
                onClick={setList}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
            >
                Generate List
            </button>
            <button
                onClick={() => setCheckedResult(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={checkedResult}
            >
                Check Result
            </button>
        </div>
    )
}

const ProgressiveTest  = () => {
}


export default OrderTest;
