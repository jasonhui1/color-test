import { useCallback, useEffect, useState } from "react";

const RevealEffect = ({ gridRef, maxLife = 5000, resetVariable }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHolding, setIsHolding] = useState(false);
    const [life, setLife] = useState(0);

    useEffect(() => {
        setLife(0)
        handleMouseLeave()
    }, [resetVariable]);

    const handleMouseMove = (event) => {
        if (gridRef.current  && isHolding) {
            const rect = gridRef.current.getBoundingClientRect();
            setMousePosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });
            setLife(life + 25);
        }
    }
    const handleMouseLeave = () => setMousePosition({ x: -1000, y: -1000 }); // Move spotlight off-screen
    const handleMouseDown = () => setIsHolding(true);
    const handleMouseUp = () => {setIsHolding(false); handleMouseLeave();}

    useEffect(() => {
        const grid = gridRef.current;
        if (grid) {
            grid.addEventListener('mousemove', handleMouseMove);
            grid.addEventListener('mouseleave', handleMouseLeave);
            grid.addEventListener('mousedown', handleMouseDown);
            grid.addEventListener('mouseup', handleMouseUp);
            return () => {
                grid.removeEventListener('mousemove', handleMouseMove);
                grid.removeEventListener('mouseleave', handleMouseLeave);
                grid.removeEventListener('mousedown', handleMouseDown);
                grid.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [handleMouseMove, handleMouseLeave]);

    const radius = 200
    const currentRadius = Math.max(50,radius * ((maxLife - life) / maxLife))

    // console.log('currentRadius, life, maxLife :>> ', currentRadius, life, maxLife);

    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: `radial-gradient(circle ${currentRadius}px at ${mousePosition.x}px ${mousePosition.y}px,  rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1), 50%,  rgba(255, 255, 255, 1))`,
                mixBlendMode: 'saturation',
                // opacity: mousePosition.x > 0 ? 1 : 0,
            }}
        />
    )
}

export default RevealEffect