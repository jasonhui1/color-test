import React, { useState, useRef, useEffect } from 'react';

export const TriangularColorPicker = ({ size = 300, setSelectedColor }) => {

    const canvasRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hue, setHue] = useState(0);
    const [saturation, setSaturation] = useState(100);
    const [value, setValue] = useState(100);


    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size  - 5;

    const triangleWidth = radius * Math.sqrt(3) / 2;
    const triangleHeight = centerY - triangleWidth / 2;

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');


        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Save the current context state
        ctx.save();

        // Translate and rotate the canvas
        ctx.translate(centerX, centerY);
        ctx.rotate(Math.PI / 2);
        ctx.translate(-centerX, -centerY);

        // Begin drawing the shape
        ctx.beginPath();
        ctx.moveTo(centerX, triangleHeight);
        ctx.lineTo(centerX - radius / 2, triangleHeight + triangleWidth);
        ctx.lineTo(centerX + radius / 2, triangleHeight + triangleWidth);
        ctx.closePath();

        // Fill the shape with a gradient
        const centerX1 = (centerX + centerX + radius / 2) / 2
        const centerY1 = (triangleHeight + triangleHeight + triangleWidth) / 2
        const gradient = ctx.createLinearGradient(centerX1, centerY1, centerX - radius / 2, triangleHeight + triangleWidth);
        gradient.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
        gradient.addColorStop(1, `hsl(${hue}, 0%, 100%)`);
        ctx.fillStyle = gradient;
        ctx.fill();


        // const centerX2 = (centerX + centerX - radius / 2)/2
        // const centerY2 = (triangleHeight+ triangleHeight + triangleWidth)/2
        // const blackGradient = ctx.createLinearGradient(centerX2, centerY2, centerX + radius / 2, triangleHeight + triangleWidth);
        // blackGradient.addColorStop(0, "rgba(0,0,0,0)");
        // blackGradient.addColorStop(1, "rgba(0,0,0,1)");
        // ctx.fillStyle = blackGradient;
        // ctx.fill();

        // Restore the context to its original state before the transformations
        ctx.restore();

        // Draw selector
        const selectorX = centerX + (saturation / 100 - 0.5) * radius;
        const selectorY = triangleHeight + triangleWidth - (value / 100 * triangleWidth);
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
        console.log('x,y :>> ', x, y);

        const centerX = size / 2;
        const centerY = size / 2;

        const w = 300
        const h = 200

        const horizontalLineLength = y * (2. / Math.sqrt(3.));
        const horizontalLineStart = triangleWidth / 2. - horizontalLineLength / 2.;
        const relativeX = x - horizontalLineStart;

        const newValue = (y) / (triangleWidth) *100;
        const newSaturation = relativeX / (horizontalLineLength) *100;

        console.log('newValue, newSaturation :>> ', newValue, newSaturation);
        console.log('triangleWidth, triangleHeight:>> ', triangleWidth, triangleHeight);

        setSaturation(Math.max(0, Math.min(100, newSaturation)));
        setValue(Math.max(0, Math.max(0, 100-newValue)));
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



