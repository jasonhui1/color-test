import { getHistory } from "./Storage/test_history"
import { RenderResultIcon, getAccuracy } from "./Test/ResultDisplay";
import { calculateHLSDifference } from "./utils";
import { FaCheck, FaTimes } from 'react-icons/fa';


const ColorHistoryTable = ({ history, showTimeStamp = false, mode = 'normal' , difficulty='easy' }) => {
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
                        const { hue_diff, lig_diff, sat_diff, distance, distance_diff } = getAccuracy(targetColor, selectedColor, difficulty);

                        return (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-4 py-2 border-t"><RenderResultIcon result={distance}/></td>
                                
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

                                {mode !== 'bw' && <td className="px-4 py-2 border-t">{hue_diff}</td>}
                                <td className="px-4 py-2 border-t">{lig_diff}</td>
                                {mode !== 'bw' && <td className="px-4 py-2 border-t">{sat_diff}</td>}
                                {mode !== 'bw' && <td className="px-4 py-2 border-t">{distance_diff.toFixed(1)}</td>}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ColorHistoryTable;