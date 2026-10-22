import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

const Play = ({ playerName, questions }) => {
    const navigate = useNavigate();

    // 1. TẤT CẢ CÁC HOOKS (useState, useEffect) PHẢI ĐƯỢC ĐẶT Ở TRÊN CÙNG
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [status, setStatus] = useState('answering');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isTimeOut, setIsTimeOut] = useState(false);

    const currentQuestion = questions && questions[currentIndex] ? questions[currentIndex] : null;

    useEffect(() => {
        if (status !== 'answering') return;

        const timerId = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    setIsTimeOut(true);
                    setStatus('locked');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [status, currentIndex]);

    useEffect(() => {
        let timeoutId;

        if (status === 'locked') {
            timeoutId = setTimeout(() => {
                setStatus('revealed');
            }, 1000);
        } else if (status === 'revealed') {
            timeoutId = setTimeout(() => {
                if (!currentQuestion) return;
                const isCorrect = !isTimeOut && selectedAnswer === currentQuestion.answer;

                if (isCorrect) {
                    if (currentIndex === 14) {
                        const prize = calcPrize(15, 'win');
                        navigate('/result', {
                            replace: true,
                            state: { playerName, prize, correctCount: 15, reason: 'win' }
                        });
                    } else {
                        setCurrentIndex((prev) => prev + 1);
                        setSelectedAnswer(null);
                        setTimeLeft(TIME_PER_QUESTION);
                        setIsTimeOut(false);
                        setStatus('answering');
                    }
                } else {
                    const correctCount = currentIndex;
                    const reason = isTimeOut ? 'timeout' : 'wrong';
                    const prize = calcPrize(correctCount, reason);

                    navigate('/result', {
                        replace: true,
                        state: { playerName, prize, correctCount, reason }
                    });
                }
            }, 2000);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [status, selectedAnswer, currentIndex, currentQuestion, isTimeOut, playerName, navigate]);

    const handleSelectAnswer = (index) => {
        if (status !== 'answering') return;
        setSelectedAnswer(index);
        setStatus('locked');
    };

    // 2. ĐOẠN CHẶN ĐIỀU KIỆN (RETURN) PHẢI ĐẶT SAU TẤT CẢ CÁC HOOKS
    if (!playerName) {
        return <Navigate to="/" replace />;
    }

    if (!currentQuestion) {
        return <div>Đang tải câu hỏi...</div>;
    }

    return (
        <div>
            <h2>Màn hình chơi game</h2>
            <Timer timeLeft={timeLeft} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <QuestionCard
                    currentQuestionIndex={currentIndex}
                    questionData={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    status={status}
                    onSelectAnswer={handleSelectAnswer}
                />
                <MoneyLadder currentQuestionIndex={currentIndex} />
            </div>
        </div>
    );
};

export default Play;