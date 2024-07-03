import { useEffect, useRef, useState } from "react";
import h337 from 'heatmap.js';
import Image from "../../node_modules/next/image";


const configs = {
    maxOpacity: 0.5,
    minOpacity: 0,
    blur: 0.5,
    gradient: {
        // Customize these colors as needed
        // The numbers represent the position in the gradient (0 to 1)
        '0.6': 'red',    // Color for middle values
        // '0.8': 'orange',    // Color for higher values
        '1': 'white'   // Color for highest values
    }
}


const HeatmapComponent = ({ data, width = 300, height = 300, clipPath = `path('M 88 45 L 88 255 L 269 150 z')` }) => {
    const heatmapRef = useRef(null);
    const heatmapInstance = useRef(null);
    const [url, setUrl] = useState('');



    useEffect(() => {
        if (heatmapRef.current && !heatmapInstance.current) {
            heatmapInstance.current = h337.create({
                container: heatmapRef.current,
                ...configs,
            });
        }

        if (heatmapInstance.current && data) {
            heatmapInstance.current.setData(data);
            setUrl(heatmapInstance.current.getDataURL());
        }
    }, [data]);


    return (
        <div className=" relative flex" style={{ width: width, height: height }}>
            {/* <div className="absolute left-[9999px]" ref={heatmapRef} style={{ width: '100%', height: '100%', clipPath: `${clipPath}`, }} /> */}
            <div className="absolute" ref={heatmapRef} style={{ width: '100%', height: '100%', clipPath: `${clipPath}`, }} />
            {/* <Image src={url} alt="image" width={400} height={400} /> */}
        </div>
    );
};

export default HeatmapComponent