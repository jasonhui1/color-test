
import { Reorder } from "framer-motion"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { CheckResultButton, NextButton } from "../test";

function generateList(step = 20, length = 4, extremeFirst = false, useSmallest = false) {
    const rangeList = [];
    for (let i = 0; i <= 100; i += step) {
        rangeList.push({ id: uuidv4(), h: 0, s: 0, l: i })
    }

    // Pick a random consecutive range
    const j = Math.floor((rangeList.length - length - 1) * Math.random())
    const targetList = rangeList.slice(j, j + length)

    let guessList = [...targetList];
    if (extremeFirst) {
        guessList.sort((a, b) => useSmallest ? a.l - b.l : b.l - a.l);
        for (let i = guessList.length - 1; i > 0; i--) {
            const j = 1 + Math.floor(Math.random() * i);
            [guessList[i], guessList[j]] = [guessList[j], guessList[i]];
        }
    } else {
        guessList.sort(() => Math.random() - 0.5);
    }

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



const OrderTest = ({ length = 5 }) => {

    const [targetList, setTargetList] = useState([])
    const [guessList, setGuessList] = useState([])
    const [checkedResult, setCheckedResult] = useState(false)

    const setList = () => {

        setCheckedResult(false)
        const { target, guess } = generateList(10, length, true)

        setTargetList(target)
        setGuessList(guess)
    }

    const checkSortResult = () => {

        for (let i = 0; i < targetList.length; i++) {
            if (targetList[i].l !== guessList[i].l) {
                return false
            }
        }
        return true
    }

    return (
        <div>
            {/* <ReorderList guessList={guessList} setGuessList={setGuessList} /> */}
            {/* {checkedResult && <p>{checkSortResult().toString()}</p>} */}
            <ProgressiveTest guessList={guessList} startTest={setList} length={5} />
            {/* <button
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
            </button> */}
        </div>
    )
}

const ProgressiveTest = ({ guessList, startTest, length = 5 }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [guesses, setGuesses] = useState([])
    const [checkedResult, setCheckedResult] = useState(false)

    const setGuess = (value, index) => {
        setGuesses([...guesses.slice(0, index), value, ...guesses.slice(index + 1)])
    }

    const onNext = () => {
        if (!testStarted) {
            startTest()
            setGuesses(new Array(length).fill(0))
        }

        if (testEnded) {
            setCurrentIndex(0)
        } else {
            setCurrentIndex(currentIndex + 1)
        }
        setCheckedResult(false)
    }


    const checkProgressiveResult = () => {
        const answer = guessList.map(item => item.l - guessList[0].l)
        for (let i = 0; i < answer.length; i++) {
            if (Math.abs(answer[i]) !== Math.abs(guesses[i])) {
                console.log('object :>> ', Math.abs(answer[i]), Math.abs(guesses[i]));
                return false
            }
        }
        return true
    }

    const list = guessList.slice(0, currentIndex + 1)
    const testStarted = currentIndex > 0
    const testEnded = currentIndex === length - 1

    return (
        <div className="flex flex-col gap-2">
            {testStarted && <div className="flex flex-row gap-2">
                {list.map((item, index) => (
                    <div key={index}>
                        <div
                            className="w-24 h-24 border border-gray-300"
                            style={{ backgroundColor: `hsl(${item.h}, ${item.s}%, ${item.l}%)` }}
                        >
                        </div>

                        {<input type="number" value={guesses[index]} className="w-24" onChange={(e) => setGuess(Number(e.target.value), index)} />}

                    </div>
                ))}
            </div>
            }
            <div>

                {!(testEnded && !checkedResult) && <NextButton testStarted={testStarted} testEnded={testEnded} onClick={() => onNext()} />}
                {testEnded && <CheckResultButton onClick={() => setCheckedResult(true)} />}


                {checkedResult && testEnded && <label>{checkProgressiveResult().toString()}</label>}
            </div>
        </div>
    )




}


export default OrderTest;
