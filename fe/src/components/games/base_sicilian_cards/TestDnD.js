import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import { useStoreon } from 'storeon/react';
import ACTIONS from '../../../store/actions';



function Knight() {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'something',
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));
    return <span ref={drag} style={{
        padding: '5px',
        background: !isDragging ? 'black' : 'white',
        color: isDragging ? 'black' : 'white',
        opacity: isDragging ? '.8' : '1',
        fontSize: '50px'
    }}>
        ♘
    </span>;
}

function Square({ coords, black, children }) {
    const { dispatch } = useStoreon();
    let fill = black ? 'black' : 'white';
    const stroke = black ? 'white' : 'black';
    const [x, y] = coords;
    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'something',
        canDrop: () => x !== y,
        drop: () => {
            console.log(`moved to ${x}, ${y}`);
            dispatch(ACTIONS.UI.NOTIFICATION.SHOW, { message: `moved to ${x}, ${y}` });
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }), [x, y]);

    fill = (!isOver) ? fill : ((isOver && canDrop) ? 'green' : 'red');

    return (
        <div
            style={{
                backgroundColor: fill,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stroke,
                width: '100%',
                height: '100%'
            }}
            ref={drop}
        >
            {children}
        </div>
    );
}

function renderSquare(i, [knightX, knightY]) {
    const x = i % 8;
    const y = Math.floor(i / 8);
    const isKnightHere = x === knightX && y === knightY;
    const black = (x + y) % 2 === 1;
    const piece = isKnightHere ? <Knight /> : null;

    return (
        <div key={i} style={{ width: '12.5%', height: '12.5%' }}>
            <Square coords={[x, y]} black={black}>{piece}</Square>
        </div>
    );
}

function is_touch_enabled() {
    return ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);
}

function Board({ knightPosition }) {
    const squares = [];
    for (let i = 0; i < 64; i++) {
        squares.push(renderSquare(i, knightPosition));
    }


    return (
        <DndProvider backend={!is_touch_enabled() ? HTML5Backend : TouchBackend}>
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexWrap: 'wrap'
                }}
            >
                {squares}
            </div>
        </DndProvider>
    );
}

const Test = () => {
    return (
        <>
            <Board knightPosition={[7, 4]} />
        </>
    );
};

export default Test;