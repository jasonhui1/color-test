import ColorHistoryTable from "../HistoryTable"
import { calculateHLSDifference, stepInDifficulty } from "../../Utils/utils";
import { FaCheck, FaTimes } from 'react-icons/fa';
import { TriangularColorPickerDisplayHistory } from "../Color Picker/ColorPicker";
import { getAccuracy, getDifferences } from "../../Utils/color_util";
import { memo, useEffect, useState } from "react";
import { getPositionFromSV } from "../../Utils/calculation_util";
import HeatmapComponent from "./Heatmap";
import color_wheel from '/public/color_wheel.png';
import Image from 'next/image';


function calculatestat(history, mode, difficulty) {
    let correct = []
    let incorrect = []
    let Data = {}

    const defineKey = (data, key) => data[key] = data[key] ?? {}
    const selfIncrement = (data, key) => data[key] = (data[key] ?? 0) + 1
    const checkCorrect = (data, key) => data[key] == 'correct'

    function handleCheckAndIncrement(current, accuracy, differences, type, key, differenceKey) {

        if (!checkCorrect(accuracy, key)) {
            selfIncrement(current, `incorrect${type.toUpperCase()}`);

            if (differences[differenceKey] < 0) {
                selfIncrement(current, `under${type.toUpperCase()}`);
            } else {
                selfIncrement(current, `over${type.toUpperCase()}`);
            }
        }
    }

    history.map(({ targetColor, selectedColor }) => {

        const differences = getDifferences(targetColor, selectedColor);
        const accuracy = getAccuracy(targetColor, differences, difficulty);

        if (mode === 'bw') {
            const lKey = `${targetColor.l}`;
            Data[lKey] = defineKey(Data, lKey);
            const current = Data[lKey]

            // Correct
            if (checkCorrect(accuracy, 'l')) {
                correct.push({ h: 0, s: 0, l: targetColor.l });
                selfIncrement(current, 'correct')
                return
            }

            incorrect.push({ h: 0, s: 0, l: targetColor.l })
            selfIncrement(current, 'incorrect')

            // Over estimated/ under estimated
            if (differences.l < 0) selfIncrement(current, 'over');
            else selfIncrement(current, 'under');

        } else {
            const hKey = `${targetColor.h}`;
            const lKey = `${targetColor.l}`;
            const sKey = `${targetColor.s}`;

            defineKey(Data, hKey);
            defineKey(Data[hKey], lKey);
            defineKey(Data[hKey][lKey], sKey);

            const current = Data[hKey][lKey][sKey]
            const correctH = checkCorrect(accuracy, 'h')
            const correctSV = checkCorrect(accuracy, 'distance')

            // if (absH < allowance && absS < allowance && absL < allowance) correct += 1
            if (correctH && correctSV) {
                correct.push(targetColor);
                selfIncrement(current, 'correct')
                return
            }

            incorrect.push(targetColor)
            selfIncrement(current, 'incorrect')



            // over saturated/ over light
            handleCheckAndIncrement(current, accuracy, differences, 'h', 'h', 'h');
            handleCheckAndIncrement(current, accuracy, differences, 's', 'sDistance', 'xDistance');
            handleCheckAndIncrement(current, accuracy, differences, 'l', 'l', 'l');
        }
    })

    findTendency(Data, mode)
    // console.log('Data :>> ', Data);

    return {
        percentage: correct.length / history.length * 100, correct, incorrect, data: Data
    }
}

function findTendency(data, mode) {

    const getKey = (data, key) => data[key] || 0

    const setTendency = (data, suffix = '') => {
        const correct = getKey(data, 'correct')
        const incorrect = getKey(data, 'incorrect' + suffix)
        data['percentage' + suffix] = (correct / (correct + incorrect)) * 100

        if (incorrect === 0) return
        const over = getKey(data, 'over' + suffix)
        const under = getKey(data, 'under' + suffix)

        data['overTendency' + suffix] = (over / incorrect) * 100
        data['underTendency' + suffix] = (under / incorrect) * 100
    }

    if (mode === 'bw') {
        Object.keys(data).forEach(L => {
            const current = data[L]
            setTendency(current)
        });
    } else if (mode === 'normal') {


        Object.keys(data).forEach(H => {
            Object.keys(data[H]).forEach(S => {
                Object.keys(data[H][S]).forEach(L => {
                    const current = data[H][S][L]
                    const correct = getKey(current, 'correct')
                    const incorrect = getKey(current, 'incorrect')
                    current['percentage'] = (correct / (correct + incorrect)) * 100
                    setTendency(current, 'H')
                    setTendency(current, 'S')
                    setTendency(current, 'L')
                })
            })
        })
    }
}

