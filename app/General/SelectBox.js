export const SelectBox = ({ current, onChange, options, label }) => {
    return (
        <div className="flex items-center space-x-4">
            <label className="font-medium">{label}:</label>
            <select
                value={current}
                onChange={(e) => onChange(e)}
                className="border rounded px-2 py-1"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>)
}
