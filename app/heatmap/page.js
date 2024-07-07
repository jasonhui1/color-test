"use client"
// HeatmapComponent.js
import React, { useState } from 'react';
import HeatmapComponent from '../../Components/Evaluation/Heatmap';

const App = () => {
    const [heatmapData, setHeatmapData] = useState({
        max: 100,
        data: [
            // { x: 100, y: 115, value: 0.9 },
            // { x: 120, y: 150, value: 0.8 },
            // { x: 200, y: 180, value: 0.1 },
            
            { x: 123, y: 213, value: 90, radius: 26.25 }
        ]
    });

    const addRandomDataPoint = () => {
        const newPoint = []

        for (let index = 0; index < 10; index++) {
            newPoint.push({
                x: Math.floor(Math.random() * 400),
                y: Math.floor(Math.random() * 400),
                value: Math.floor(Math.random() * 5) + 1
            })

        }

        setHeatmapData(prevData => ({
            ...prevData,
            data: [...prevData.data, ...newPoint]
        }));
    };

    return (
        <div>
            <button onClick={addRandomDataPoint}>Add Random Data Point</button>
            <HeatmapComponent
                data={heatmapData}
            />
        </div>
    );
};

export default App;