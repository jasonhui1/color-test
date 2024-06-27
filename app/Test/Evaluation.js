import ColorHistoryTable from "../history"
import { calculateHLSDifference, stepInDifficulty } from "../utils";
import { getAccuracy } from "./ResultDisplay";

function calculatePercentage(history, mode, difficulty) {

    let correct = 0
    let SData = {}
    let LData = {}
    history.map(({ targetColor, selectedColor }) => {

        const { hue_diff: h, sat_diff: s, lig_diff: l, distance_diff, ...props } = getAccuracy(targetColor, selectedColor, difficulty)
        const [absH, absS, absL] = [Math.abs(h), Math.abs(s), Math.abs(l)]
        const step = stepInDifficulty(difficulty)
        const allowance = step / 2

        if (mode === 'bw') {

            const lKey = `${targetColor.l}`;
            LData[lKey] = LData[lKey] ?? {};
            if (absL < allowance) {
                correct += 1;
                LData[lKey].correct = (LData[lKey].correct ?? 0) + 1
                return
            }

            // Too dark
            if (l < 0) LData[lKey].over = (LData[lKey].over ?? 0) + 1;
            else LData[lKey].under = (LData[lKey].under ?? 0) + 1;

        } else {
            // if (absH < allowance && absS < allowance && absL < allowance) correct += 1
            if (distance_diff < allowance) correct += 1
        }
    })

    return correct / history.length * 100
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


    return (
        <div>
            <label> Evaluation: {calculatePercentage(history, mode, difficulty)}%</label>
            <ColorHistoryTable history={history} mode={mode} difficulty={difficulty} />
        </div>
    )
}

export default Evaluation;