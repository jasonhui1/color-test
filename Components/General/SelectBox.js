import { ChevronDown } from 'lucide-react';

export const SelectBox = ({ current, onChange, options, label }) => {
    return (
        <div className="flex items-center justify-between">
            <label className="font-medium text-gray-700">{label}:</label>
            <div className="relative">
                <select
                    value={current}
                    onChange={(e) => onChange(e.target.value)}
                    // className="border rounded px-2 py-1"
                    className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>

        </div>)
}
