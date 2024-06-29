import ColorHistoryTable from "../history"
import { calculateHLSDifference, stepInDifficulty } from "../General/utils";
import { getAccuracy } from "./ResultDisplay";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { TriangularColorPickerDisplayHistory } from "../Color Picker/ColorPicker";


function calculatestat(history, mode, difficulty) {

    let correct = []
    let incorrect = []
    let SData = {}
    let LData = {}
    history.map(({ targetColor, selectedColor }) => {

        const { hue_diff: h, sat_diff: s, lig_diff: l, distance_diff, ...props } = getAccuracy(targetColor, selectedColor, difficulty)
        const [absH, absS, absL] = [Math.abs(h), Math.abs(s), Math.abs(l)]
        const step = stepInDifficulty(difficulty)
        const allowance = 10

        if (mode === 'bw') {

            const lKey = `${targetColor.l}`;
            LData[lKey] = LData[lKey] ?? {};
            if (absL < allowance) {
                correct.push({ h: 0, s: 0, l: targetColor.l });
                LData[lKey].correct = (LData[lKey].correct ?? 0) + 1
                return
            }

            // Too dark
            if (l < 0) LData[lKey].over = (LData[lKey].over ?? 0) + 1;
            else LData[lKey].under = (LData[lKey].under ?? 0) + 1;
            incorrect.push({ h: 0, s: 0, l: targetColor.l })

        } else {
            // if (absH < allowance && absS < allowance && absL < allowance) correct += 1
            if (distance_diff < allowance) { correct.push(targetColor); return }
            incorrect.push(targetColor)
        }
    })

    return {
        percentage: correct.length / history.length * 100, correct: correct, incorrect: incorrect
    }
}

function findTendency(data) {

}

const Evaluation = ({ history, mode, difficulty }) => {

    /** Ideas
    1. Pattern
    2. Find trend 
    3. Suggest focus area (after X tests)
    4. IS in suitable level (+= 1 difficulty)
    **/
    const { percentage, correct, incorrect } = calculatestat(history, mode, difficulty)


    return (
        <div>
            <label> Evaluation: {percentage}%</label>
            <ColorHistoryTable history={history} mode={mode} difficulty={difficulty} />
            <TriangularColorPickerDisplayHistory hue={history[0].targetColor.h} correct={correct} incorrect={incorrect} />
        </div>
    )
}



export default Evaluation;

