import { getHistory } from "./Storage/test_history"
import { RenderResultIcon, getAccuracy, getDifferences } from "./Test/Result/ResultDisplay";
import { calculateHLSDifference } from "./General/utils";
import { FaCheck, FaTimes } from 'react-icons/fa';


const ColorHistoryTable = ({ history, showTimeStamp = false, mode = 'normal', difficulty = 'easy' }) => {
    // const history = getHistory();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left"></th>
                        {showTimeStamp && <th className="px-4 py-2 text-left">Timestamp</th>}
                        <th className="px-4 py-2 text-left">Target Color</th>
                        <th className="px-4 py-2 text-left">Selected Color</th>
                        {mode !== 'bw' && <th className="px-4 py-2 text-left">H Diff</th>}
                        <th className="px-4 py-2 text-left">L Diff</th>
                        {mode !== 'bw' && <th className="px-4 py-2 text-left">S Diff</th>}
                        {mode !== 'bw' && <th className="px-4 py-2 text-left">Distance</th>}
                    </tr>
                </thead>
                <tbody>
                    {history.map(({ targetColor, selectedColor, timestamp }, index) => {
                        const differences = getDifferences(targetColor, selectedColor);
                        const accuracy = getAccuracy(targetColor, differences, difficulty);

                        return (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-4 py-2 border-t"><RenderResultIcon result={mode === 'bw' ? accuracy.l : accuracy.distance} /></td>

                                {showTimeStamp && <td className="px-4 py-2 border-t">{new Date(timestamp).toLocaleString()}</td>}

                                <td className=" px-4 py-2 border-t">
                                    <div className="flex items-center">
                                        <div
                                            className="w-12 h-12 mr-2 border border-gray-300"
                                            style={{ backgroundColor: `hsl(${targetColor.h}, ${targetColor.s}%, ${targetColor.l}%)` }}
                                        ></div>
                                        <label>{targetColor.l}</label>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-t">
                                    <div className="flex items-center">
                                        <div
                                            className="w-12 h-12 mr-2 border border-gray-300"
                                            style={{ backgroundColor: `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.l}%)` }}
                                        ></div>
                                        <label>{selectedColor.l}</label>

                                    </div>
                                </td>

                                {mode !== 'bw' && <td className="px-4 py-2 border-t">{differences.h}</td>}
                                <td className="px-4 py-2 border-t">{differences.l}</td>
                                {mode !== 'bw' && <td className="px-4 py-2 border-t">{differences.s} ({(differences.xDistance * 100).toFixed(1)})</td>}
                                {mode !== 'bw' && <td className="px-4 py-2 border-t">{differences.distance.toFixed(1)}</td>}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ColorHistoryTable;