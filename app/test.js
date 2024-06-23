import React, { useEffect, useState } from 'react';
import { hexToHsl } from './utils';
import {TriangularColorPicker} from './ColorPicker';
import {SquareColorPicker} from './ColorPicker';
import { hsvToHex } from 'colorsys';
// const ColorWheel = ({hex, setHex}) => {
//     return (
//         <Sketch
//             style={{ marginLeft: 20 }}
//             color={hex}
//             onChange={(color) => {
//                 setHex(color.hex);
//             }}
//         />
//     );
// }

const ColorTrainingTool = () => {
    const [selectedColor, setSelectedColor] = useState({ h: 40, s: 100, v: 100 });
    // const [hue, setHue] = useState(180);
    // const [saturation, setSaturation] = useState(50);
    // const [brightness, setBrightness] = useState(50);
    const backgroundColor = `hsl(${selectedColor.h}, ${selectedColor.s}%, ${selectedColor.v}%)`;
    // const rgb  = selectedColor hsvToHex
    // const backgroundColor = hsvToHex(selectedColor.h,selectedColor.s,selectedColor.v);

    // useEffect(() => {
    //     setHue(selectedColor.h)
    //     setSaturation(selectedColor.s)
    //     setBrightness(selectedColor.v)
  
    // }, [selectedColor])
    

    const cardStyle = {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    };

    const colorDisplayStyle = {
        width: '100%',
        height: '160px',
        marginBottom: '16px',
        borderRadius: '4px',
    };

    const sliderContainerStyle = {
        marginBottom: '16px',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '8px',
    };

    const sliderStyle = {
        width: '100%',
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '16px' }}>
            <div style={cardStyle}>
                <h2 style={{ marginTop: 0 }}>Color Training Tool for Anime Illustration</h2>
                <div
                    style={{ ...colorDisplayStyle, backgroundColor }}
                ></div>
                <div>
                    <div style={sliderContainerStyle}>
                        <label style={labelStyle}>Hue: {selectedColor.h}°</label>
                        <input
                            type="range"
                            min={0}
                            max={360}
                            step={1}
                            value={selectedColor.h}
                            onChange={(e) => setSelectedColor({ ...selectedColor, h: Number(e.target.value) })}
                            style={sliderStyle}
                        />
                    </div>
                    <div style={sliderContainerStyle}>
                        <label style={labelStyle}>Saturation: {selectedColor.s}%</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={selectedColor.s}
                            onChange={(e) => setSelectedColor({ ...selectedColor, s: Number(e.target.value) })}
                            style={sliderStyle}
                        />
                    </div>
                    <div style={sliderContainerStyle}>
                        <label style={labelStyle}>Brightness: {selectedColor.v}%</label>
                        <input
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={selectedColor.v}
                            onChange={(e) =>setSelectedColor({ ...selectedColor, v: Number(e.target.value) })}
                            style={sliderStyle}
                        />
                    </div>
                </div>
            </div>
        <TriangularColorPicker size={300} selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        {/* <SquareColorPicker size={300} setSelectedColor={setSelectedColor} /> */}
            

        </div>

    );
};


export default ColorTrainingTool;