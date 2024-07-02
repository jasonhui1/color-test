
const ColorSwatch = ({ color, size = 1, border = false, onClick = null, style = {} }) => {

    const backgroundColor = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    const width = size * 3 + 'rem'
    const borderStyle = border ? 'border-2 border-slate-500' : ''

    return (
        <div
            style={{ backgroundColor: `${backgroundColor}`, width: width, height: width, ...style }}
            className={`w-6 h-6 rounded ${borderStyle} ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick}
        />
    );
};

export default ColorSwatch