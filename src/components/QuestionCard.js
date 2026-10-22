import React from 'react';
import AnswerButton from './AnswerButton';

const QuestionCard = ({ currentQuestionIndex, questionData, selectedAnswer, status, hiddenOptions, onSelectAnswer }) => {
    if (!questionData) return null;

    return (
        <div style={{ flex: 1, marginRight: '20px' }}>
            <h3>Câu {currentQuestionIndex + 1}/15</h3>
            <p style={{ fontSize: '18px', fontWeight: 'bold', minHeight: '60px' }}>
                {questionData.question}
            </p>
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px',
                    marginTop: '20px'
                }}
            >
                {questionData.options.map((opt, index) => (
                    <AnswerButton
                        key={index}
                        index={index}
                        option={opt}
                        selectedAnswer={selectedAnswer}
                        correctAnswer={questionData.answer}
                        status={status}
                        isHidden={hiddenOptions.includes(index)}
                        onSelect={onSelectAnswer}
                    />
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;