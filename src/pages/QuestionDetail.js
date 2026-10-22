import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const question = questions.find((q) => q.id === Number(id));

    if (!question) {
        return (
            <div>
                <h2>Không tìm thấy câu hỏi</h2>
                <button onClick={() => navigate(-1)}>Quay lại</button>
            </div>
        );
    }

    return (
        <div>
            <h2>
                Câu hỏi số {question.id} ({LEVELS[question.level]})
            </h2>
            <p style={{ fontWeight: 'bold' }}>{question.question}</p>
            <ul>
                {question.options.map((opt, index) => {
                    const isCorrect = index === question.answer;
                    return (
                        <li
                            key={index}
                            style={{
                                backgroundColor: isCorrect ? '#d4edda' : 'transparent',
                                padding: '5px',
                                marginBottom: '5px',
                                borderRadius: '4px'
                            }}
                        >
                            {LETTERS[index]}. {opt}
                            {isCorrect && (
                                <span style={{ color: 'green', marginLeft: '10px', fontWeight: 'bold' }}>
                                    (Đáp án đúng)
                                </span>
                            )}
                        </li>
                    );
                })}
            </ul>
            <button onClick={() => navigate(-1)} style={{ marginTop: '10px' }}>
                Quay lại
            </button>
        </div>
    );
};

export default QuestionDetail;