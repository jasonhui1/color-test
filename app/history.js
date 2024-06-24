import { getHistory } from "./Storage/test_history"


const ColorHistoryTable = () => {
    const history = getHistory();

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">Timestamp</th>
                        <th className="px-4 py-2 text-left">Target Color</th>
                        <th className="px-4 py-2 text-left">Selected Color</th>
                        <th className="px-4 py-2 text-left">Hue Diff</th>
                        <th className="px-4 py-2 text-left">Saturation Diff</th>
                        <th className="px-4 py-2 text-left">Value Diff</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map(({ targetColor, selectedColor, timestamp }, index) => {
                        const difference = calculateHSVDifference(targetColor, selectedColor);

                        return (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-4 py-2 border-t">{new Date(timestamp).toLocaleString()}</td>

                                <td className=" px-4 py-2 border-t">
                                    <div className="flex items-center">
                                        <div
                                            className="w-12 h-12 mr-2 border border-gray-300"
                                            style={{ backgroundColor: `hsl(${targetColor.h}, ${targetColor.s}%, ${targetColor.v}%)` }}
                                        ></div>
                                    </div>
                                </td>
                                <td className="px-4 py-2 border-t">
                                    <div className="flex items-center">
                                        <div
                                            className="w-12 h-12 mr-2 border border-gray-300"
                                            style={{ backgroundColor: `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.v}%)` }}
                                        ></div>
                                    </div>
                                </td>

                                <td className="px-4 py-2 border-t">{difference.h}</td>
                                <td className="px-4 py-2 border-t">{difference.s}</td>
                                <td className="px-4 py-2 border-t">{difference.v}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ColorHistoryTable;

const calculateHSVDifference = (color1, color2) => {
    const hueDiff = Math.abs(color1.h - color2.h);
    const satDiff = -(color1.s - color2.s);
    const valDiff = -(color1.v - color2.v);

    return {
        h: hueDiff > 180 ? 360 - hueDiff : hueDiff,
        s: satDiff,
        v: valDiff
    };
};