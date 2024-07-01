import { FaCheck, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { calculateDistance, calculateHLSDifference, stepInDifficulty } from '../../General/utils';
import { getPositionFromSV } from '../../General/color_util';
import { useEffect } from 'react';
import { useSettings } from '../../Context/setting';
import { addHistorySB } from '../../Storage/test_history_supabase';

export const getDifferences = (targetColor, selectedColor) => {
    if (!targetColor) return null;

    const { h, s, l } = calculateHLSDifference(targetColor, selectedColor, false);

    // @ts-ignore
    const { x, y } = getPositionFromSV(selectedColor.s, selectedColor.l)
    const { x: tx, y: ty } = getPositionFromSV(targetColor.s, targetColor.l)
    const distance = calculateDistance(x, y, tx, ty) * 100
    const xDistance = x - tx


    return { h, s, l, distance, xDistance }
}

export const getAccuracy = (targetColor, differences, difficulty, allowance = 10) => {
    if (!targetColor) return null;
    console.log('difficultes :>> ', difficulty);

    const step = stepInDifficulty(difficulty);
    const { x } = getPositionFromSV(targetColor.s, targetColor.l)

    //TODO: my bias hue calculation (> a certain saturation (thinking of using map range), not too bright/dark )
    const HIgnore = x * 100 < step.s || targetColor.l < step.l || targetColor.l > 100 - allowance / step.l / 2
    const hAccurate = HIgnore || Math.abs(differences.h) < step.h / 2
    const sAccurate = Math.abs(differences.s) < step.s / 2;
    const lAccurate = Math.abs(differences.l) < step.l / 2;
    const distanceAccurate = differences.distance <= allowance;

    const stepS = Math.sqrt(3) / 2 * (step.s / 100)
    const sDistanceAccurate = (Math.abs(differences.xDistance)) < (stepS / 2)

    return {
        h: hAccurate ? 'correct' : differences.h < 0 ? 'low' : 'high',
        l: lAccurate ? 'correct' : differences.l < 0 ? 'low' : 'high',
        s: sAccurate ? 'correct' : differences.s < 0 ? 'low' : 'high',

        distance: distanceAccurate ? 'correct' : 'wrong',
        sDistance: sDistanceAccurate ? 'correct' : differences.xDistance < 0 ? 'low' : 'high',
    }
};

// export const Result = ({ targetColor, selectedColor, testId }) => {

//     const { mode, difficulty, saveToHistory } = useSettings()


//     useEffect(() => {
//         const diff = getDifferences(targetColor, selectedColor);
//         const acc = getAccuracy(targetColor, diff, difficulty);
//         if (mode === 'bw') {
//             const correct = acc.l === 'correct';
//             addHistorySB({ testId, targetColor, selectedColor, mode, difficulty: difficulty, correct });
//         } else {
//             const correct = acc.distance === 'correct';
//             if (saveToHistory) addHistorySB({ testId, targetColor, selectedColor, mode, difficulty: difficulty, correct });
//         }

//     }, [targetColor, selectedColor, mode])

//     const differences = getDifferences(targetColor, selectedColor);
//     const accuracy = getAccuracy(targetColor, differences, difficulty);

//     return (<ResultDisplay differences={differences} accuracy={accuracy} mode={mode} />)
// }

export const ResultDisplay = ({ targetColor, selectedColor }) => {
    const { mode, difficulty } = useSettings()

    const differences = getDifferences(targetColor, selectedColor);
    const accuracy = getAccuracy(targetColor, differences, difficulty);

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            {(() => {

                return (
                    <div>
                        {mode !== 'bw' && <RenderResult type='Distance' result={accuracy.distance} difference={differences.distance} />}

                        {mode !== 'bw' && <RenderResult type='Hue' result={accuracy.h} difference={differences.h} />}
                        <RenderResult type='Lightness' result={accuracy.l} difference={differences.l} />
                        {mode !== 'bw' && <RenderResult type='Saturation' result={accuracy.sDistance} difference={differences.xDistance.toFixed(1)} />}
                    </div>
                );
            })()}
        </div>
    )
}
export const RenderResult = ({ type, result, difference }) => {
    return (<div className="space-y-2">
        <div className='flex space-x-2'>
            <span className="font-semibold">{type}:</span>
            <RenderResultIcon result={result} />
        </div>
        <p className="text-sm">Differnece {difference}</p>
    </div>)
}

export const RenderResultIcon = ({ result }) => {
    switch (result) {
        case 'correct':
            return <FaCheck className="text-green-500" />;
        case 'high':
            return <FaArrowUp />;
        case 'low':
            return <FaArrowDown />;
        case 'wrong':
            return <FaTimes className="text-red-500" />;
        default:
            return null;
    }
};
