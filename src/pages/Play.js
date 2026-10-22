import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';

const Play = ({ playerName, questions, addHistory }) => {
    const navigate = useNavigate();

    // 1. TẤT CẢ CÁC HOOKS (useState) PHẢI ĐẶT Ở TRÊN CÙNG
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
    const [status, setStatus] = useState('answering');
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isTimeOut, setIsTimeOut] = useState(false);
    const [usedLifelines, setUsedLifelines] = useState({
        fiftyFifty: false,
        audience: false,
    });
    const [hiddenOptions, setHiddenOptions] = useState([]);
    const [showAudience, setShowAudience] = useState(false);

    const currentQuestion = questions && questions[currentIndex] ? questions[currentIndex] : null;

    // 2. KHAI BÁO CÁC HOOKS useCallback
    const finishGame = useCallback((correctCnt, reasonType) => {
        const prizeVal = calcPrize(correctCnt, reasonType);
        const record = {
            id: Date.now(),
            name: playerName,
            prize: prizeVal,
            correctCount: correctCnt,
            playedAt: new Date().toLocaleString("vi-VN"),
        };
        addHistory(record);
        navigate('/result', {
            replace: true,
            state: { playerName, prize: prizeVal, correctCount: correctCnt, reason: reasonType }
        });
    }, [playerName, addHistory, navigate]);

    const handleSelectAnswer = useCallback((index) => {
        if (status !== 'answering') return;
        if (hiddenOptions.includes(index)) return;
        setSelectedAnswer(index);
        setStatus('locked');
    }, [status, hiddenOptions]);

    // 3. KHAI BÁO TẤT CẢ CÁC HOOKS useEffect
    useEffect(() => {
        document.title = `Câu ${currentIndex + 1}/15 – ${playerName}`;
        return () => {
            document.title = 'Ai là triệu phú';
        };
    }, [currentIndex, playerName]);

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
                        finishGame(15, 'win');
                    } else {
                        setCurrentIndex((prev) => prev + 1);
                        setSelectedAnswer(null);
                        setTimeLeft(TIME_PER_QUESTION);
                        setIsTimeOut(false);
                        setHiddenOptions([]);
                        setShowAudience(false);
                        setStatus('answering');
                    }
                } else {
                    const correctCount = currentIndex;
                    const reasonType = isTimeOut ? 'timeout' : 'wrong';
                    finishGame(correctCount, reasonType);
                }
            }, 2000);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [status, selectedAnswer, currentIndex, currentQuestion, isTimeOut, finishGame]);

    useEffect(() => {
        const handleKey = (e) => {
            if (status !== 'answering') return;
            const key = e.key.toUpperCase();
            const mapKey = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
            if (mapKey[key] !== undefined) {
                handleSelectAnswer(mapKey[key]);
            }
        };

        window.addEventListener('keydown', handleKey);
        return () => {
            window.removeEventListener('keydown', handleKey);
        };
    }, [status, handleSelectAnswer]);

    // 4. CÁC CÂU LỆNH ĐIỀU KIỆN / RETURN PHẢI NẶM Ở DƯỚI CÙNG (SAU TẤT CẢ CÁC HOOKS)
    if (!playerName) {
        return <Navigate to="/" replace />;
    }

    if (!currentQuestion) {
        return <div>Đang tải câu hỏi...</div>;
    }

    // Các hàm xử lý sự kiện phụ
    const handleUse5050 = () => {
        if (usedLifelines.fiftyFifty || status !== 'answering') return;
        const wrongOptions = currentQuestion.options
            .map((_, idx) => idx)
            .filter((idx) => idx !== currentQuestion.answer);

        wrongOptions.sort(() => Math.random() - 0.5);
        const toHide = wrongOptions.slice(0, 2);

        setHiddenOptions(toHide);
        setUsedLifelines((prev) => ({ ...prev, fiftyFifty: true }));
    };

    const handleUseAudience = () => {
        if (usedLifelines.audience || status !== 'answering') return;
        setShowAudience(true);
        setUsedLifelines((prev) => ({ ...prev, audience: true }));
    };

    const handleStopGame = () => {
        if (status !== 'answering') return;
        finishGame(currentIndex, 'stop');
    };

    return (
        <div>
            <h2>Màn hình chơi game</h2>
            <Lifelines
                usedLifelines={usedLifelines}
                onUse5050={handleUse5050}
                onUseAudience={handleUseAudience}
                onStopGame={handleStopGame}
            />
            <Timer timeLeft={timeLeft} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <QuestionCard
                    currentQuestionIndex={currentIndex}
                    questionData={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    status={status}
                    hiddenOptions={hiddenOptions}
                    onSelectAnswer={handleSelectAnswer}
                />
                <MoneyLadder currentQuestionIndex={currentIndex} />
            </div>
            {showAudience && (
                <AudienceChart
                    options={currentQuestion.options}
                    correctAnswer={currentQuestion.answer}
                    hiddenOptions={hiddenOptions}
                />
            )}
        </div>
    );
};

export default Play;