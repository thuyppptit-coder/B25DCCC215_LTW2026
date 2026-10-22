import React from 'react';

const Timer = ({ timeLeft }) => {
    return (
        <div style={{ marginBottom: '15px', fontSize: '18px', fontWeight: 'bold' }}>
            Thời gian:{' '}
            <span style={{ color: timeLeft <= 10 ? 'red' : 'black' }}>
                Còn {timeLeft} giây
            </span>
        </div>
    );
};

export default Timer;