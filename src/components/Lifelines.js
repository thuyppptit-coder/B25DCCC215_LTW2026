import React from 'react';

const Lifelines = ({ usedLifelines, onUse5050, onUseAudience, onStopGame }) => {
    return (
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <button
                onClick={onUse5050}
                disabled={usedLifelines.fiftyFifty}
                style={{ padding: '8px 12px', cursor: usedLifelines.fiftyFifty ? 'not-allowed' : 'pointer' }}
            >
                50:50
            </button>
            <button
                onClick={onUseAudience}
                disabled={usedLifelines.audience}
                style={{ padding: '8px 12px', cursor: usedLifelines.audience ? 'not-allowed' : 'pointer' }}
            >
                Hỏi khán giả
            </button>
            <button
                onClick={onStopGame}
                style={{ padding: '8px 12px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none' }}
            >
                Dừng cuộc chơi
            </button>
        </div>
    );
};

export default Lifelines;