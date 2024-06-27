
import { Reorder } from "framer-motion"
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

function generateList(step = 20, length = 4) {
    const rangeArray = [];
    for (let i = 0; i <= 100; i += step) {
        rangeArray.push({ id: uuidv4(), h: 0, s: 0, l: i })
    }

    const targetList = []
    for (let i = 0; i < length; i++) {
        const j = Math.floor(rangeArray.length * Math.random())
        targetList.push(rangeArray[j])
        rangeArray.splice(j, 1)
    }

    const guessList = targetList
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);

    return { target: targetList, guess: guessList };
}

function ReorderList({ guessList, setGuessList }) {
    function onReorder(array) {
        setGuessList(array);
    }
    return (
        <Reorder.Group axis="x" values={guessList} onReorder={onReorder}>
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

    const setList = () => {
        const { target, guess } = generateList(10)

        setTargetList(target)
        setGuessList(guess)
    }



    return (
        <div>
            <button
                onClick={setList}
                className="bg-blue-500 text-white px-4 py-2 rounded mr-4 hover:bg-blue-600"
            >
                Generate List
            </button>
            {/* <button
                onClick={checkResult}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={!targetColor}
            >
                Check Result
            </button> */}
            <ReorderList guessList={guessList} setGuessList={setGuessList} />
        </div>
    )
}


export default OrderTest;
// const DisplayColorRange = ({ step = 20 }) => {
//     const rangeArray = [];
//     for (let i = 0; i <= 100; i += step) {
//         rangeArray.push(i);
//     }

//     return (
//         <div className='flex flex-col gap-2'>
//             {rangeArray.toReversed().map((l) => {
//                 return (
//                     <div className='flex flex-row gap-2'>
//                         {rangeArray.map((s) => {

//                             return (
//                                 <div
//                                     className="w-12 h-12 border border-gray-300"
//                                     style={{ backgroundColor: `hsl(0, ${s}%, ${l}%)` }}
//                                 ></div>
//                             )
//                         })}
//                     </div>
//                 )
//             })}
//         </div>
//     )
// }