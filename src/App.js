import React, { useState } from 'react';

const DuLieuMau = [
  { id: 1, name: 'Nguyễn Văn A', score: 7.4, class: '10A' },
  { id: 2, name: 'Trần Thị B', score: 8.1, class: '10B' },
  { id: 3, name: 'Lê Văn C', score: 4.9, class: '10C' },
];

const ThongTin = ({ id, name, score, class: className, onDelete }) => {
  const isPass = score >= 5;
  const statusText = score >= 8 ? 'Giỏi' : score < 5 ? 'Trượt' : 'Khá';
  const statusColor = score >= 8 ? 'green' : score < 5 ? 'red' : 'orange';

  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{className}</td>
      <td>{score}</td>
      <td style={{ color: statusColor, fontWeight: 'bold' }}>{statusText}</td>
      <td>
        <button onClick={() => onDelete(id)}>Xóa</button>
      </td>
    </tr>
  );
};

const DanhSach = ({ sinhVien, onDelete }) => {
  return (
    <table border="1" cellPadding="8" style={{ marginTop: '10px', width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Họ tên</th>
          <th>Lớp</th>
          <th>Điểm</th>
          <th>Trạng thái</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {sinhVien.length === 0 ? (
          <tr>
            <td colSpan="6" style={{ textAlign: 'center' }}>Không có sinh viên nào.</td>
          </tr>
        ) : (
          sinhVien.map((sv) => (
            <ThongTin
              key={sv.id}
              id={sv.id}
              name={sv.name}
              score={sv.score}
              class={sv.class}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  );
};

export default function App() {
  const [sinhVien, setSinhVien] = useState(DuLieuMau);
  const [newName, setNewName] = useState('');
  const [newScore, setNewScore] = useState('');
  const [newClass, setNewClass] = useState('');
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'GIOI', 'KHA', 'TRUOT'
  const [error, setError] = useState('');

  const handleAddStudent = (e) => {
    e.preventDefault();
    setError('');

    if (!newName.trim() || !newScore.trim() || !newClass.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const scoreNum = Number(newScore);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      setError('Điểm số không hợp lệ! (Phải từ 0 đến 10)');
      return;
    }
    const maxId = sinhVien.length > 0
      ? Math.max(...sinhVien.map((sv) => sv.id))
      : 0;
    const newStudent = {
      id: maxId + 1,
      name: newName.trim(),
      score: scoreNum,
      class: newClass.trim(),
    };

    setSinhVien([...sinhVien, newStudent]);
    setNewName('');
    setNewScore('');
    setNewClass('');
  };

  const handleDeleteStudent = (id) => {
    setSinhVien(sinhVien.filter((sv) => sv.id !== id));
  };

  const danhSachDaLoc = sinhVien.filter((sv) => {
    if (filter === 'GIOI') return sv.score >= 8;
    if (filter === 'KHA') return sv.score >= 5 && sv.score < 8;
    if (filter === 'TRUOT') return sv.score < 5;
    return true;
  });

  const tongSinhVien = sinhVien.length;
  const diemTrungBinh = tongSinhVien === 0
    ? 0
    : (sinhVien.reduce((sum, sv) => sum + sv.score, 0) / tongSinhVien).toFixed(2);

  return (
    <div style={{ padding: '20px', maxWidth: '700px', margin: '0 auto' }}>
      <h1>Xin chào !!!</h1>
      <h2>Quản lý điểm sinh viên</h2>

      <form onSubmit={handleAddStudent} style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Họ tên"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lớp"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
          style={{ marginLeft: '5px' }}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Điểm (0-10)"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
          style={{ marginLeft: '5px' }}
        />
        <button type="submit" style={{ marginLeft: '5px' }}>Thêm</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginTop: '15px' }}>
        <button onClick={() => setFilter('ALL')}>Tất cả</button>{' '}
        <button onClick={() => setFilter('GIOI')}>Giỏi </button>{' '}
        <button onClick={() => setFilter('KHA')}>Khá </button>{' '}
        <button onClick={() => setFilter('TRUOT')}>Trượt </button>

        <p>
          {`Tổng số sinh viên: ${tongSinhVien} | Điểm trung bình: ${diemTrungBinh}`}
        </p>
      </div>

      <DanhSach sinhVien={danhSachDaLoc} onDelete={handleDeleteStudent} />
    </div>
  );
}