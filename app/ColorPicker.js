import React, { useState, useRef, useEffect } from 'react';
import color_wheel from "../public/color_wheel.png";
import Image from 'next/image';
import HueShiftImage from './HueShiftImage';

function getPositionFromSV(s, v) {
    const y = (100 - v) / 100
    const yh = (y < 0.5) ? y : 1 - y
    const horizontalLineLength = Math.tan(Math.PI / 3) * yh
    const x = s / 100 * horizontalLineLength

    return { x, y }
}

function getSVFromPosition(x, y) {
    const yh = (y < 0.5) ? y : 1 - y
    //trigonometry

    const horizontalLineLength = Math.tan(Math.PI / 3) * yh
    const newSaturation = Math.round(x / horizontalLineLength * 100)
    const newValue = Math.round(100 - (y) * 100);

    return { s: newSaturation, v: newValue }
}

function getHueFromPosition(x, y, centerX, centerY) {
    return Math.round(Math.atan2(y - centerY, x - centerX) * 180 / Math.PI + 180)
}

function getPositionFromHue(hue, radius, centerX, centerY) {
    return {
        x: -(centerX - radius / 2) * Math.cos((hue) / 180 * Math.PI) + centerX,
        y: -(centerY - radius / 2) * Math.sin((hue) / 180 * Math.PI) + centerY,
    }
}

const TriangularColorPicker = ({ size = 300, selectedColor, setSelectedColor }) => {

    const [isDraggingColor, setIsDraggingColor] = useState(false);
    const [isDraggingHue, setIsDraggingHue] = useState(false);
    const divRef = useRef(null);

    const center = size / 2

    ///////////////////////////Cirlce///////////////////////
    // r = 25
    const defaultHueShift = 30 //by CSP
    const radius = 25

    /////////////////////////Triangle///////////////////////
    //top 88 45
    //bot 88 255
    //mid 269 149
    const bb = { x1: 88, y1: 45, x2: 269, y2: 255 }
    const w = bb.y2 - bb.y1

    //Calculate the position
    let selectedColorPosition = { x: 0, y: 0 };
    const normalizePosition = getPositionFromSV(selectedColor.s, selectedColor.v)
    selectedColorPosition = { x: normalizePosition.x * w + bb.x1, y: normalizePosition.y * w + bb.y1 }

    const selectedHue = defaultHueShift + selectedColor.h
    let selectedHuePosition = getPositionFromHue(selectedHue, radius, center, center)

    function getRelativeXY(e) {
        let x = -1
        let y = -1
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        return [x, y]
    }

    // Within bounding box (square)
    function withinTriangle(x, y) {
        return (x > bb.x1 && y > bb.y1 && x < bb.x2 && y < bb.y2)
    }

    function withinTriangle_strict(x, y) {
        // Define the three vertices of the triangle
        const [x1, y1] = [bb.x1, bb.y2]; // Bottom vertex
        const [x2, y2] = [bb.x1, bb.y1]; // Top vertex
        const [x3, y3] = [bb.x2, (bb.y1 + bb.y2) / 2]; // Middle vertex

        // Calculate the area of the full triangle
        const fullArea = Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);

        // Calculate areas of three sub-triangles formed by the point and triangle edges
        const area1 = Math.abs((x * (y2 - y3) + x2 * (y3 - y) + x3 * (y - y2)) / 2);
        const area2 = Math.abs((x1 * (y - y3) + x * (y3 - y1) + x3 * (y1 - y)) / 2);
        const area3 = Math.abs((x1 * (y2 - y) + x2 * (y - y1) + x * (y1 - y2)) / 2);

        // The point is inside the triangle if the sum of sub-areas equals the full area
        return Math.abs(fullArea - (area1 + area2 + area3)) < 0.00001; // Using small epsilon for float comparison
    }

    function withinCircle(x, y) {
        let [x1, y1] = [center, center]
        const dist = Math.sqrt((x - x1) ** 2 + (y - y1) ** 2);
        return dist >= (center - radius)
    }


    const handleMouseDown = (e) => {
        let [x, y] = getRelativeXY(e)
        if (x < 0 && y < 0) return

        if (withinTriangle_strict(x, y)) {
            setIsDraggingColor(true);
            updateColor(e);
        } else if (withinCircle(x, y)) {
            setIsDraggingHue(true);
            updateHue(e);
        }
    };

    const handleMouseMove = (e) => {
        if (isDraggingColor) {
            updateColor(e);
        } else if (isDraggingHue) {
            updateHue(e)
        }
    };

    const handleMouseUp = () => {
        setIsDraggingColor(false);
        setIsDraggingHue(false);
    };

    const updateColor = (e) => {
        let [x, y] = getRelativeXY(e)
        if (x < 0 && y < 0) return
        // console.log('x,y :>> ', x, y);

        //within bounding box
        if (withinTriangle(x, y)) {
            x -= bb.x1
            y -= bb.y1

            const { s, v } = getSVFromPosition(x / w, y / w)

            setSelectedColor({
                ...selectedColor,
                s: Math.max(0, Math.min(100, s)),
                v: Math.max(0, Math.max(0, v))
            });

        }
    };

    const updateHue = (e) => {
        const [x, y] = getRelativeXY(e)
        if (x < 0 && y < 0) return

        let hue = getHueFromPosition(x, y, center, center) - defaultHueShift
        if (hue < 0) hue += 360

        setSelectedColor({
            ...selectedColor,
            h: hue
        });
    };


    return (
        <div className='w-[300px] h-[300px] relative' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} ref={divRef}>
            <Image className='absolute' src={color_wheel} alt="color_wheel" width={300} height={300} draggable={false} style={{
                userSelect: 'none',
                WebkitUserDrag: 'none',
                KhtmlUserDrag: 'none',
                MozUserDrag: 'none',
                OUserDrag: 'none',
            }} />
            <HueShiftImage
                src={"https://i.imgur.com/BRVZgWi.png"}
                width={300}
                height={300}
                alt="color_combined"
                hueShift={selectedColor.h}
            />

            {/* Indictator, one with white outline, one with black outline */}
            <CircleIndicator position={selectedColorPosition} width={10} height={10} color="white" border_width={2} />
            <CircleIndicator position={selectedColorPosition} width={12} height={12} color="black" />
            <RectIndicator position={selectedHuePosition} width={10} height={22} color="white" border_width={2} rotation={selectedColor.h + 90 + defaultHueShift} />
            <RectIndicator position={selectedHuePosition} width={12} height={24} color="black" rotation={selectedColor.h + 90 + defaultHueShift} />
        </div>

    );
};

