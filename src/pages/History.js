import React from 'react';
import { formatMoney } from '../data';

const History = ({ history, onClearHistory }) => {
    if (!history || history.length === 0) {
        return (
            <div>
                <h2>Lịch sử các lượt chơi</h2>
                <p>Chưa có lượt chơi nào.</p>
            </div>
        );
    }

    // Thống kê tổng quan bằng reduce()
    const totalPlayCount = history.length;
    const maxPrize = history.reduce((max, item) => (item.prize > max ? item.prize : max), 0);
    const totalPrizeSum = history.reduce((sum, item) => sum + item.prize, 0);

    // Sắp xếp trên bản sao của mảng theo tiền thưởng giảm dần
    const sortedHistory = [...history].sort((a, b) => b.prize - a.prize);

    return (
        <div>
            <h2>Lịch sử các lượt chơi</h2>
            <div style={{ marginBottom: '15px', background: '#f9f9f9', padding: '10px', borderRadius: '5px' }}>
                <p>Số lượt chơi: <strong>{totalPlayCount}</strong></p>
                <p>Tiền thưởng cao nhất: <strong>{formatMoney(maxPrize)}</strong></p>
                <p>Tổng tiền thưởng: <strong>{formatMoney(totalPrizeSum)}</strong></p>
            </div>

            <button
                onClick={onClearHistory}
                style={{ marginBottom: '15px', padding: '6px 12px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            >
                Xóa lịch sử
            </button>

            <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th>Người chơi</th>
                        <th>Số câu đúng</th>
                        <th>Tiền thưởng</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedHistory.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.correctCount}/15</td>
                            <td>{formatMoney(item.prize)}</td>
                            <td>{item.playedAt}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default History;