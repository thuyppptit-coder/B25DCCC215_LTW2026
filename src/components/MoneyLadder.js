import React from 'react';
import { PRIZES, formatMoney } from '../data';

const MoneyLadder = ({ currentQuestionIndex }) => {
    const ladderItems = [...PRIZES]
        .map((prize, idx) => {
            const questionLevel = idx + 1;
            const isCurrent = questionLevel === currentQuestionIndex + 1;
            const isMilestone = questionLevel === 5 || questionLevel === 10 || questionLevel === 15;

            return {
                level: questionLevel,
                prize,
                isCurrent,
                isMilestone
            };
        })
        .reverse();

    return (
        <div
            style={{
                width: '250px',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '5px',
                background: '#fafafa'
            }}
        >
            <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>Thang tiền thưởng</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {ladderItems.map((item) => {
                    let bg = 'transparent';
                    if (item.isCurrent) bg = '#ffc107'; // Tô sáng bậc hiện tại

                    return (
                        <li
                            key={item.level}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: bg,
                                fontWeight: item.isMilestone || item.isCurrent ? 'bold' : 'normal',
                                display: 'flex',
                                justifyContent: 'space-between',
                                borderBottom: '1px solid #eee'
                            }}
                        >
                            <span>{item.level}</span>
                            <span>{formatMoney(item.prize)}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default MoneyLadder;