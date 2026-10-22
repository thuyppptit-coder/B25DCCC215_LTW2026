import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');

  // Khởi tạo state history từ localStorage
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('ltw_trieuphu_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  // Lưu history vào localStorage mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem('ltw_trieuphu_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((response) => {
        setQuestions(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message);
        } else {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  const addHistory = (record) => {
    setHistory((prev) => [record, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  if (loading) {
    return <div>Đang tải câu hỏi...</div>;
  }

  if (error) {
    return <div>Không tải được câu hỏi</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} history={history} />} />
        <Route path="play" element={<Play playerName={playerName} questions={questions} addHistory={addHistory} />} />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<History history={history} onClearHistory={handleClearHistory} />} />
        <Route path="questions" element={<QuestionBank questions={questions} />} />
        <Route path="questions/:id" element={<QuestionDetail questions={questions} />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;