const CircleIndicator = ({ position, width, height, color, border_width = 1 }) => {
    return <div style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: width + 'px',
        height: height + 'px',
        borderRadius: '50%',
        border: border_width + 'px solid ' + color,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none'
    }} />
}


const RectIndicator = ({ position, width, height, color, border_width = 1, rotation = 0 }) => {
    return <div style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: width + 'px',
        height: height + 'px',
        border: border_width + 'px solid ' + color,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        pointerEvents: 'none'
    }} />
}


export const ColorPicker = ({ selectedColor, setSelectedColor }) => {
    return (
        <div>
            <TriangularColorPicker size={300} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />

            <div className="mt-4">
                <div className="mb-4">
                    <label className="block mb-2">Hue: {selectedColor.h}°</label>
                    <input
                        type="range"
                        min={0}
                        max={360}
                        step={1}
                        value={selectedColor.h}
                        onChange={(e) => setSelectedColor({ ...selectedColor, h: Number(e.target.value) })}
                        className="w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Saturation: {selectedColor.s}%</label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={selectedColor.s}
                        onChange={(e) => setSelectedColor({ ...selectedColor, s: Number(e.target.value) })}
                        className="w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Brightness: {selectedColor.v}%</label>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={selectedColor.v}
                        onChange={(e) => setSelectedColor({ ...selectedColor, v: Number(e.target.value) })}
                        className="w-full"
                    />
                </div>
            </div>
        </div>
    )
}
// export const SquareColorPicker = ({ size = 300, setSelectedColor }) => {

//     const canvasRef = useRef(null);
//     const [isDraggingColor, setIsDragging] = useState(false);
//     const [hue, setHue] = useState(0);
//     const [saturation, setSaturation] = useState(100);
//     const [value, setValue] = useState(100);

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         const ctx = canvas.getContext('2d');


//         const gradient = ctx.createLinearGradient(size, 0, 0, 0);
//         gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
//         gradient.addColorStop(1, "white");

//         ctx.beginPath();
//         ctx.moveTo(0, 0);
//         ctx.lineTo(0, size);
//         ctx.lineTo(size, size);
//         ctx.lineTo(size, 0);

//         ctx.closePath();
//         ctx.fillStyle = gradient;
//         ctx.fill();

//         const blackGradient = ctx.createLinearGradient(0, 0, 0, size);
//         blackGradient.addColorStop(0, "rgba(0,0,0,0)");
//         blackGradient.addColorStop(1, "rgba(0,0,0,1)");
//         ctx.fillStyle = blackGradient;
//         ctx.fill();

//         // Draw selector
//         const selectorX = (saturation / 100) * size;
//         const selectorY = (value / 100) * size;
//         ctx.beginPath();
//         ctx.arc(selectorX, selectorY, 5, 0, 2 * Math.PI);
//         ctx.strokeStyle = 'white';
//         ctx.stroke();
//         ctx.fillStyle = 'black';
//         ctx.fill();

//     }, [size, hue, saturation, value]);


//     const handleColorChange = (color) => {
//         setSelectedColor(color);
//     };


//     const handleMouseDown = (e) => {
//         setIsDragging(true);
//         handleMouseMove(e);
//     };

//     const handleMouseMove = (e) => {
//         if (!isDraggingColor) return;

//         const canvas = canvasRef.current;
//         const rect = canvas.getBoundingClientRect();
//         const x = e.clientX - rect.left;
//         const y = e.clientY - rect.top;

//         const centerX = size / 2;
//         const centerY = size / 2;
//         const dx = x - centerX;
//         const dy = y - centerY;

//         const angle = Math.atan2(dy, dx);
//         // let newHue = angle * (180 / Math.PI) + 90;
//         // if (newHue < 0) newHue += 360;

//         const distance = Math.sqrt(dx * dx + dy * dy);
//         if (distance <= size / 2) {
//             //   setHue(newHue);

//             // const triangleWidth = (size / 2) * Math.sqrt(3) / 2;
//             // const triangleHeight = centerY - triangleWidth / 2;

//             // if (y >= triangleHeight && y <= triangleHeight + triangleWidth) {
//             const newSaturation = x / size * 100;
//             const newValue = y / size * 100;

//             console.log('newSaturation, newValue :>> ', newSaturation, newValue);

//             setSaturation(Math.max(0, Math.min(100, newSaturation)));
//             setValue(Math.max(0, Math.min(100, newValue)));
//             // }
//         }
//     };

//     const handleMouseUp = () => {
//         setIsDragging(false);
//     };

//     useEffect(() => {
//         setSelectedColor({ h: hue, s: saturation, v: value });
//     }, [hue, saturation, value, setSelectedColor]);

//     return (
//         <canvas
//             ref={canvasRef}
//             width={size}
//             height={size}
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//         />
//     );
// };



