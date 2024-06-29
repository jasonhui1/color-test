import { FaCheck, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { calculateDistance, calculateHLSDifference, stepInDifficulty } from '../General/utils';
import { getPositionFromSV } from '../Color Picker/ColorPicker';

export const getAccuracy = (targetColor, selectedColor, difficulties, allowance = 10) => {
    if (!targetColor) return { hue: 'N/A', saturation: 'N/A', value: 'N/A' };

    const { h: hue_diff, s: sat_diff, l: lig_diff } = calculateHLSDifference(targetColor, selectedColor, false);

    // @ts-ignore
    const { x, y } = getPositionFromSV(selectedColor.s, selectedColor.l)
    const { x: tx, y: ty } = getPositionFromSV(targetColor.s, targetColor.l)
    const distance_diff = calculateDistance(x, y, tx, ty) * 100
    // const distance_diff = calculateDistance(x, y, tx, ty) * 100

    const step = stepInDifficulty(difficulties);

    const HAccuracy = Math.abs(hue_diff) <= allowance || tx * 100 <= allowance || targetColor.l < allowance || targetColor.l > 100 - allowance / 2
    const SAccuracy = Math.abs(sat_diff) <= allowance;
    const LAccuracy = Math.abs(lig_diff) <= allowance;
    const distanceAccuracy = distance_diff <= allowance;

    return {
        hue: HAccuracy ? 'correct' : selectedColor.h < targetColor.h ? 'low' : 'high',
        saturation: SAccuracy ? 'correct' : selectedColor.s < targetColor.s ? 'low' : 'high',
        lightness: LAccuracy ? 'correct' : selectedColor.l < targetColor.l ? 'low' : 'high',
        distance: distanceAccuracy ? 'correct' : 'wrong',
        hue_diff, sat_diff, lig_diff, distance_diff

    };
};

export const ResultDisplay = ({ targetColor, selectedColor, mode, difficulties }) => {

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            {(() => {
                const accuracy = getAccuracy(targetColor, selectedColor, difficulties);
                return (
                    <div>
                        {mode !== 'bw' && <RenderResult type='Distance' result={accuracy.distance} difference={accuracy.distance_diff} />}

                        {mode !== 'bw' && <RenderResult type='Hue' result={accuracy.hue} difference={accuracy.hue_diff} />}
                        <RenderResult type='Lightness' result={accuracy.lightness} difference={accuracy.lig_diff} />
                        {mode !== 'bw' && <RenderResult type='Saturation' result={accuracy.saturation} difference={accuracy.sat_diff} />}
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
