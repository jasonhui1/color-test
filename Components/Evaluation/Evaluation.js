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
    console.log('Data :>> ', Data);

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

const Evaluation = ({ history, mode, difficulty = 'easy' }) => {

    const [percentage, setPercentage] = useState(0)

    /** Ideas
    1. Pattern
    2. Find trend 
    3. Suggest focus area (after X tests)
    4. IS in suitable level (+= 1 difficulty)
    **/
    const correct = []
    const incorrect = []
    const min_number = 20

    const [heatmapData, setHeatmapData] = useState({
        max: 100,
        data: []
    });

    useEffect(() => {
        const { percentage: percentage_, data } = calculatestat(history, mode, difficulty)
        setPercentage(percentage_)

        const heatmapData_ = []

        const ratio = 1
        const bb = {
            x1: 88 / ratio, y1: 45 / ratio,
            x2: 269 / ratio, y2: 255 / ratio
        }
        const w = bb.y2 - bb.y1

        if (mode === 'bw') {
            Object.keys(data).forEach(L => {
                // const enoughData = (current.correct + current.incorrect) > min_number
                // if (!enoughData) return
                const color = { h: 0, s: 0, l: L }
                const { x, y } = getPositionFromSV(color.s, color.l, w, bb)
                const current = data[L]

                heatmapData_.push({ x, y, value: current.percentage })
            });
        } else {
            Object.keys(data).forEach(H => {
                Object.keys(data[H]).forEach(L => {
                    Object.keys(data[H][L]).forEach(S => {
                        const current = data[H][L][S]
                        // const enoughData = (current.correct + current.incorrect) > min_number
                        // if (!enoughData) return

                        const color = { h: H, s: S, l: L }
                        const { x, y } = getPositionFromSV(color.s, color.l, w, bb)

                        heatmapData_.push({ x, y, value: current.percentage, color })
                    })
                })
            })
        }

        setHeatmapData(prev => ({ ...prev, data: heatmapData_ }));
    }, [history, mode])

    return (
        <div>
            <label> Evaluation: {percentage}%</label>
            <div className="flex flex-col relative">
                {/* <TriangularColorPickerDisplayHistory hue={(mode === 'bw' || history.length === 0) ? 0 : history[0].targetColor.h} correct={correct} incorrect={incorrect} /> */}
                <div className="flex">
                    <Image className='absolute' src={color_wheel} alt="color_wheel" width={300} height={300} draggable={false} style={{
                        userSelect: 'none',
                        WebkitUserDrag: 'none',
                        KhtmlUserDrag: 'none',
                        MozUserDrag: 'none',
                        OUserDrag: 'none',
                    }} />
                    <HeatmapComponent data={heatmapData} width={300} height={300} />
                    <svg width={300} height={300} className="absolute">
                        <path d='M 88 45 L 88 255 L 269 150 z' stroke="black" strokeWidth={3} fill="transparent" />
                    </svg>
                </div>
            </div>
            <ColorHistoryTable history={history} mode={mode} difficulty={difficulty} />
        </div>
    )
}


export default Evaluation;

