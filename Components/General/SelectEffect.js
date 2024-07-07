import { useCallback, useEffect, useState } from "react";

const selecting = {
    0: 'none',
    1: 'row',
    2: 'column',
}

function calculateRowIndex(location, cellWidth, cellSpacing) {
    return Math.round((location - cellWidth / 2) / (cellWidth + cellSpacing))
}

function findColorAtPosition(rowIndex, colIndex, dict, hue, useRow, useCol) {
    let l, s

    const defaultH = Object.keys(dict)[0]
    const lsDict = dict[hue] ? dict[hue] : dict[defaultH]
    l = Object.keys(lsDict).toReversed()[rowIndex]

    if (useRow) {
        const maxIndex = lsDict[l].length - 1
        s = lsDict[l][Math.min(maxIndex, colIndex)]
    } else {
        const array = Object.keys(lsDict)
        // pick color with the max saturation distance (50 is max)
        const maxWidthL = array.reduce((acc, num) => {
            const absValue = Math.abs(num - 50);
            return absValue < acc.absValue ? { value: num, absValue } : acc;
        }, { value: null, absValue: Infinity }).value;

        l = maxWidthL
        s = lsDict[l][colIndex]
    }
    return { h: hue, l, s }
}

const SelectEffect = ({ gridRef, hue = 30, setSelectedColor, resetVariable, dict, cellWidth = 48, cellSpacing = 4, useRow = true, useCol = true }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [selectedRow, setSelectingRow] = useState(-1);
    const [selectedCol, setSelectingCol] = useState(-1);

    useEffect(() => {
        setSelectingRow(-1)
        setSelectingCol(-1)
    }, [resetVariable]);

    useEffect(() => {
        //All selected
        if ((!useRow || selectedRow !== -1) && (!useCol || selectedCol !== -1)) {
            const color = findColorAtPosition(selectedRow, selectedCol, dict, hue, useRow, useCol)
            setSelectedColor(color)
            console.log('color :>> ', color);
        }
    }, [selectedRow, selectedCol]);

    const handleMouseMove = (event) => {
        const allSelected = (!useRow || selectedRow > -1) && (!useCol || selectedCol > -1)
        if (gridRef.current && !allSelected) {
            const rect = gridRef.current.getBoundingClientRect();
            // console.log('event.clientX :>> ', event.clientX);
            setMousePosition({
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            });
        }
    }

    const handleMouseClick = () => {
        if (selectedRow === -1 && useRow) {
            const rowIndex = calculateRowIndex(mousePosition.y, cellWidth, cellSpacing)
            setSelectingRow(rowIndex)
        } else
            if (selectedCol === -1 && useCol) {
                const colIndex = calculateRowIndex(mousePosition.x, cellWidth, cellSpacing)
                setSelectingCol(colIndex)
            }

    }

    const handleRightClick = (e) => {
        e.preventDefault()
        if (selectedCol >= 0 && useCol) {
            setSelectingCol(-1)
        } else {
            setSelectingRow(-1)
        }
    }

    useEffect(() => {
        const grid = gridRef.current;
        if (grid) {
            grid.addEventListener('mousemove', handleMouseMove);
            grid.addEventListener('click', handleMouseClick);
            grid.addEventListener('contextmenu', handleRightClick);
            return () => {
                grid.removeEventListener('mousemove', handleMouseMove);
                grid.removeEventListener('click', handleMouseClick);
                grid.removeEventListener('contextmenu', handleRightClick);
            };
        }
    }, [handleMouseMove]);

    const top = (selectedRow === -1 ? mousePosition.y - cellWidth / 2
        : (selectedRow) * (cellWidth + cellSpacing)) - cellSpacing


    const left = (selectedCol === -1 ? mousePosition.x - cellWidth / 2
        : (selectedCol) * (cellWidth + cellSpacing))- cellSpacing
    return (
        <div className=" mix-blend-multiply">
            {useRow && <div className='absolute inset-0 border-slate-700 border-solid border-4 pointer-events-none' style={{ top: top, width: '100%', height: cellWidth + cellSpacing *2}} />}
            {(useCol && (!useRow || selectedRow !== -1)) && <div className='absolute inset-0 border-slate-700 border-solid border-4 pointer-events-none' style={{ left, height: '100%', width: cellWidth + cellSpacing*2 }} />}
        </div>
    )
}

export default SelectEffect