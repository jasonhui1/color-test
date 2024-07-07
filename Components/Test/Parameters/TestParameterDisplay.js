import { useSettings } from "../../../Contexts/setting";

const ColorRange = ({ label, min, max }) => (
    <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-700 w-8">{label}:</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-full bg-blue-500"
                style={{ width: `${((max - min) / (label === 'H' ? 360 : 100)) * 100}%`, marginLeft: `${(min / (label === 'H' ? 360 : 100)) * 100}%` }}
            ></div>
        </div>
        <span className="text-sm text-gray-600">{min} - {max}</span>
    </div>
);

const TestParameterDisplay = ({ hRange, sRange, lRange }) => {
    const { mode } = useSettings()

    return (
        <div className='flex flex-col gap-4 my-4'>

            {mode !== 'bw' &&
                <ColorRange label={'H'} min={hRange[0]} max={hRange[1]} />
            }
            <ColorRange label={'L'} min={lRange[0]} max={lRange[1]} />

            {mode !== 'bw' &&
                <ColorRange label={'S'} min={sRange[0]} max={sRange[1]} />
            }
        </div>)
}

export default TestParameterDisplay







