import React from 'react';
import { LETTERS } from '../data';

const AnswerButton = ({ index, option, selectedAnswer, correctAnswer, status, onSelect }) => {
    let bgColor = 'white';

    if (status === 'locked' || status === 'revealed') {
        if (index === selectedAnswer) {
            bgColor = 'orange'; // Đang chốt
        }
    }

    if (status === 'revealed') {
        if (index === correctAnswer) {
            bgColor = '#d4edda'; // Xanh lá cho đáp án đúng
        } else if (index === selectedAnswer && selectedAnswer !== correctAnswer) {
            bgColor = '#f8d7da'; // Đỏ cho đáp án đã chọn nhưng sai
        }
    }

    return (
        <button
            onClick={() => onSelect(index)}
            disabled={status !== 'answering'}
            style={{
                padding: '12px',
                fontSize: '16px',
                backgroundColor: bgColor,
                border: '1px solid #ccc',
                borderRadius: '5px',
                cursor: status === 'answering' ? 'pointer' : 'not-allowed',
                textAlign: 'left'
            }}
        >
            {LETTERS[index]}. {option}
        </button>
    );
};

export default AnswerButton;