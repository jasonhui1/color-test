
import { Reorder } from "framer-motion"
import { useState } from "react"
import { CheckResultButton, NextButton } from "../test";
import { generateId, getRandomIntStep } from "../../General/utils";
import { defaultHLS, generateRandomColorAdvanced, hlsToString } from "../../General/color_util";
import ColorSwatch from "../../Color Picker/ColorSwatch";


function generatePair(hRange, lRange, sRange, mode, step, direction = ['L']) {


    // Not the maximum
    let newLRange = [lRange[0], lRange[1] - step]
    let newSRange = [sRange[0], sRange[1] - step]

    const color1 = generateRandomColorAdvanced(hRange, newLRange, newSRange, mode, step);

    // Not less than ref
    newLRange = [color1.l + step, lRange[1]]
    newSRange = [color1.s + step, sRange[1]]

    const color2 = generateRandomColorAdvanced(hRange, newLRange, newSRange, mode, step);

    return { color1, color2 }
}

const CompareTest = ({ hRange, sRange, lRange, mode = 'normal', length = 2, step = 20, checkedResult, setCheckedResult }) => {


    const [refColor, setRefColor] = useState(defaultHLS)
    const [targetColor, setTargetColor] = useState(defaultHLS)
    const [guessColor, setGuessColor] = useState(defaultHLS)

    const [chosenDirection, setChosenDirection] = useState('L')

    const direction = ['S', 'L']
    const reset = () => {
        setCheckedResult(false)

        const { color1, color2 } = generatePair(hRange, lRange, sRange, mode, step);
        console.log('color1 :>> ', color1);
        console.log('color2 :>> ', color2);
        setRefColor(color1)
        setTargetColor(color2)

    }

    // const onNext = () => {
    //     if (!testStarted) {
    //         startTest()
    //         // setGuesses(new Array(length).fill(0))
    //         // }

    //         // if (testEnded) {
    //         //     setCurrentIndex(0)
    //         // } else {
    //         //     setCurrentIndex(currentIndex + 1)
    //         // }
    //         setCheckedResult(false)
    //     }
    // }

    // const checkSortResult = () => {

    //     for (let i = 0; i < targetList.length; i++) {
    //         if (targetList[i].l !== guessList[i].l) {
    //             return false
    //         }
    //     }
    //     return true
    // }

    return (
        <div>
            {/* <ReorderList guessList={guessList} setGuessList={setGuessList} /> */}
            {/* {checkedResult && <p>{checkSortResult().toString()}</p>} */}
            <TestDisplay refColor={refColor} targetColor={targetColor} guessColor={guessColor} />
            <button
                onClick={reset}
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

const TestDisplay = ({ refColor, targetColor, guessColor, patternDensity = 30 }) => {
    // const [currentIndex, setCurrentIndex] = useState(0)
    // const [guesses, setGuesses] = useState([])
    // const [checkedResult, setCheckedResult] = useState(false)

    return (
        <div>

            <div className="flex flex-row justify-center items-center gap-4">
                <ColorSwatch color={refColor} size={3} />
                <ColorSwatch color={targetColor} size={3} />
                {/* <ColorSwatch color={guessColor} /> */}

            </div>
            <StripePattern density={patternDensity} color1={refColor} color2={targetColor} />

        </div>
    )
}

const StripePattern = ({ density, color1, color2 }) => {
    const halfDensity = density / 2

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
            <defs>
                {/* Stripe pattern */}
                <pattern id="stripes" patternUnits="userSpaceOnUse" width={density} height={density} patternTransform=' rotate(45)'>
                    <rect width={halfDensity} height={density} fill={hlsToString(color1)} />
                    <rect x={halfDensity} width={halfDensity} height={density} fill={hlsToString(color2)} />
                </pattern>
            </defs>
            {/* Example usage of the stripe pattern */}
            <rect x="50" y="50" width="200" height="200" fill="url(#stripes)" />
        </svg>
    )
}


export default CompareTest;
// patternUnits='userSpaceOnUse'  patternTransform='scale(4) rotate(70)'> stroke-width='1' stroke='none' fill='hsla(15,94.3%,6.9%,1)' /></pattern></defs><rect width='800%' height='800%' transform='translate(0,0)' fill='url(#a)' /></svg>