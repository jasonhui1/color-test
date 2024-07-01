import { FaCheck, FaTimes, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useSettings } from '../../Context/setting';
import { getAccuracy, getDifferences } from '../../General/color_util';

export const Result = ({ targetColor, selectedColor, testId, setHistory }) => {

    const { mode, difficulty, saveToHistory } = useSettings()


    // useEffect(() => {
    //     const diff = getDifferences(targetColor, selectedColor);
    //     const acc = getAccuracy(targetColor, diff, difficulty);
    //     let correct;
    //     if (mode === 'bw') {
    //         correct = acc.l === 'correct';
    //         addHistorySB({ testId, targetColor, selectedColor, mode, difficulty: difficulty, correct });
    //     } else {
    //         correct = acc.distance === 'correct';
    //         if (saveToHistory) addHistorySB({ testId, targetColor, selectedColor, mode, difficulty: difficulty, correct });
    //     }

    //     setHistory(history => [...history, { targetColor, selectedColor, correct }]);
    // }, [targetColor, selectedColor, mode])

    const differences = getDifferences(targetColor, selectedColor);
    const accuracy = getAccuracy(targetColor, differences, difficulty);

    return (<ResultDisplay differences={differences} accuracy={accuracy} />)
}

export const ResultDisplay = ({ differences, accuracy }) => {
    const { mode } = useSettings()

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
