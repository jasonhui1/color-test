import { useCallback, useEffect, useState } from "react";

const RevealEffect = ({ gridRef }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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
    }, [handleMouseMove, handleMouseLeave]);

    return (
        <div
            className="absolute inset-0 pointer-events-none"
            style={{
                background: `radial-gradient(circle 150px at ${mousePosition.x}px ${mousePosition.y}px,  rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.1), 50%,  rgba(255, 255, 255, 1))`,
                mixBlendMode: 'color',
                // opacity: mousePosition.x > 0 ? 1 : 0,
            }}
        />
    )
}

export default RevealEffect