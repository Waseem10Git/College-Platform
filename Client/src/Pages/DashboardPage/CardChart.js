import React from 'react';

const CardChart = ({ selectedOptions }) => {
    return (
        <div style={{ width: '300px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', margin: '10px' }}>
            <h3>Selected Options Count</h3>
            <ul>
                {selectedOptions.map((option, index) => (
                    <li key={index}>
                        {option.label}: {option.count}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CardChart;
