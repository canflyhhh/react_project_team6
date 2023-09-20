'use client';
import {useState} from 'react';
export default function MyButton() {
    const [Array, setArray] = useState([0]);
    function handleClick(){
        //count = Math.floor(Math.random()*10);
        let count = Math.floor(Math.random()*11);
        setArray(Array => Array.concat(count));
    }

    return (
        <div>
            {Array.map((x) => x+" ")}
            <button onClick={handleClick}>
                click me
            </button>
        </div>
    )
}