const Evaluation = ({ history, mode, difficulty = 'normal', useHeatmap = false }) => {

    const [percentage, setPercentage] = useState(0)
    const [correct, setCorrect] = useState([])
    const [incorrect, setIncorrect] = useState([])
    const [data, setData] = useState({})

    /** Ideas
    1. Pattern
    2. Find trend 
    3. Suggest focus area (after X tests)
    4. IS in suitable level (+= 1 difficulty)
    **/

    useEffect(() => {
        const { percentage: percentage_, data, correct, incorrect } = calculatestat(history, mode, difficulty)
        setPercentage(percentage_)
        setCorrect(correct)
        setIncorrect(incorrect)
        setData(data)
    }, [history, mode, difficulty])

    // console.log('history :>> ', history);

    return (
        <div>
            <label> Evaluation: {percentage}%</label>
            <div className="flex flex-col relative">
                {!useHeatmap ? <TriangularColorPickerDisplayHistory hue={(mode === 'bw' || history.length === 0) ? 0 : history[0].targetColor.h} correct={correct} incorrect={incorrect} />
                    : <HeatmapDisplay data={data} mode={mode} step={stepInDifficulty(difficulty)/2} useHeatmap={useHeatmap} />
                }
            </div>
            <ColorHistoryTable history={history} mode={mode} difficulty={difficulty} />
        </div >
    )
}


const HeatmapDisplay = ({ data, mode, step, useHeatmap = false }) => {
    const [heatmapData, setHeatmapData] = useState({
        max: 100,
        data: []
    });

    const ratio = 1
    const bb = {
        x1: 88 / ratio, y1: 45 / ratio,
        x2: 269 / ratio, y2: 255 / ratio
    }
    const w = bb.y2 - bb.y1

    const minForStat = 4
    step = step / 100
    useEffect(() => {
        if (!useHeatmap) return
        const heatmapData_ = []

        if (mode === 'bw') {
            Object.keys(data).forEach(L => {
                // const enoughData = (current.correct + current.incorrect) > min_number
                // if (!enoughData) return
                const color = { h: 0, s: 0, l: L }
                const { x, y } = getPositionFromSV(color.s, color.l, w, bb)
                const current = data[L]

                heatmapData_.push({ x, y, value: current.percentage, radius: step * w })
            });
        } else {
            Object.keys(data).forEach(H => {
                Object.keys(data[H]).forEach(L => {
                    Object.keys(data[H][L]).forEach(S => {
                        const current = data[H][L][S]
                        const dataAmount = (current.correct ?? 0) + (current.incorrect ?? 0)
                        const enoughData = dataAmount >= minForStat
                        if (!enoughData) return;

                        const color = { h: H, s: S, l: L }
                        const { x, y } = getPositionFromSV(color.s, color.l, w, bb)


                        // heatmapData_.push({ x, y, value:  current.percentage, color, radius:step*w })
                        // if (current.percentage < 90) {
                        console.log(color, (Math.round(current.percentage)) + '%', dataAmount, current);
                        heatmapData_.push({
                            x: Math.round(x), y: Math.round(y),
                            value: (100 - current.percentage),
                            radius: step * w
                        })
                        // }
                    })
                })
            })
        }

        setHeatmapData(prev => ({ ...prev, data: heatmapData_ }));
    }, [history, mode, useHeatmap])

    const clipPathData = `M ${bb.x1} ${bb.y1} L ${bb.x1} ${bb.y2} L ${bb.x2} ${(bb.y1 + bb.y2) / 2} z`
    const clipPath = `path('${clipPathData}')`

    return (
        <div className="flex">
            <Image className='absolute' src={color_wheel} alt="color_wheel" width={300} height={300} draggable={false} style={{
                userSelect: 'none',
                WebkitUserDrag: 'none',
                KhtmlUserDrag: 'none',
                MozUserDrag: 'none',
                OUserDrag: 'none',
            }} />
            <HeatmapComponent data={heatmapData} width={300} height={300} clipPath={clipPath} />
            {/* Border */}
            <svg width={300} height={300} className="absolute">
                <path d={clipPathData} stroke="black" strokeWidth={2} fill="transparent" />
            </svg>
        </div>
    )

}



export default Evaluation;

