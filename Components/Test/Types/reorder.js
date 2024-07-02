
import { Reorder } from "framer-motion"
import { useState } from "react"
import { generateId, getRandomIntStep } from "../../../Utils/utils";
import { CheckResultButton, NextButton } from "../TestBottom";

function generateProgressiveList(step = 20, length = 4, hRange = [0, 360], sRange = [0, 100], lRange = [0, 100], direction = ['L'], extremeFirst = false, useSmallest = false) {
    const [hStart, hEnd] = hRange;
    const [sStart, sEnd] = sRange;
    const [lStart, lEnd] = lRange;

    const HConstant = !direction.includes('H')
    const LConstant = !direction.includes('L')
    const SConstant = !direction.includes('S')

    function getStartNumber(start, end, constant) {
        if (constant) return getRandomIntStep(start, end, step)
        else return getRandomIntStep(start, end - step * (length - 1), step)
    }

    const hStartNumber = getStartNumber(hStart, hEnd, HConstant);
    const lStartNumber = getStartNumber(lStart, lEnd, LConstant);
    const sStartNumber = getStartNumber(sStart, sEnd, SConstant);

    // Pick a random consecutive range

    let targetList = []
    for (let i = 0; i < length; i++) {
        const h = HConstant ? hStartNumber : hStartNumber + i * step
        const l = LConstant ? lStartNumber : lStartNumber + i * step
        const s = SConstant ? sStartNumber : sStartNumber + i * step
        targetList.push({ id: generateId(), h, s, l })
    }


    let guessList = [...targetList];
    if (extremeFirst) {
        guessList.sort((a, b) => {
            if (useSmallest) {
                // Sort by smallest s, then smallest l
                if (a.s !== b.s) return b.s - a.s;
                return a.l - b.l;
            } else {
                // Sort by largest s, then largest l
                if (a.s !== b.s) return a.s - b.s;
                return b.l - a.l;
            }
        });
        // Keep the extreme (first) color in place, shuffle the rest
        const [extreme, ...rest] = guessList;
        rest.sort(() => Math.random() - 0.5);
        guessList = [extreme, ...rest];
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



const OrderTest = ({ hRange, sRange, lRange, length = 5, step = 20 }) => {

    const [targetList, setTargetList] = useState([])
    const [guessList, setGuessList] = useState([])
    const [checkedResult, setCheckedResult] = useState(false)
    const [chosenDirection, setChosenDirection] = useState('L')

    const direction = ['S', 'L']
    const setList = () => {

        setCheckedResult(false)

        const dir = direction[Math.floor(Math.random() * direction.length)]
        const { target, guess } = generateProgressiveList(step, length, hRange, sRange, lRange, [dir], true,)
        setChosenDirection(dir)

        console.log('target :>> ', target);
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
            <ProgressiveTest guessList={guessList} startTest={setList} length={length} direction={[chosenDirection]} />
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

const ProgressiveTest = ({ guessList, startTest, length = 5, direction = ['L'] }) => {
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
        const answer = guessList.map(item => direction.includes('L') ? item.l - guessList[0].l : item.s - guessList[0].s)
        console.log('direction :>> ', direction);

        console.log('answer :>> ', answer);
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

                {!(testEnded && !checkedResult) && <NextButton testEnded={testEnded} onClick={() => onNext()} />}
                {testEnded && <CheckResultButton onClick={() => setCheckedResult(true)} />}


                {checkedResult && testEnded && <label>{checkProgressiveResult().toString()}</label>}
            </div>
        </div>
    )




}


export default OrderTest;
