import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Result = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state;

    if (!state) {
        return <Navigate to="/" replace />;
    }

    const { playerName, prize, correctCount, reason } = state;

    let titleMessage = '';
    if (reason === 'win') {
        titleMessage = 'Chúc mừng! Bạn đã trở thành triệu phú';
    } else if (reason === 'wrong') {
        titleMessage = 'Rất tiếc, bạn đã trả lời sai';
    } else if (reason === 'timeout') {
        titleMessage = 'Hết giờ!';
    } else if (reason === 'stop') {
        titleMessage = 'Bạn đã dừng cuộc chơi';
    }

    return (
        <div style={{ textAlign: 'center', padding: '30px' }}>
            <h2>{titleMessage}</h2>
            <div style={{ fontSize: '18px', margin: '20px 0' }}>
                <p>Người chơi: <strong>{playerName}</strong></p>
                <p>Số câu trả lời đúng: <strong>{correctCount}/15</strong></p>
                <p>Tiền thưởng: <strong style={{ color: 'green' }}>{formatMoney(prize)}</strong></p>
            </div>
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={() => navigate('/play')}
                    style={{ padding: '10px 20px', marginRight: '10px', fontSize: '16px', cursor: 'pointer' }}
                >
                    Chơi lại
                </button>
                <button
                    onClick={() => navigate('/')}
                    style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
                >
                    Về trang chủ
                </button>
            </div>
        </div>
    );
};

export default Result;