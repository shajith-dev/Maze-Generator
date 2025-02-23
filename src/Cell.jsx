import { useContext } from 'react';
import { GridContext } from './Grid';

export default function Cell({ id }) {
    const { state, start, end, setStart, setEnd, maze } = useContext(GridContext);
    
    const handleClick = () => {
        console.log("clicked...");
        if (state === "SOLVE") {
            if (start !== null && end !== null) {
                setEnd(null);
                setStart(id);
            } else if (start !== null) {
                setEnd(id);
            } else {
                setStart(id);
            }
            console.log(id);
            console.log(maze);
        }
    };

    return (
        <div 
            className={`cell`}
            id={id}
            onClick={handleClick}
        />
    );
}