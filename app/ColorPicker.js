import React, { useState, useRef, useEffect } from 'react';
import color_picker from "../public/color_picker.png";
import color_wheel from "../public/color_wheel.png";
import color_combined from "../public/color_combined.png";
import Image from 'next/image';
import HueShiftImage from './HueShiftImage';

export const TriangularColorPicker = ({ size = 300, selectedColor, setSelectedColor }) => {

    const [isDragging, setIsDragging] = useState(false);
    const [saturation, setSaturation] = useState(100);
    const [value, setValue] = useState(100);
    const divRef = useRef(null);


    //top 88 45
    //bot 88 255
    //mid 269 149
    const bb = { x1: 88, y1: 45, x2: 269, y2: 255 }
    const w = bb.y2 - bb.y1


    //Calculate the position
    const position = { x: 0, y: 0 };
    let y = (100 - selectedColor.v) / 100
    let yh = (y < 0.5) ? y : 1 - y
    let horizontalLineLength = Math.tan(Math.PI / 3) * yh * w
    position.x = selectedColor.s / 100 * horizontalLineLength + bb.x1

    position.y = (100 - selectedColor.v) / 100 * w + bb.y1

    const handleMouseDown = (e) => {
        setIsDragging(true);
        updateColor(e);
    };


    const handleMouseMove = (e) => {
        if(!isDragging) return
        updateColor(e);
    };

    const updateColor = (e) => {
        if (divRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            let x = e.clientX - rect.left;
            let y = e.clientY - rect.top;
            // console.log('x,y :>> ', x, y);

            //within bounding box
            if (x > bb.x1 && y > bb.y1 && x < bb.x2 && y < bb.y2) {
                x -= bb.x1
                y -= bb.y1

                //trigonometry
                let yh = (y < 0.5 * w) ? y : w - y
                let horizontalLineLength = Math.tan(Math.PI / 3) * yh
                const newSaturation = x / horizontalLineLength * 100

                const newValue = 100 - (y) / (w) * 100;

                setSelectedColor({
                    ...selectedColor,
                    s: Math.max(0, Math.min(100, newSaturation)),
                    v: Math.max(0, Math.max(0, newValue))
                });

            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    return (
        <div className='w-[300px] h-[300px] relative' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onClick={updateColor} ref={divRef}>
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
            <div style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: '2px solid white',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute',
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                border: '1px solid black',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
            }} />
        </div>

    );
};

export const SquareColorPicker = ({ size = 300, setSelectedColor }) => {

    const canvasRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(100);
    const [value, setValue] = useState(100);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');


        const gradient = ctx.createLinearGradient(size, 0, 0, 0);
        gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
        gradient.addColorStop(1, "white");

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(size, size);
        ctx.lineTo(size, 0);

        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        const blackGradient = ctx.createLinearGradient(0, 0, 0, size);
        blackGradient.addColorStop(0, "rgba(0,0,0,0)");
        blackGradient.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = blackGradient;
        ctx.fill();

        // Draw selector
        const selectorX = (saturation / 100) * size;
        const selectorY = (value / 100) * size;
        ctx.beginPath();
        ctx.arc(selectorX, selectorY, 5, 0, 2 * Math.PI);
        ctx.strokeStyle = 'white';
        ctx.stroke();
        ctx.fillStyle = 'black';
        ctx.fill();

    }, [size, hue, saturation, value]);


    const handleColorChange = (color) => {
        setSelectedColor(color);
    };


    const handleMouseDown = (e) => {
        setIsDragging(true);
        handleMouseMove(e);
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = size / 2;
        const centerY = size / 2;
        const dx = x - centerX;
        const dy = y - centerY;

        const angle = Math.atan2(dy, dx);
        // let newHue = angle * (180 / Math.PI) + 90;
        // if (newHue < 0) newHue += 360;

        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= size / 2) {
            //   setHue(newHue);

            // const triangleWidth = (size / 2) * Math.sqrt(3) / 2;
            // const triangleHeight = centerY - triangleWidth / 2;

            // if (y >= triangleHeight && y <= triangleHeight + triangleWidth) {
            const newSaturation = x / size * 100;
            const newValue = y / size * 100;

            console.log('newSaturation, newValue :>> ', newSaturation, newValue);

            setSaturation(Math.max(0, Math.min(100, newSaturation)));
            setValue(Math.max(0, Math.min(100, newValue)));
            // }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        setSelectedColor({ h: hue, s: saturation, v: value });
    }, [hue, saturation, value, setSelectedColor]);

    return (
        <canvas
            ref={canvasRef}
            width={size}
            height={size}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        />
    );
};



