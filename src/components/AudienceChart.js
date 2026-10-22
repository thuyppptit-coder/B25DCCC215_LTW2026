import React from 'react';
import { LETTERS } from '../data';

const AudienceChart = ({ options, correctAnswer, hiddenOptions }) => {
    // Tính toán tỉ lệ % ngẫu nhiên cho khán giả
    const generatePercentages = () => {
        let percentages = [0, 0, 0, 0];
        let correctShare = Math.floor(Math.random() * 31) + 40; // 40% - 70%
        percentages[correctAnswer] = correctShare;

        let remainingPercent = 100 - correctShare;
        let availableIndices = options
            .map((_, idx) => idx)
            .filter((idx) => idx !== correctAnswer && !hiddenOptions.includes(idx));

        if (availableIndices.length === 0) {
            percentages[correctAnswer] = 100;
            return percentages;
        }

        // Chia phần trăm còn lại cho các đáp án sai còn hiển thị
        availableIndices.forEach((idx, i) => {
            if (i === availableIndices.length - 1) {
                percentages[idx] = remainingPercent;
            } else {
                let share = Math.floor(Math.random() * (remainingPercent + 1));
                percentages[idx] = share;
                remainingPercent -= share;
            }
        });

        return percentages;
    };

    const chartData = generatePercentages();

    return (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f1f1f1', borderRadius: '5px' }}>
            <h4>Ý kiến khán giả:</h4>
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '120px' }}>
                {options.map((_, index) => {
                    const percent = hiddenOptions.includes(index) ? 0 : chartData[index];
                    return (
                        <div key={index} style={{ textAlign: 'center', width: '20%' }}>
                            <div style={{ fontSize: '12px', marginBottom: '5px' }}>{percent}%</div>
                            <div
                                style={{
                                    height: `${percent * 1}px`,
                                    backgroundColor: '#007bff',
                                    width: '30px',
                                    margin: '0 auto',
                                    transition: 'height 0.3s'
                                }}
                            />
                            <div style={{ marginTop: '5px', fontWeight: 'bold' }}>{LETTERS[index]}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AudienceChart;