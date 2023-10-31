'use client';
import React, {useState} from 'react';

export default function MyButton() {
    const [count, setCount] = useState<number[]>([0]);  
  
    function handleClick() {
        setCount(count => count.concat( Math.floor(Math.random() * 11) ));
        //alert(count);
    }

    return (
        <div>
            <button onClick={handleClick}>
                {"click"}
            </button>

            {count.map((x) => x + " ")}
            
            {/* {count.map((count, index) => (
                <h5 key={index}>{count}</h5>
            ))} */}
           
        </div>
    );
}