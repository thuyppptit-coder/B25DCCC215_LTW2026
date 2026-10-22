import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, setPlayerName }) => {
    const navigate = useNavigate();

    const handleStart = (e) => {
        e.preventDefault();
        if (playerName.trim()) {
            navigate('/play');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h1>Ai là triệu phú - Phiên bản Lập trình Web</h1>
            <div
                style={{
                    maxWidth: '600px',
                    margin: '0 auto',
                    textAlign: 'left',
                    background: '#f9f9f9',
                    padding: '15px',
                    borderRadius: '5px',
                    marginBottom: '20px'
                }}
            >
                <h3>Luật chơi:</h3>
                <ul>
                    <li>Trả lời lần lượt 15 câu hỏi trắc nghiệm, mỗi câu có 30 giây[cite: 1, 11].</li>
                    <li>Câu 5, 10, 15 là các mốc an toàn[cite: 4, 11].</li>
                    <li>Trả lời sai hoặc hết giờ chỉ nhận tiền của mốc cao nhất đã vượt qua, chưa qua mốc nào nhận 0 đ[cite: 4, 11].</li>
                    <li>Trả lời đúng cả 15 câu nhận 250.000.000 đ[cite: 4, 11].</li>
                </ul>
            </div>

            <form onSubmit={handleStart}>
                <input
                    type="text"
                    placeholder="Nhập tên người chơi..."
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    style={{ padding: '8px', fontSize: '16px', width: '250px', marginRight: '10px' }}
                />
                <button
                    type="submit"
                    disabled={!playerName.trim()}
                    style={{
                        padding: '8px 16px',
                        fontSize: '16px',
                        cursor: playerName.trim() ? 'pointer' : 'not-allowed'
                    }}
                >
                    Bắt đầu
                </button>
            </form>
        </div>
    );
};

export default Home;