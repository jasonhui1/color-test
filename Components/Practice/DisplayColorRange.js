import { createRef, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateAllColorFromTriangle } from "../../Utils/color_util";
import { roundToStep } from "../../Utils/utils";
import ColorSwatch from "../Color Picker/ColorSwatch";
import { useSettings } from "../../Contexts/setting";

const DisplayColorRange = ({ selectedColor, setSelectedColor, h_range, s_range, l_range }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { step, practicing, mode } = useSettings()
    const gridRef = useRef(null);

    const rounded_hue = roundToStep(selectedColor.h, step.h)

    const { dict } = useMemo(() => {
        if (mode === 'bw') return generateAllColorFromTriangle([rounded_hue, rounded_hue], l_range, [0, 0], step)
        else return generateAllColorFromTriangle([rounded_hue, rounded_hue], l_range, s_range, step)
    }, [selectedColor.h, step]);

    const handleMouseMove = (event) => {
        if (gridRef.current) {
            const rect = gridRef.current.getBoundingClientRect();
            setMousePosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });
        }
    }
    const handleMouseLeave = useCallback(() => {
        setMousePosition({ x: -1000, y: -1000 }); // Move spotlight off-screen
    }, []);

    useEffect(() => {
        const grid = gridRef.current;
        if (grid) {
            grid.addEventListener('mousemove', handleMouseMove);
            grid.addEventListener('mouseleave', handleMouseLeave);
            return () => {
                grid.removeEventListener('mousemove', handleMouseMove);
                grid.removeEventListener('mouseleave', handleMouseLeave);
            };
        }
    }, [practicing, handleMouseMove, handleMouseLeave]);

    return (
        <div ref={gridRef} className="relative">
            <ColorSwatchGrid
                dict={dict}
                setSelectedColor={setSelectedColor}
                hue={rounded_hue}
            />

            {/* Reveal effect */}
            {!practicing && (
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px,  rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1), 50%,  rgba(255, 255, 255, 1))`,
                        mixBlendMode: 'color',
                        // opacity: mousePosition.x > 0 ? 1 : 0,
                    }}
                />
            )}


        </div>
    )
}

const ColorSwatchGrid = memo(({ dict, setSelectedColor, hue }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            {Object.keys(dict).map((H, index) => {
                const h = hue;
                let current = dict[h];
                return (
                    <ColorSwatchColumn key={index} dict={current} setSelectedColor={setSelectedColor} color={{ h }} />
                );
            })}
        </div>
    )
})

const ColorSwatchColumn = ({ dict, setSelectedColor, color }) => {
    return (
        <div className='flex flex-col gap-2'>
            {dict && Object.keys(dict).reverse().map((L, i) => {
                const rangeArray = dict[L];
                const newColor = { ...color, l: Number(L) };

                return (
                    <ColorSwatchRow key={L} array={rangeArray} setSelectedColor={setSelectedColor} color={newColor} />
                );
            })}
        </div>
    )
}

const ColorSwatchRow = ({ array, setSelectedColor, color, }) => {
    return (
        <div className='flex flex-row gap-2'>
            {array.map((s, j) => {
                const newColor = { ...color, s };
                return <ColorSwatch key={j} color={newColor} size={1} border onClick={() => setSelectedColor(newColor)}
                />
            })}
        </div>
    )
}

export default DisplayColorRange