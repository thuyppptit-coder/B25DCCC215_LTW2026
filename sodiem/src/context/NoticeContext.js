import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
    const [notice, setNotice] = useState(null);

    const showNotice = useCallback((text) => {
        setNotice({ text, id: Date.now() });
    }, []);

    useEffect(() => {
        if (!notice) return;
        const timer = setTimeout(() => {
            setNotice(null);
        }, 3000);
        return () => clearTimeout(timer);
    }, [notice]);

    return (
        <NoticeContext.Provider value={showNotice}>
            {notice && (
                <div
                    role="status"
                    style={{
                        position: 'fixed',
                        top: 16,
                        right: 16,
                        background: '#2563eb',
                        color: '#fff',
                        padding: '10px 16px',
                        borderRadius: 6,
                        zIndex: 1000,
                    }}
                >
                    {notice.text}
                </div>
            )}
            {children}
        </NoticeContext.Provider>
    );
};

export const useNotice = () => {
    return useContext(NoticeContext);
};