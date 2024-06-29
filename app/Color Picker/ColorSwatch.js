
const ColorSwatch = ({ color, size = 1, border = false }) => {

    const backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    const width = size * 3 + 'rem'
    const borderStyle = border ? 'border-4 border-slate-300' : ''

    return (
        <div
            style={{ backgroundColor: `${backgroundColor}`, width: width, height: width }}
            className={`w-6 h-6 rounded ${borderStyle}`}
        />
    );
};

export default ColorSwatch