import ColorHistoryTable from "../../history"
import { calculateHLSDifference, stepInDifficulty } from "../../General/utils";
import { getAccuracy } from "./ResultDisplay";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { TriangularColorPickerDisplayHistory } from "../../Color Picker/ColorPicker";


function calculatestat(history, mode, difficulty) {

    let correct = []
    let incorrect = []
    let Data = {}

    const defineKey = (data, key) => data[key] = data[key] ?? {}
    const selfIncrement = (data, key) => data[key] = (data[key] ?? 0) + 1

    history.map(({ targetColor, selectedColor }) => {

        const { hue_diff: h, sat_diff: s, lig_diff: l, distance_diff } = getAccuracy(targetColor, selectedColor, difficulty)
        const [absH, absS, absL] = [Math.abs(h), Math.abs(s), Math.abs(l)]
        const step = stepInDifficulty(difficulty)
        const allowance = 10

        if (mode === 'bw') {
            const lKey = `${targetColor.l}`;
            Data[lKey] = defineKey(Data, lKey);
            const current = Data[lKey]

            // Correct
            if (absL < allowance) {
                correct.push({ h: 0, s: 0, l: targetColor.l });
                selfIncrement(current, 'correct')
                return
            }

            incorrect.push({ h: 0, s: 0, l: targetColor.l })
            selfIncrement(current, 'incorrect')

            // Over estimated/ under estimated
            if (l < 0) selfIncrement(current, 'over');
            else selfIncrement(current, 'under');

        } else {
            const hKey = `${targetColor.h}`;
            const lKey = `${targetColor.l}`;
            const sKey = `${targetColor.s}`;

            defineKey(Data, hKey);
            defineKey(Data[hKey], lKey);
            defineKey(Data[hKey][lKey], sKey);

            const current = Data[hKey][lKey][sKey]

            // if (absH < allowance && absS < allowance && absL < allowance) correct += 1
            if (distance_diff < allowance && absH < allowance) {
                correct.push(targetColor);
                selfIncrement(current, 'correct')
                return
            }
            incorrect.push(targetColor)
            selfIncrement(current, 'incorrect')

            //TODO: HUE too
            // over saturated/ over light
            if (absS > allowance / 2) {
                selfIncrement(current, 'incorrectS')

                if (s < 0) selfIncrement(current, 'underS');
                else selfIncrement(current, 'overS');
            }

            if (absL > allowance / 2) {
                selfIncrement(current, 'incorrectL')

                if (l < 0) selfIncrement(current, 'underL');
                else selfIncrement(current, 'overL');
            }
        }
    })

    findTendency(Data, mode)
    console.log('Data :>> ', Data);

    return {
        percentage: correct.length / history.length * 100, correct, incorrect, data: Data
    }
}

function findTendency(data, mode) {

    const getKey = (data, key) => data[key] || 0

    if (mode === 'bw') {
        Object.keys(data).forEach(L => {
            const current = data[L]
            const over = getKey(current, 'over')
            const under = getKey(current, 'under')
            const incorrect = current.incorrect || 1000000

            current.overTendency = over / incorrect
            current.underTendency = under / incorrect
        });
    } else if (mode === 'normal') {

        Object.keys(data).forEach(H => {
            Object.keys(data[H]).forEach(S => {
                Object.keys(data[H][S]).forEach(L => {

                    const current = data[H][S][L]

                    const overS = getKey(current, 'overS')
                    const underS = getKey(current, 'underS')
                    const incorrectS = current.incorrectS || 1000000

                    current.overTendencyS = overS / incorrectS
                    current.underTendencyS = underS / incorrectS

                    const overL = getKey(current, 'overL')
                    const underL = getKey(current, 'underL')
                    const incorrectL = current.incorrectL || 1000000

                    current.overTendencyL = overL / incorrectL
                    current.underTendencyL = underL / incorrectL
                })
            })
        })
    }
}

const Evaluation = ({ history, mode, difficulty = 'easy' }) => {

    /** Ideas
    1. Pattern
    2. Find trend 
    3. Suggest focus area (after X tests)
    4. IS in suitable level (+= 1 difficulty)
    **/
    const { percentage, correct, incorrect, data } = calculatestat(history, mode, difficulty)


    return (
        <div>
            <label> Evaluation: {percentage}%</label>
            <ColorHistoryTable history={history} mode={mode} difficulty={difficulty} />
            <TriangularColorPickerDisplayHistory hue={(mode === 'bw' || history.length === 0) ? 0 : history[0].targetColor.h} correct={correct} incorrect={incorrect} />
        </div>
    )
}



export default Evaluation;

