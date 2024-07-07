import { FaCheck, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useSettings } from '../../Contexts/setting';
import { getAccuracy, getDifferences } from '../../Utils/color_util';

export const ResultDisplay = ({ targetColor, selectedColor }) => {
    const { mode, difficulty, testMethod } = useSettings()
    const differences = getDifferences(targetColor, selectedColor);
    const accuracy = getAccuracy(targetColor, differences, difficulty);

    const showDistance = mode !== 'bw' && testMethod === 'exact'
    const showH = mode !== 'bw' && (testMethod === 'exact' || testMethod === 'h_only')
    const showL = testMethod === 'exact' || testMethod === 'l_only'
    const showS = mode !== 'bw' && (testMethod === 'exact' || testMethod === 's_only')

    console.log('testMethod :>> ', testMethod);


    return (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            {(() => {

                return (
                    <div>
                        {showDistance && <RenderResult type='Distance' result={accuracy.distance} difference={differences.distance} />}
                        {showH && <RenderResult type='Hue' result={accuracy.h} difference={differences.h} />}
                        {showL && <RenderResult type='Lightness' result={accuracy.l} difference={differences.l} />}
                        {showS && <RenderResult type='Saturation' result={accuracy.sDistance} difference={`${differences.xDistance.toFixed(2)}`} />}
                        {/* {showS && <RenderResult type='Saturation' result={accuracy.sDistance} difference={`${differences.s} , (${differences.xDistance.toFixed(2)})`} />} */}
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
