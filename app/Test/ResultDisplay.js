import { FaCheck, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { calculateHLSDifference } from '../utils';

export const ResultDisplay = ({ targetColor, selectedColor }) => {
    const getAccuracy = () => {
        if (!targetColor) return { hue: 'N/A', saturation: 'N/A', value: 'N/A' };

        const { h: hue_diff, s: sat_diff, l: lig_diff } = calculateHLSDifference(targetColor, selectedColor, false);

        const HAccuracy = Math.abs(hue_diff) <= 5;
        const SAccuracy = Math.abs(sat_diff) <= 5;
        const LAccuracy = Math.abs(lig_diff) <= 5;

        return {
            hue: HAccuracy ? 'correct' : selectedColor.h < targetColor.h ? 'low' : 'high',
            saturation: SAccuracy ? 'correct' : selectedColor.s < targetColor.s ? 'low' : 'high',
            lightness: LAccuracy ? 'correct' : selectedColor.l < targetColor.l ? 'low' : 'high',
            hue_diff, sat_diff, lig_diff

        };
    };

    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            {(() => {
                const accuracy = getAccuracy();
                return (
                    <div>
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
        default:
            return null;
    }
};
