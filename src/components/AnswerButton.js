import React from 'react';
import { LETTERS } from '../data';

const AnswerButton = ({ index, option, selectedAnswer, correctAnswer, status, isHidden, onSelect }) => {
    let bgColor = 'white';

    if (isHidden) {
        return (
            <button
                disabled
                style={{
                    padding: '12px',
                    fontSize: '16px',
                    backgroundColor: '#e0e0e0',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    cursor: 'not-allowed',
                    textAlign: 'left',
                    color: 'transparent'
                }}
            >
                {LETTERS[index]}.
            </button>
        );
    }

    if (status === 'locked' || status === 'revealed') {
        if (index === selectedAnswer) {
            bgColor = 'orange';
        }
    }

    if (status === 'revealed') {
        if (index === correctAnswer) {
            bgColor = '#d4edda';
        } else if (index === selectedAnswer && selectedAnswer !== correctAnswer) {
            bgColor = '#f8d7da';
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